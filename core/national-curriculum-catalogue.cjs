'use strict';
/* Reference curriculum cataloguing, not an approved instructional word annotation.
   Explicit priority: source year band remains separate from teaching-pattern hypotheses. */
const SOURCE=require('./england-national-curriculum-source-v1.json');
const PAGE=SOURCE.source.url;
const GROUPS={
 early_exception:'Common exception / spelling-to-sound mapping',
 adjacent_consonant:'Adjacent consonants and consonant clusters',
 consonant_double:'Doubled consonant spelling',
 vowel_digraph:'Vowel digraphs and alternative graphemes',
 phonics_pattern:'Phonics-linked grapheme pattern',
 suffix_family:'Suffixes and word endings',
 prefix_family:'Prefixes and base words',
 word_family:'Meaningful roots and word families',
 homophone_context:'Homophones: meaning and context',
 orthographic_irregularity:'Unusual or word-specific letter patterns',
 multisyllable:'Syllables, stress and unstressed vowels',
 morphology_review:'Morphology candidate — expert verification required'
};
function expandOfficial(raw){
 const specials={
  'busy/business':['busy','business'],
  'eight/eighth':['eight','eighth'],
  'though/although':['though','although'],
  'woman/women':['woman','women'],
  'equip (–ped, –ment)':['equip','equipped','equipment'],
  'accident(ally)':['accident','accidentally'],
  'actual(ly)':['actual','actually'],
  'forward(s)':['forward','forwards'],
  'occasion(ally)':['occasion','occasionally'],
  'possess(ion)':['possess','possession'],
  'immediate(ly)':['immediate','immediately'],
  'sincere(ly)':['sincere','sincerely']
 };
 if(specials[raw])return specials[raw];
 if(/^[a-z]+$/i.test(raw))return [raw];
 throw Error('Unrecognised source notation: '+raw);
}
const patterns={};
function record(word,band,role,sourceRaw,officialEntryIndex=null,groupHint=null){
 word=word.toLowerCase().replace(/’/g,"'");
 const id='en-'+word.replace(/[^a-z]+/g,'-').replace(/-$/,'');
 if(!/^[a-z]+(?:'[a-z]+)?$/.test(word))throw Error('Non-word entered: '+word);
 const status=role==='statutory_wordlist'?'statutory':'nonstatutory';
 const bandAge={year1:[5,6],year2:[6,7],year3_4:[7,9],year5_6:[9,11]}[band];
 let tags=[];
 if(groupHint)tags.push(groupHint);
 if(role==='common_exception')tags.push('early_exception');
 if(/([bcdfghjklmnpqrstvwxyz])\1/i.test(word))tags.push('consonant_double');
 if(/(tion|sion|ment|ness|less|ful|able|ible|ous|ly|ing|ed)$/i.test(word))tags.push('suffix_family');
 if(/^(un|dis|mis|pre|re)/i.test(word)&&word.length>5)tags.push('prefix_family');
 if(/(ai|ay|ee|ea|oa|oo|igh|ou|ow|ei|ie|au|aw)/i.test(word))tags.push('vowel_digraph');
 if(/^(kn|wr|gn)/i.test(word)||/gh/i.test(word))tags.push('orthographic_irregularity');
 if(word.length>=9)tags.push('multisyllable');
 if(!tags.length)tags=['phonics_pattern'];
 tags=[...new Set(tags)];
 return {id,word:word.toLowerCase(),locale:'en-GB',jurisdiction:'England',curriculum_band:band,
   suggested_age_range:bandAge,curriculum_role:role,status,source_entry:sourceRaw,source_entry_index:officialEntryIndex,
   provenance:{publisher:'Department for Education',document:'English Appendix 1: Spelling',url:PAGE},
   teaching_groups:tags.map(x=>({id:x,label:GROUPS[x]||x,annotation_status:'provisional_nonclinical'})),
   teaching_approval:'curriculum_inventory_only',sound_alignment_approved:false,word_definition_approved:false,
   notes:status==='statutory'?'Year-band provenance does not imply a learner’s ability limit.':'Example or common-exception role is not a 100-word statutory list.'
 };
}
function buildCatalog(){
 const map=new Map();
 function add(word,band,role,raw,index,hint=null){
  const key=word.toLowerCase().replace(/’/g,"'");
  if(!map.has(key)){map.set(key,record(word,band,role,raw,index,hint));return}
  const old=map.get(key);
  if(old.curriculum_role!=='statutory_wordlist'&&role==='statutory_wordlist'){
   const newer=record(word,band,role,raw,index,hint);
   newer.additional_sources=[{band:old.curriculum_band,role:old.curriculum_role}];
   map.set(key,newer);
  }else{
   old.additional_sources||=[];
   if(!old.additional_sources.some(s=>s.band===band&&s.role===role))old.additional_sources.push({band,role});
   if(hint&&!old.teaching_groups.some(g=>g.id===hint))old.teaching_groups.push({id:hint,label:GROUPS[hint]||hint,annotation_status:'provisional_nonclinical'});
  }
 }
 for(const [yr,set] of [['year1',SOURCE.sets.year1_common_exception],['year2',SOURCE.sets.year2_common_exception]]){
  set.forEach((w,i)=>add(w,yr,'common_exception',w,i));
 }
 for(const [yr,set] of [['year3_4',SOURCE.sets.year3_4_statutory],['year5_6',SOURCE.sets.year5_6_statutory]]){
  set.forEach((raw,i)=>expandOfficial(raw).forEach(w=>add(w,yr,'statutory_wordlist',raw,i)));
 }
 for(const [yr,groups] of [['year1',SOURCE.sets.year1_pattern_examples],['year2',SOURCE.sets.year2_pattern_examples]]){
  for(const [pattern,words] of Object.entries(groups))words.forEach((w,i)=>add(w,yr,'nonstatutory_example',w,i,(/^(ai|ay|oi|oy|ea|ee|oa|oo|ou|ow|igh|ph|wh|nk|tch|ue|ew|ar|ir|ur|air|ear|are|au|aw|ore)/.test(pattern)?'vowel_digraph':/suffix|adding|final_y/.test(pattern)?'suffix_family':/homophone/.test(pattern)?'homophone_context':'phonics_pattern')));
 }
 const rows=[...map.values()].sort((a,b)=>a.word.localeCompare(b.word,'en-GB'));
 const byBand=Object.fromEntries(['year1','year2','year3_4','year5_6'].map(b=>[b,rows.filter(x=>x.curriculum_band===b).length]));
 return {version:'1.0.0',generated:'2026-11-13',source:SOURCE.source,counts:{unique_words:rows.length,official_year3_4_entries:SOURCE.sets.year3_4_statutory.length,official_year5_6_entries:SOURCE.sets.year5_6_statutory.length,by_primary_band:byBand},learning_groups:GROUPS,
  scope:'Reference inventory of England primary spelling appendix, not validated narrated curriculum.',notes:SOURCE.caveats,words:rows};
}
module.exports={GROUPS,expandOfficial,buildCatalog};

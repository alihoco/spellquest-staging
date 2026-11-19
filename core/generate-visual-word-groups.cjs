'use strict';
/* Spellmaster editorial proposals for orthographic visual groupings.
   WARNING: This is NOT a phoneme, syllable or morphological analysis.
   Every automatically proposed boundary remains pending a human educator review.
   It must never drive isolated-chunk pronunciation or sound-level correction.
 */
const MANUAL={
 necessary:'ne|ces|sa|ry',embarrass:'em|bar|rass',
 accommodate:'ac|com|mo|date',government:'govern|ment',
 environment:'environ|ment',foreign:'for|eign',familiar:'fa|mil|iar',
 privilege:'priv|i|lege',rhythm:'rhyth|m',temperature:'tem|per|a|ture',
 because:'be|cause',beautiful:'beau|ti|ful',although:'al|though',
 answer:'an|swer',business:'busi|ness',favourite:'fa|vour|ite',
 knowledge:'know|ledge',daughter:'daugh|ter',through:'thr|ough',
 though:'th|ough',thought:'th|ought',enough:'en|ough',
 said:'s|ai|d',come:'co|me',could:'c|ould',would:'w|ould',should:'sh|ould',
 bought:'b|ought',brought:'br|ought',caught:'c|aught',
 eight:'eigh|t',weight:'weigh|t',straight:'straigh|t',
 neighbour:'neigh|bour',yacht:'yacht',
 island:'is|land',Wednesday:'wed|nes|day',
 separate:'sep|ar|ate',definite:'def|in|ite',
 medicine:'med|i|cine',vegetable:'veg|e|ta|ble',
 different:'dif|fer|ent',important:'im|por|tant',
 imagine:'im|ag|ine',remember:'re|mem|ber',
 calendar:'cal|en|dar',dictionary:'dic|tion|ary',
 secretary:'sec|re|tary',February:'feb|ru|ary',
 opportunity:'op|por|tun|ity',competition:'com|pe|ti|tion',
 language:'lan|guage',signature:'sig|na|ture',muscle:'mus|cle',
 physical:'phys|ical',system:'sys|tem',
 ship:'sh|i|p',night:'n|igh|t',book:'b|oo|k',boat:'b|oa|t',
 apple:'ap|ple',little:'lit|tle',bottle:'bot|tle',
 back:'b|a|ck',badge:'b|a|dge',bath:'b|a|th',
 happy:'hap|py',blackberry:'black|berry',bedroom:'bed|room',
 written:'writ|ten',answer:'an|swer',
 listen:'lis|ten',people:'peo|ple'
};

// Word-by-word editorial candidates for common-exception and irregular spellings.
// These are written-layout proposals only: no specialist has signed them off.
const HIGH_PRIORITY_DRAFTS={
 'after':'af|ter','again':'a|gain','bare':'b|are','bear':'b|ear',
 'beard':'b|ear|d','behind':'be|hind','blew':'bl|ew','blue':'bl|ue',
 'both':'b|o|th','break':'br|ea|k','bright':'br|igh|t','by':'by',
 'child':'ch|ild','children':'chil|dren','christmas':'christ|mas',
 'class':'cl|ass','climb':'cl|imb','clothes':'clo|thes','cold':'c|old',
 'do':'do','door':'d|oor','even':'e|ven','every':'ev|ery',
 'everybody':'every|body','eye':'eye','fast':'f|ast','father':'fa|ther',
 'find':'f|ind','floor':'fl|oor','friend':'fr|ie|nd','full':'f|ull',
 'gnat':'gn|at','gnaw':'gn|aw','gold':'g|old','grass':'gr|ass',
 'great':'gr|ea|t','half':'ha|lf','hear':'h|ear','height':'h|eigh|t',
 'here':'h|ere','high':'h|igh','hold':'h|old','hour':'h|our',
 'house':'h|ouse','improve':'im|prove','kind':'k|ind',
 'knee':'kn|ee','knight':'kn|igh|t','knock':'kn|ock','know':'kn|ow',
 'last':'l|ast','light':'l|igh|t','lightning':'light|ning',
 'love':'l|ove','many':'man|y','mind':'m|ind','money':'mon|ey',
 'most':'m|ost','move':'m|ove','naughty':'naugh|ty','only':'on|ly',
 'parents':'par|ents','pass':'p|ass','past':'p|ast','path':'p|ath',
 'plant':'pl|ant','poor':'p|oor','pretty':'pret|ty',
 'prove':'pr|ove','pull':'p|ull','push':'p|ush','quiet':'qui|et',
 'quite':'qu|ite','right':'r|igh|t','says':'s|ay|s',
 'school':'sch|oo|l','she':'sh|e','some':'s|ome',
 'steak':'st|ea|k','sugar':'sug|ar','sure':'s|ure',
 'their':'th|eir','there':'th|ere','they':'th|ey','they\'re':'they|\'re',
 'thorough':'thor|ough','to':'to','today':'to|day','told':'t|old',
 'water':'wa|ter','were':'w|ere','where':'wh|ere',
 'whole':'wh|ole','wild':'w|ild','woman':'wom|an','women':'wom|en',
 'wood':'w|oo|d','word':'w|or|d','wore':'w|ore','work':'w|or|k',
 'world':'w|or|ld','worm':'w|or|m','worth':'w|or|th',
 'wrap':'wr|ap','write':'wr|ite','wrong':'wr|ong','wrote':'wr|ote',
 'year':'y|ear','your':'y|our','wheel':'wh|ee|l',
 'when':'wh|en','which':'wh|ich','while':'wh|ile',
 'once':'on|ce','one':'one','our':'our','would':'w|ould',
 'who':'who','two':'two','sun':'sun','was':'was',
 'because':'be|cause','people':'peo|ple'
};

const COMPOUNDS=new Set('bedroom blackberry football footballer playground downstairs upstairs everyone everybody everything someone something anybody nobody somewhere somewhere today tomorrow tonight afternoon lunchtime weekend classroom toothbrush sunshine rainbow snowman moonlight homework fireworks outside inside skateboard supermarket bookcase handbag handbag handstand teapot'.split(' '));
const AFFIXES=['ment','ness','ful','less','ing','ed','ly','er','est','able','ish','ship','ward','wards'];
const PREFIXES=['un','dis','mis','re','over','under','pre'];
const GRAPHEMES=['eigh','ough','augh','tch','dge','igh','tion','sion','ck','sh','ch','th','ph','wh','ng','qu','ee','ea','ai','ay','oa','oe','oo','ou','ow','oi','oy','ie','ue','ui','ew','aw','au','ey','wr','kn','gn','mb'];
function atoms(word){
 const arr=[];for(let i=0;i<word.length;){
  let m=GRAPHEMES.find(g=>word.slice(i).startsWith(g));
  if(!m)m=word[i];
  arr.push(m);i+=m.length;
 }return arr;
}
function visualUnits(word){
 const parts=atoms(word),n=parts.length;
 if(word.length<=3||n<=1)return [word];
 const total=word.length;
 let desired=Math.min(5,Math.max(2,Math.round(total/3.4)));
 desired=Math.min(desired,n);
 // A repeatable, explicitly non-linguistic layout suggestion; avoids splitting
 // common written grapheme sequences, but makes no claims about pronunciation.
 const prefix=[0];for(const a of parts)prefix.push(prefix[prefix.length-1]+a.length);
 const dp=Array.from({length:desired+1},()=>Array(n+1).fill(null));
 dp[0][0]={cost:0,path:[]};
 for(let k=1;k<=desired;k++)for(let j=k;j<=n;j++){
  for(let i=k-1;i<j;i++){
   const old=dp[k-1][i];if(!old)continue;
   const size=prefix[j]-prefix[i],target=total/desired;
   let cost=(size-target)*(size-target);
   if(size===1)cost+=3;
   if(size>6)cost+=5;
   if(k<desired&&j<n){
    const last=parts[j-1],next=parts[j];
    if(/^[aeiouy]+$/.test(last)&&/^[aeiouy]+$/.test(next))cost+=4;
    if(last==='q'||next==='u')cost+=6;
   }
   const candidate={cost:old.cost+cost,path:[...old.path,j]};
   if(!dp[k][j]||candidate.cost<dp[k][j].cost)dp[k][j]=candidate;
  }
 }
 const endpoints=dp[desired][n]?.path||[n];
 let at=0;return endpoints.map(end=>{const part=parts.slice(at,end).join('');at=end;return part});
}
function matchMorph(word,lexicon){
 if(COMPOUNDS.has(word)){
  for(let i=3;i<word.length-2;i++){
   const a=word.slice(0,i),b=word.slice(i);
   if(lexicon.has(a)&&lexicon.has(b))return {parts:[a,b],basis:'compound_candidate'};
  }
 }
 const candidates=[];
 for(const suffix of AFFIXES){
  if(!word.endsWith(suffix)||word.length-suffix.length<3)continue;
  const root=word.slice(0,-suffix.length);
  if(lexicon.has(root)&&root.length>=3)candidates.push({parts:[root,suffix],basis:'base_suffix_candidate'});
 }
 for(const prefix of PREFIXES){
  if(!word.startsWith(prefix)||word.length-prefix.length<3)continue;
  const root=word.slice(prefix.length);
  if(lexicon.has(root)&&root.length>=3)candidates.push({parts:[prefix,root],basis:'prefix_base_candidate'});
 }
 return candidates.sort((a,b)=>b.parts[0].length-a.parts[0].length)[0]||null;
}
function generate(catalogue){
 if(!catalogue||!Array.isArray(catalogue.words)||catalogue.words.length!==615)throw Error('Expected 615-word England catalogue');
 const lexicon=new Set(catalogue.words.map(x=>x.word));
 const entries=catalogue.words.map(item=>{
  const word=item.word;
  const manual=HIGH_PRIORITY_DRAFTS[word.toLowerCase()]||MANUAL[word.toLowerCase()];
  const morphological=manual?null:matchMorph(word,lexicon);
  const visual=manual?manual.split('|'):morphological?morphological.parts:visualUnits(word);
  if(visual.join('')!==word||visual.length>5||visual.some(x=>!x))throw Error('Grouping does not reconstruct '+word);
  const basis=manual?'curated_model_editorial_draft':morphological?morphological.basis:visual.length===1?'whole_word_no_safe_boundary':'grapheme_aware_visual_candidate';
  return {id:item.id,word,band:item.curriculum_band,visual_units:visual,
   basis,review_status:'pending_specialist_review',phoneme_units:[],spoken_syllables:[],
   morphemes:[],sound_alignment_approved:false,linguistic_accuracy_approved:false,
   audio_segments_approved:false,lesson_approved:false,
   review_priority:item.teaching_groups?.some(t=>['homophone_context','orthographic_irregularity','early_exception'].includes(t.id))?'high':basis==='grapheme_aware_visual_candidate'?'medium':'standard'};
 });
 if(new Set(entries.map(x=>x.word)).size!==615)throw Error('Duplicate words in word group catalogue');
 return {version:'1.0.0-proposals',locale:'en-GB',source:'DfE England Appendix 1 Spellmaster 615-word catalogue',
  status:'editorial_candidates_not_specialist_approved',
  warning:'Visual units are provisional layout suggestions. NEVER use these as phoneme boundaries, syllables, authoritative morphemes or spoken chunks. Expert review is required before instructional publication.',
  generatedAt:'2026-11-19',entries};
}
module.exports={generate,visualUnits,atoms,matchMorph};

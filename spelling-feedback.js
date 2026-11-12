/* Spellmaster spelling-error feedback v1. No AI inference and no diagnoses.
   Review and listen to audio before learner-facing pedagogical approval. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.SpellmasterFeedback=api;
})(typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 const cases={
  necessary:[
   {id:'extra_c',matches:['neccessary'],focus:'Check the letter C. Necessary needs one C, not two.',detail:'single c'},
   {id:'missing_s',matches:['necesary'],focus:'Look at the two S letters in necessary. That pair is the tricky part.',detail:'double s'},
   {id:'c_as_s',matches:['nessesary'],focus:'Notice the C in the middle of necessary. It is written with C there, even though you may hear an S sound.',detail:'c versus s'}
  ],
  embarrass:[
   {id:'missing_r',matches:['embarass'],focus:'Look at the two R letters in embarrass. That is the part to remember.'},
   {id:'missing_s',matches:['embarras'],focus:'The end of embarrass needs two S letters. Take another look.'}
  ],
  accommodate:[
   {id:'missing_c',matches:['acommodate'],focus:'Accommodate has two C letters near the beginning. Look at that pair.'},
   {id:'missing_m',matches:['accomodate'],focus:'Accommodate has two M letters in the middle. Look at that pair.'}
  ],
  government:[{id:'missing_n',matches:['goverment'],focus:'Keep the N from govern when you add ment to make government.'}],
  environment:[{id:'missing_n',matches:['enviroment'],focus:'The word environ ends with N. Keep that N before adding ment.'}],
  foreign:[{id:'swapped_i_e',matches:['foriegn'],focus:'In foreign, the letters E and I come in that order. Notice E before I.'}],
  familiar:[{id:'missing_i',matches:['familar'],focus:'There is an I after L in familiar. Take a look at the middle.'}],
  privilege:[{id:'vowel_e',matches:['privelege'],focus:'Notice the I after V in privilege. Look closely at that middle part.'}],
  rhythm:[{id:'missing_h',matches:['rythm'],focus:'Rhythm begins with R H. Remember the H after R.'}],
  temperature:[{id:'missing_e',matches:['temprature'],focus:'Look at the E after P in temperature. That letter is easy to miss.'}]
 };
 const fallbackText={
  beginning:'Look at the beginning of the correct word. Notice the letters there, then have another go.',
  middle:'Look at the middle of the correct word. Notice that part, then have another go.',
  end:'Look at the end of the correct word. Notice the final letters, then have another go.'
 };
 const normal=x=>String(x||'').toLocaleLowerCase('en-GB').replace(/[^a-z]/g,'');
 function differenceRegion(guess,correct){
  let prefix=0;
  while(prefix<guess.length&&prefix<correct.length&&guess[prefix]===correct[prefix])prefix++;
  let suffix=0;
  while(suffix<guess.length-prefix&&suffix<correct.length-prefix&&guess[guess.length-1-suffix]===correct[correct.length-1-suffix])suffix++;
  // Do not interpret an arbitrary edit as a phonological or grammatical error.
  const position=prefix/Math.max(correct.length,1);
  return position<0.3?'beginning':position>=0.7?'end':'middle';
 }
 function diagnose(word,attempt){
  const correct=normal(word),guess=normal(attempt);
  if(!correct||!guess||correct===guess)return null;
  const specific=(cases[correct]||[]).find(c=>c.matches.includes(guess));
  if(specific)return {word:correct,kind:'reviewed_pattern_draft',id:specific.id,clip:'spellmaster-error-'+correct+'-'+specific.id,
   text:specific.focus,source:'exact_observed_typo',requiresHumanAudioReview:true};
  const part=differenceRegion(guess,correct);
  return {word:correct,kind:'location_only',id:part,clip:'spellmaster-error-generic-'+part,
   text:fallbackText[part],source:'uncertain_difference',requiresHumanAudioReview:true};
 }
 function audioClips(){
  const clips={};
  for(const [word,patterns] of Object.entries(cases))for(const pattern of patterns){
   clips['spellmaster-error-'+word+'-'+pattern.id]=pattern.focus;
  }
  for(const [region,line] of Object.entries(fallbackText))clips['spellmaster-error-generic-'+region]=line;
  return clips;
 }
 return {diagnose,audioClips};
});

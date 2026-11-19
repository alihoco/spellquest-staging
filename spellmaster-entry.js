/* Decide first-time/returning learner route without using age for ability.
   Account setup belongs to the adult; learner onboarding uses nickname + age only
   for browser-only demos. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SpellmasterEntry=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 const KEY='spellmaster-starting-assessment-v1:';
 function state(profile,store,history={}){
  if(!profile)return 'setup';
  const count=Object.values(history||{}).filter(x=>x&&Array.isArray(x.events)&&x.events.length).length;
  const assessment=store?.getItem(KEY+profile.id);
  let completed=false;
  try{const x=JSON.parse(assessment||'null');completed=Array.isArray(x?.responses)&&x.responses.length===10;}catch{}
  const placement=store?.getItem('spellmaster-placement-v1:'+profile.id);
  let hasAssessedPlacement=false;
  try{const p=JSON.parse(placement||'null');hasAssessedPlacement=String(p?.source||'').includes('assessment');}catch{}
  return completed||hasAssessedPlacement||count>0?'returning':'assessment';
 }
 return {state,KEY};
});

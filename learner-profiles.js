/* Spellmaster LOCAL-ONLY tester profiles; not authentication or a private cloud account.
   Use an alias, not a child's real name. Browser data can be read by anyone using the device. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SpellmasterProfiles=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 const KEY='spellmaster-local-tester-profiles-v1',ACTIVE='spellmaster-local-tester-active-v1';
 const safeRead=(storage,key,fallback)=>{try{return JSON.parse(storage.getItem(key)||'null')||fallback}catch{return fallback}};
 const cleanAlias=alias=>String(alias||'').trim().slice(0,18).replace(/[<>\x00-\x1f]/g,'');
 const validBirth=birth=>typeof birth==='string'&&/^(19|20)\d{2}-(0[1-9]|1[0-2])$/.test(birth)&&birth<=new Date().toISOString().slice(0,7);
 function ageInYears(month,now=new Date()){const[y,m]=month.split('-').map(Number);return Math.max(0,Math.floor(((now.getFullYear()-y)*12+now.getMonth()+1-m)/12))}
 function themeForAge(years){return years<=7?'wonder':years<=11?'explorer':years<=16?'adventure':'focus'}
 function readProfiles(storage){return safeRead(storage,KEY,[]).filter(p=>p&&typeof p.id==='string'&&validBirth(p.birth));}
 function active(storage){const id=storage.getItem(ACTIVE);return readProfiles(storage).find(p=>p.id===id)||null;}
 function add(storage,{alias,birth,theme='auto'}={}){
  if(!validBirth(birth))throw Error('Select a valid birth month and year');
  const name=cleanAlias(alias);if(name.length<2)throw Error('Choose a short nickname (at least two letters)');
  const all=readProfiles(storage);if(all.length>=6)throw Error('This test allows up to six profiles on one device');
  const id='lp-'+Array.from({length:3},()=>Math.random().toString(36).slice(2,10)).join('');
  const p={id,alias:name,birth,theme:['auto','wonder','explorer','adventure','focus'].includes(theme)?theme:'auto',created:new Date().toISOString()};
  all.push(p);storage.setItem(KEY,JSON.stringify(all));storage.setItem(ACTIVE,id);return p;
 }
 function choose(storage,id){if(!readProfiles(storage).some(p=>p.id===id))throw Error('Unknown local learner');storage.setItem(ACTIVE,id);return active(storage)}
 function updateTheme(storage,id,theme){if(!['auto','wonder','explorer','adventure','focus'].includes(theme))throw Error('Unknown theme');const all=readProfiles(storage);const p=all.find(x=>x.id===id);if(!p)throw Error('Unknown learner');p.theme=theme;storage.setItem(KEY,JSON.stringify(all));return p;}
 function forget(storage,id){const all=readProfiles(storage);if(!all.some(p=>p.id===id))return;storage.removeItem('spellmaster-staging-intake-v1:'+id);storage.setItem(KEY,JSON.stringify(all.filter(p=>p.id!==id)));if(storage.getItem(ACTIVE)===id)storage.removeItem(ACTIVE)}
 function historyKey(profile){if(!profile?.id||!/^lp-[a-z0-9]+$/.test(profile.id))throw Error('Local learner profile required');return 'spellmaster-staging-intake-v1:'+profile.id}
 const WORD_PATTERNS={
 necessary:'Single C / double S',embarrass:'Double R / double S',accommodate:'Double C / double M',
 government:'Base word + -ment',environment:'Base word + -ment',foreign:'E before I',
 familiar:'Middle vowel',privilege:'Middle vowel',rhythm:'Silent letter pattern',temperature:'Unstressed vowel'
 };
 function summary(progress,today=new Date().toISOString().slice(0,10)){
  const words=Object.entries(progress||{}).filter(([w,v])=>WORD_PATTERNS[w]&&v&&Array.isArray(v.events));
  let tries=0,correct=0,first=0,due=0,retained=0;const issues={};
  for(const [word,v] of words){
   const attempts=v.events.filter(x=>x&&typeof x.correct==='boolean');
   tries+=attempts.length;correct+=attempts.filter(x=>x.correct).length;
   const initial=attempts.find(x=>!x.afterHelp);
   if(initial?.correct)first++;
   if((v.retained||0)>0)retained++;
   if(v.next&&v.next<=today)due++;
   for(const attempt of attempts)if(!attempt.correct){
    const id=attempt.error_category||'unclassified';
    const title=id==='unclassified'?'Pattern still being explored':(WORD_PATTERNS[word]||'Spelling pattern');
    const key=title;
    issues[key]??={pattern:title,misses:0,wordIds:new Set()};
    issues[key].misses++;issues[key].wordIds.add(word);
   }
  }
  const difficulties=Object.values(issues).map(x=>({pattern:x.pattern,misses:x.misses,words:x.wordIds.size})).sort((a,b)=>b.misses-a.misses).slice(0,4);
  return {wordsSeen:words.length,attempts:tries,correctAttempts:correct,initialCorrect:first,delayedRetained:retained,dueWords:due,difficulties,
   explanation:'Observations from this browser, not a diagnosis or learning-style label.'};
 }
 return {KEY,ACTIVE,readProfiles,active,add,choose,updateTheme,forget,historyKey,summary,ageInYears,themeForAge,validBirth};
});

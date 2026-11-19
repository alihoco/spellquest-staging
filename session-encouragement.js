/* Spellmaster closing encouragement: celebrates effort without claiming mastery
   or day-on-day improvement that was not actually observed. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.SpellmasterSessionClosing=api;
})(typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 const SLOGAN='Better today than yesterday';
 function message({attempts=[],history={},today=null,context='adventure'}={}){
  const items=Array.isArray(attempts)?attempts.filter(x=>x&&typeof x.word==='string'):[];
  const date=typeof today==='string'?today:new Date().toISOString().slice(0,10);
  const improved=items.some(item=>{
   if(item.initial!==true)return false;
   const events=history?.[item.word]?.events;
   return Array.isArray(events)&&events.some(e=>e&&e.date<date&&e.correct===false&&e.afterHelp===false);
  });
  const corrected=items.some(item=>item.initial===false&&item.learned===true);
  const tried=items.length>0;
  let headline='See you next time! 🌱',spoken='You can come back and practise whenever you feel ready.';
  if(improved){
   headline='Look how far you have come! ✨';
   spoken='You remembered a word today that was tricky before. You are making progress, one step at a time.';
  }else if(corrected){
   headline='You worked through it! ✨';
   spoken='You kept going and worked through a tricky spelling. That is something to feel proud of.';
  }else if(tried){
   headline='Great work today! ✨';
   spoken='You gave those words a go, and every bit of practice helps your learning grow.';
  }
  const footer='Better Today Than Yesterday. Every little step counts.';
  return {headline,spoken,footer,slogan:SLOGAN,hasMeasuredImprovement:improved,attemptedWords:items.length,
   fullSpeech:'Great work today! '+spoken+' Remember, our goal is to be better today than yesterday, one little step at a time.',
   explanation:improved?'Compared with an earlier independent attempt, not with another learner.':'Your effort is celebrated without assuming your spelling has already improved.'};
 }
 return {SLOGAN,message};
});

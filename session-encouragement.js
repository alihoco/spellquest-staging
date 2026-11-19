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
   headline='Look at your progress! ✨';
   spoken='You remembered a spelling today that was tricky before. That is a real step forward.';
  }else if(corrected){
   headline='You worked through it! ✨';
   spoken='You kept trying and worked out a tricky spelling with help. We will practise it again another day.';
  }else if(tried){
   headline='Great work today! ✨';
   spoken='Every word you try is a chance to learn. We will see what you remember when you come back.';
  }
  const footer='Better today than yesterday. One little step at a time.';
  return {headline,spoken,footer,slogan:SLOGAN,hasMeasuredImprovement:improved,attemptedWords:items.length,
   fullSpeech:'Great work today. '+spoken+' '+footer,
   explanation:improved?'Compared with an earlier independent attempt, not with another learner.':'Your effort is celebrated without assuming your spelling has already improved.'};
 }
 return {SLOGAN,message};
});

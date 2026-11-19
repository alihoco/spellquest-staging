(function(root){
 'use strict';
 function assessmentHistory(history,responses,date){
  const merged={...history};
  for(const response of responses||[]){
   if(!/^[a-z'-]+$/i.test(response.word)||typeof response.independent!=='boolean')continue;
   const entry=merged[response.word]||{};
   const events=[...(entry.events||[])];
   if(!events.some(e=>e.phase==='assessment'&&e.date===date&&e.correct===response.independent)){
    events.push({date,correct:response.independent,phase:'assessment',independent:true});
   }
   merged[response.word]={...entry,events};
  }
  return merged;
 }
 function milestones(history){
  const dates=[];
  for(const entry of Object.values(history)){
   const events=(entry?.events||[]).filter(e=>/^\d{4}-\d{2}-\d{2}$/.test(e?.date)&&typeof e.correct==='boolean')
    .slice().sort((a,b)=>a.date.localeCompare(b.date));
   const first=events.find(e=>!e.afterHelp);
   if(!first||first.correct)continue;
   const recall=events.find(e=>e.date>first.date&&e.correct&&!e.afterHelp&&e.independent!==false&&
    !e.bonus&&e.phase!=='same_session_practice'&&e.phase!=='same_session_recall');
   if(recall)dates.push(recall.date);
  }
  return dates.sort();
 }
 function chart(history){
  const dates=milestones(history);
  const daily=new Map();
  dates.forEach((date,i)=>daily.set(date,i+1));
  const days=[...daily.keys()];
  const label='New words I can spell';
  let graph='';
  if(days.length){
   const recorded=Object.values(history).flatMap(entry=>(entry?.events||[]).map(e=>e?.date)).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
   const first=Date.parse(recorded[0]),last=Date.parse(recorded.at(-1));
   let path='M 8 58';
   for(const day of days){
    const x=last===first?292:8+284*(Date.parse(day)-first)/(last-first);
    path+=' H '+x+' V '+(58-48*daily.get(day)/dates.length);
   }
   path+=' H 292';
   const format=date=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(date));
   graph='<svg viewBox="0 0 300 66" width="100%" height="80" aria-hidden="true"><path d="M8 58H292" stroke="#cbc5d9"/><path d="'+path+'" fill="none" stroke="#6949a8" stroke-width="3"/></svg>'+
     '<small>'+format(recorded[0])+' · 0 &nbsp; → &nbsp; '+format(recorded.at(-1))+' · '+dates.length+'</small>';
  }
  return '<section aria-label="'+label+'" style="padding:1rem;margin:1rem 0;border:1px solid #dbcee7;border-radius:16px;background:#fffaf0;color:#372853"><h3>'+label+'</h3>'+
   '<strong>'+dates.length+' new '+(dates.length===1?'word':'words')+' since I started</strong>'+graph+
   '<p>A word joins your graph when you found it tricky at first and later spelled it on your own on another day.</p></section>';
 }
 root.SpellmasterGrowth={assessmentHistory,milestones,chart};
})(globalThis);

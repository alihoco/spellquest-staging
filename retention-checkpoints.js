/* Planned spelling retrieval checkpoints. Timing is a research hypothesis,
   not proof of efficacy. A missed date is missing data, NOT a spelling error.
   Independent spelling only; no visible target or exact letter bank.
*/
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.SpellmasterCheckpoints=api;})(typeof globalThis!=='undefined'?globalThis:null,function(){
'use strict';
const CHECKS=[{id:'day1',days:1,range:[1,3]},{id:'day7',days:7,range:[5,10]},{id:'day28',days:28,range:[24,35]}];
function validDate(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value+'T00:00:00Z'))}
function addDays(date,days){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)}
function daysSince(start,today){return Math.round((Date.parse(today+'T12:00:00Z')-Date.parse(start+'T12:00:00Z'))/86400000)}
function initialise(record,today){
 if(!validDate(today))throw Error('Invalid date');
 const state=record&&typeof record==='object'?record:{};
 if(state.retentionPlan?.version===1&&validDate(state.retentionPlan.start))return state;
 state.retentionPlan={version:1,start:today,checkpoints:Object.fromEntries(CHECKS.map(c=>[c.id,{scheduledFor:addDays(today,c.days),result:null}]))};
 return state;
}
function due(record,today){
 if(!record?.retentionPlan||!validDate(today))return null;
 const plan=record.retentionPlan,diff=daysSince(plan.start,today);
 if(diff<1)return null;
 // Pick the most relevant due checkpoint; earlier missed tests become missing data.
 const eligible=CHECKS.filter(c=>diff>=c.days&&plan.checkpoints[c.id]?.result===null);
 if(!eligible.length)return null;
 const selected=eligible[eligible.length-1];
 return {id:selected.id,day:selected.days,scheduledFor:addDays(plan.start,selected.days),
  withinWindow:diff>=selected.range[0]&&diff<=selected.range[1],
  daysElapsed:diff,overdue:diff>selected.range[1]};
}
function observe(record,today,correct,{independent=true,assisted=false}={}){
 const state=initialise(record,today),current=due(state,today);
 if(!independent||assisted||!current)return {record:state,checkpoint:null};
 const date=state.retentionPlan.start;
 for(const c of CHECKS){
  const item=state.retentionPlan.checkpoints[c.id];
  if(c.days<current.day&&item.result===null)item.result={status:'missed',reason:'learner_not_present_on_schedule',recordedAt:today};
 }
 const item=state.retentionPlan.checkpoints[current.id];
 item.result={status:'observed',correct:correct===true,observedAt:today,
  elapsedDays:current.daysElapsed,withinWindow:current.withinWindow};
 return {record:state,checkpoint:{...current,correct:correct===true}};
}
function nextDue(record,today){
 if(!record?.retentionPlan)return null;
 const now=due(record,today);
 if(now)return now.scheduledFor;
 const list=CHECKS.filter(c=>record.retentionPlan.checkpoints[c.id]?.result===null);
 return list.length?list[0].days&&addDays(record.retentionPlan.start,list[0].days):null;
}
function summary(history,today){
 const items=Object.values(history||{}).filter(x=>x&&typeof x==='object'&&x.retentionPlan);
 const dueNow=items.filter(x=>due(x,today));
 const counted={day1:0,day7:0,day28:0},missing={day1:0,day7:0,day28:0};
 for(const item of items)for(const c of CHECKS){
  const result=item.retentionPlan.checkpoints[c.id]?.result;
  if(result?.status==='observed'&&result.withinWindow)counted[c.id]++;
  if(result?.status==='missed')missing[c.id]++;
 }
 return {trackedWords:items.length,dueWords:dueNow.length,observed:counted,missed:missing};
}
return {CHECKS,validDate,addDays,daysSince,initialise,due,observe,nextDue,summary};
});

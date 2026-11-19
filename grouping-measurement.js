/* Spellmaster grouping measurement, version 1.
   Observational telemetry only: no randomised allocation or efficacy inference.
   UMD for Node tests and browser gameplay.
*/
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.SpellmasterGroupingMeasurement=api;
})(typeof globalThis!=='undefined'?globalThis:null,function(){
 'use strict';
 const VERSION='grouping-observation-v1';
 function valid(word,parts){return typeof word==='string'&&Array.isArray(parts)&&parts.length>0&&parts.length<=5&&parts.every(x=>typeof x==='string'&&x.length>0)&&parts.join('')===word}
 function positions(parts){let n=0;return parts.slice(0,-1).map(x=>(n+=x.length))}
 function equal(a,b){return a.length===b.length&&a.every((x,i)=>x===b[i])}
 function treatment(word,suggested,selected){
  if(!valid(word,suggested)||!valid(word,selected))return 'unknown';
  if(selected.length===1)return 'whole_word';
  return equal(positions(suggested),positions(selected))?'suggested':'adjusted';
 }
 function exposure({word,suggested,selected,opportunity,at=new Date().toISOString(),source='supported_review'}){
  if(!valid(word,suggested)||!valid(word,selected)||typeof opportunity!=='string')throw Error('Invalid grouping exposure');
  return {schema:VERSION,word,at,opportunity,source,strategy:treatment(word,suggested,selected),
    suggestedCuts:positions(suggested),selectedCuts:positions(selected),visualHelp:true};
 }
 function read(state,word){
  const events=Array.isArray(state?.events)?state.events:[];
  const exposures=events.filter(x=>x.action==='grouping_exposed'&&x.word===word&&x.at&&x.strategy);
  return exposures[exposures.length-1]||null;
 }
 function annotateAttempt({word,history,correct,afterHelp,kind,review,at=new Date().toISOString()}){
  const exposures=(Array.isArray(history?.events)?history.events:[])
    .filter(x=>x.action==='grouping_exposed'&&x.word===word&&x.at&&x.strategy);
  const prior=exposures[exposures.length-1]||null;
  const opportunities=new Map();
  for(const item of exposures)opportunities.set(item.opportunity,item.strategy);
  const distinctOpportunities=[...opportunities.values()];
  const crossOpportunityStrategyChange=distinctOpportunities.some((value,i)=>i>0&&value!==distinctOpportunities[i-1]);
  const ms=prior?Date.parse(at)-Date.parse(prior.at):NaN;
  const days=Number.isFinite(ms)&&ms>=0?ms/86400000:null;
  const independent=afterHelp===false;
  return {schema:VERSION,strategy:prior?.strategy||'not_exposed',
   groupingOpportunity:prior?.opportunity||null,groupingExposedAt:prior?.at||null,
   daysSinceGroupingExposure:days===null?null:Math.round(days*100)/100,
   phase:afterHelp?'assisted_retry':kind==='due'?'scheduled_review':kind==='practice'?'same_session_practice':'new_word',
   independent,correct:!!correct,review:!!review,
   eligibleForDelayedComparison:independent&&kind==='due'&&days!==null&&days>=1,
   crossOpportunityStrategyChange,groupingOpportunities:opportunities.size,
   isObservational:true,groupingVersion:VERSION};
 }
 return {VERSION,valid,positions,treatment,exposure,read,annotateAttempt};
});

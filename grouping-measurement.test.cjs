'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const measure=require('./grouping-measurement');
const report=require('./core/grouping-outcome-analysis.cjs');
test('Detects suggested, adjusted and whole-word presentation without confusing it with sounds',()=>{
 assert.equal(measure.treatment('necessary',['ne','ces','sa','ry'],['ne','ces','sa','ry']),'suggested');
 assert.equal(measure.treatment('necessary',['ne','ces','sa','ry'],['nec','es','sa','ry']),'adjusted');
 assert.equal(measure.treatment('necessary',['ne','ces','sa','ry'],['necessary']),'whole_word');
 assert.throws(()=>measure.exposure({word:'people',suggested:['peo','pl'],selected:['people'],opportunity:'a'}),/Invalid/);
});
test('Tracks the final visual grouping and independent delayed attempt separately from same-session attempts',()=>{
 const one={action:'grouping_exposed',word:'people',at:'2026-11-01T09:00:00.000Z',opportunity:'lesson1',strategy:'suggested',selectedCuts:[3]};
 const two={...one,at:'2026-11-01T09:02:00.000Z',strategy:'adjusted',selectedCuts:[2]};
 const history={events:[one,two]};
 const seven=measure.annotateAttempt({word:'people',history,correct:true,afterHelp:false,kind:'due',review:true,at:'2026-11-08T09:02:00.000Z'});
 assert.equal(seven.strategy,'adjusted');
 assert.equal(seven.crossOpportunityStrategyChange,false,'Normal editing in same lesson is not later crossover');
 assert.equal(seven.daysSinceGroupingExposure,7);
 assert.equal(seven.eligibleForDelayedComparison,true);
 const immediate=measure.annotateAttempt({word:'people',history,correct:true,afterHelp:true,kind:'practice',review:false,at:'2026-11-01T09:05:00.000Z'});
 assert.equal(immediate.eligibleForDelayedComparison,false);
 const switched=measure.annotateAttempt({word:'people',history:{events:[one,two,{...two,opportunity:'lesson2',strategy:'suggested',at:'2026-11-03T09:00:00.000Z'}]},correct:true,afterHelp:false,kind:'due',review:true,at:'2026-11-10T09:00:00.000Z'});
 assert.equal(switched.crossOpportunityStrategyChange,true);
});
test('Research reporting only considers consenting adult independent delayed spelling',()=>{
 const data=[];
 for(let n=0;n<11;n++)for(const strategy of ['suggested','adjusted','whole_word']){
  data.push({learnerId:'adult-'+n+'-'+strategy,isChild:false,adultResearchConsent:true,at:'2026-11-08T09:00:00Z',
   payload:{word:'people',correct:n<8,grouping:{schema:'grouping-observation-v1',isObservational:true,
   eligibleForDelayedComparison:true,independent:true,phase:'scheduled_review',strategy,
   groupingOpportunity:'lesson-1',crossOpportunityStrategyChange:false,daysSinceGroupingExposure:7}}});
 }
 const out=report.summarise(data);
 assert.equal(out.cohorts.seven_day.suggested.wordOpportunities,11);
 assert.equal(out.cohorts.seven_day.suggested.correct,8);
 assert.equal(out.cohorts.seven_day.suggested.successRate,8/11);
 assert.equal(out.cohorts.seven_day.adjusted.successRate,8/11);
 assert.equal(out.cohorts.seven_day.whole_word.successRate,8/11);
 assert.equal(out.studyDesign,'observational_noncausal');
 const privateReport=report.summarise(data.filter(x=>x.learnerId==='adult-0-suggested'));
 assert.equal(privateReport.cohorts.seven_day.suggested.successRate,null);
 assert.equal(privateReport.cohorts.seven_day.suggested.suppressed,true);
 data[0].adultResearchConsent=false;
 assert.equal(report.summarise(data).exclusions.no_consent,1);
});
test('No learner identifiers or sensitive characteristics are emitted by aggregate report',()=>{
 const out=report.summarise([]);
 assert.deepEqual(Object.keys(out.cohorts.seven_day),['suggested','adjusted','whole_word']);
 assert.ok(!JSON.stringify(out).includes('diagnosis'));
 assert.equal(out.cohorts.seven_day.adjusted.successRate,null);
});

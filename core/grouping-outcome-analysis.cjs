'use strict';
/* Internal aggregate-only research summariser.
 * Observational comparison: consented adults only, no diagnoses, no child rows.
 * This tool never outputs individual learner records.
 */
const STRATEGIES=['suggested','adjusted','whole_word'];
const WINDOWS={next_day:[1,3],seven_day:[5,10],twenty_eight_day:[24,35]};
function windowOf(days){if(typeof days!=='number'||!Number.isFinite(days))return null;
 for(const [name,[lo,hi]] of Object.entries(WINDOWS))if(days>=lo&&days<=hi)return name;
 return null;
}
function confidence(successes,n){
 if(n===0)return null;
 const z=1.96,p=successes/n,denom=1+z*z/n;
 const centre=(p+z*z/(2*n))/denom;
 const half=z*Math.sqrt((p*(1-p)+z*z/(4*n))/n)/denom;
 return [Math.max(0,centre-half),Math.min(1,centre+half)];
}
function summarise(records,{minimumLearners=10}={}){
 if(!Array.isArray(records))throw Error('Expected attempt-event records');
 if(!Number.isInteger(minimumLearners)||minimumLearners<10)throw Error('Minimum reporting group size is ten learners.');
 const earliest=new Map();
 const exclusions={no_consent:0,child:0,not_independent_delayed:0,missing_or_changed_exposure:0,outside_windows:0};
 for(const row of records){
  if(row?.adultResearchConsent!==true){exclusions.no_consent++;continue;}
  if(row?.isChild){exclusions.child++;continue;}
  const g=row?.payload?.grouping;
  const consentDate=row.adultResearchConsentAt?Date.parse(row.adultResearchConsentAt):null;
  const exposureDate=g?.groupingExposedAt?Date.parse(g.groupingExposedAt):null;
  if(consentDate!==null&&(!Number.isFinite(consentDate)||!Number.isFinite(exposureDate)||exposureDate<consentDate)){
   exclusions.no_consent++;continue;
  }
  if(!g||g.schema!=='grouping-observation-v1'||g.isObservational!==true||g.eligibleForDelayedComparison!==true||
      g.independent!==true||g.phase!=='scheduled_review'){exclusions.not_independent_delayed++;continue;}
  if(!STRATEGIES.includes(g.strategy)||g.crossOpportunityStrategyChange===true||!g.groupingOpportunity){exclusions.missing_or_changed_exposure++;continue;}
  const window=windowOf(g.daysSinceGroupingExposure);
  if(!window){exclusions.outside_windows++;continue;}
  if(typeof row.learnerId!=='string'||typeof row.payload.word!=='string')continue;
  const at=Date.parse(row.at||'');
  if(!Number.isFinite(at))continue;
  const key=[row.learnerId,row.payload.word,window].join('|');
  if(!earliest.has(key)||at<earliest.get(key).time)earliest.set(key,{time:at,learner:row.learnerId,word:row.payload.word,window,strategy:g.strategy,correct:row.payload.correct===true});
 }
 const cohorts=Object.fromEntries(Object.keys(WINDOWS).map(window=>[window,{}]));
 for(const window of Object.keys(WINDOWS)){
  for(const strategy of STRATEGIES){
   const chosen=[...earliest.values()].filter(x=>x.window===window&&x.strategy===strategy);
   const learners=new Set(chosen.map(x=>x.learner));
   const n=chosen.length,correct=chosen.filter(x=>x.correct).length;
   cohorts[window][strategy]={wordOpportunities:n,uniqueLearners:learners.size,
    correct,successRate:learners.size>=minimumLearners&&n>0?correct/n:null,
    wilson95:learners.size>=minimumLearners?confidence(correct,n):null,
    suppressed:learners.size<minimumLearners};
  }
 }
 return {reportVersion:'grouping-observation-aggregate-v1',studyDesign:'observational_noncausal',
  consent:'adult_opt_in_only',unit:'earliest independent delayed response per learner-word-window',
  primaryWindow:'seven_day',windows:WINDOWS,minimumLearners,
  cohorts,eligibleLearnerWordWindows:earliest.size,exclusions,
  warning:'Selection effects, baseline differences, word difficulty, multiple exposures, missing visits and dropout can bias comparisons. Not a causal estimate or published efficacy study.'};
}
module.exports={STRATEGIES,WINDOWS,windowOf,confidence,summarise};

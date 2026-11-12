'use strict';
// A/B/C teaching selection is an experimental plan, NOT a diagnosis or a validated learning-style classifier.
// No learner is denied baseline Structured Literacy. Meaning & Making is an original optional activity.
const ARMS=Object.freeze({A:'structured_core',B:'structured_core_plus_meaning_making',C:'structured_core_plus_time_matched_practice'});
function supportDecision({independentErrors=0,reviewErrors=0,alreadyExplained=false,learnerChoice=null,
 wordApproved=false,meaningApproved=false,activityApproved=false,frustrated=false,
 experimentAssignment=null,researchPermission=false}={}){
 const repeatedDifficulty=(independentErrors>=2||reviewErrors>=2);
 const base={coreRequired:true,neverInferFixedLearningStyle:true,pronunciationJudgement:false,comparativeEfficacyClaim:false};
 if(frustrated)return {...base,action:'offer_pause_or_park',reason:'learner_comfort'};
 if(!wordApproved)return {...base,action:'expert_gated_core',reason:'word_not_approved'};
 if(independentErrors+reviewErrors===0&&!alreadyExplained)return {...base,action:'structured_core',reason:'first_teaching'};
 if(!repeatedDifficulty)return {...base,action:'targeted_short_feedback',reason:'initial_error'};
 if(learnerChoice==='park')return {...base,action:'park_for_later',reason:'learner_choice'};
 // The research arm must not be selected just because one approach seems more fun.
 const assigned=researchPermission&&['A','B','C'].includes(experimentAssignment)?experimentAssignment:null;
 if(assigned==='A'||assigned==='C')return {...base,action:assigned==='C'?'time_matched_extra_practice':'structured_core',
  arm:assigned,reason:'approved_experiment_assignment'};
 const canMake=meaningApproved&&activityApproved;
 if(!canMake)return {...base,action:'targeted_short_feedback',offeredAlternative:false,
  reason:'meaning_making_content_needs_review'};
 if(learnerChoice==='core')return {...base,action:'targeted_short_feedback',reason:'learner_choice'};
 if(learnerChoice==='meaning_making'||assigned==='B')return {...base,action:'offer_meaning_making',arm:assigned,
  steps:['hear_context','choose_meaning_scene','build_verified_correct_spelling','hide_model','unaided_recall','delayed_unaided_recall'],
  assistanceMustBeRecorded:true,reason:'optional_other_route'};
 return {...base,action:'offer_choice',choices:['meaning_making','core','park'],reason:'repeated_difficulty'};
}
function methodEvidence({observations=[]}={}){
 const arms={A:[],B:[],C:[]};
 for(const r of observations)if(arms[r.arm]&&r.delayed===true&&r.independent===true&&!r.shownTargetLetters)arms[r.arm].push(!!r.correct);
 const counts=Object.fromEntries(Object.entries(arms).map(([arm,v])=>[arm,{observations:v.length,correct:v.filter(Boolean).length}]));
 return {counts,inference:'insufficient_for_personalised_causal_claim',needsMatchedSets:true,needsTimeMatchedC:true,needsExpertReview:true};
}
module.exports={ARMS,supportDecision,methodEvidence};

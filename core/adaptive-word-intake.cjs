'use strict';
/**
 * Spellmaster adaptive intake v1: estimates whether to OFFER another new word
 * after a learner's actual unaided response. Not a validated dosage algorithm.
 * Never uses age as a proxy for spelling ability. No fixed weekly quota.
 */
function decideNext({attempts=[],dueReviews=0,elapsedMinutes=0,learnerWantsMore=true,
  sessionNewIntroduced=0,sessionNovelCorrectFirstTry=0,frustration='none',
  softMinutes=8,hardMinutes=12,hardNewLimit=6}={}){
 const recent=attempts.slice(-4);
 const independentlyCorrect=recent.filter(x=>x.independent===true&&x.correct===true&&!x.shown_target_letters).length;
 const repeatedDifficulty=recent.filter(x=>x.correct===false).length>=2;
 if(!learnerWantsMore)return {action:'finish',reason:'learner_choice'};
 if(frustration==='high')return {action:'offer_break',reason:'learner_comfort'};
 if(elapsedMinutes>=hardMinutes)return {action:'offer_break',reason:'session_safety_limit'};
 if(dueReviews>=3 && (sessionNewIntroduced>0 || independentlyCorrect<2))return {action:'review',reason:'review_backlog'};
 if(repeatedDifficulty)return {action:'targeted_support',reason:'recent_difficulty'};
 if(elapsedMinutes>=softMinutes)return {action:'offer_continue_or_finish',reason:'short_session_goal'};
 if(sessionNewIntroduced>=hardNewLimit)return {action:'offer_continue_or_finish',reason:'provisional_novelty_guardrail'};
 if(sessionNovelCorrectFirstTry>=2)return {action:'offer_new',reason:'prior_knowledge_demonstrated',skipTeachingForKnown:true,
   scheduleBriefDelayedReview:true};
 if(recent.length>=2&&independentlyCorrect>=2&&dueReviews<3)return {action:'offer_new',reason:'independent_accuracy_and_review_capacity'};
 if(dueReviews>0)return {action:'review',reason:'due_retention_check'};
 return {action:'offer_new',reason:'normal_provisional_progression'};
}
function classifyInitialKnowledge({correct,independent,usedHints=false}={}){
 if(correct && independent && !usedHints)return {
  status:'known_on_initial_unaided_attempt',intensiveTeachingNeeded:false,
  wordVault:'collected_unconfirmed',scheduleDelayedReview:true,mastered:false
 };
 return {status:'instruction_needed',intensiveTeachingNeeded:true,
  wordVault:'discovered',scheduleDelayedReview:true,mastered:false};
}
module.exports={decideNext,classifyInitialKnowledge};

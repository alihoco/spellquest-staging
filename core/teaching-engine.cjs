/**
 * SpellQuest learning engine, v1.0 (headless)
 * No UI, no generated speech, no diagnosis, no research assignment.
 * Teaching policy is evidence-informed, pending specialist review.
 */
'use strict';

const STAGES = Object.freeze(['HEAR','DISCOVER','UNDERSTAND','EXPLAIN','BUILD','RECALL','REINFORCE','REMEMBER']);
const ASSISTED_MODES = new Set(['exact_letter_tiles','grapheme_tiles','three_choice','modelled_copy']);
const INDEPENDENT_MODES = new Set(['full_alphabet_tap','physical_keyboard','accessible_unprompted_entry']);
const WORD_STATUSES = new Set(['draft','linguistic_review','audio_review','approved','suspended']);
const BLOCKED_SOUNDS = new Set(['unreviewed','synthetic_guess','unknown']);
const MS_DAY=86400000;

function assert(ok,msg){if(!ok)throw new Error(msg)}
function plainWord(x){return String(x||'').normalize('NFKC').toLocaleLowerCase('en-GB').replace(/\s+/g,' ').trim()}
function dateOnly(iso){const d=new Date(iso);assert(!Number.isNaN(d.getTime()),'Invalid date');return d.toISOString().slice(0,10)}
function dayDiff(a,b){return Math.floor((Date.parse(dateOnly(a)+'T00:00:00Z')-Date.parse(dateOnly(b)+'T00:00:00Z'))/MS_DAY)}

function checkWord(word){
 const issues=[];
 if(!word||typeof word!=='object')return ['Missing word record'];
 if(!word.id||!word.spelling||!word.locale)issues.push('Missing core word identification');
 if(!WORD_STATUSES.has(word.status))issues.push('Missing/invalid editorial status');
 if(!word.audio?.whole_word?.approved)issues.push('Full word audio is not approved');
 if(!Array.isArray(word.teaching?.targets)||!word.teaching.targets.length)issues.push('No verified instructional target');
 if(!word.teaching?.explanation?.approved)issues.push('Teaching explanation has not been reviewed');
 if(word.teaching?.sound_units?.length){
  if(word.teaching?.sound_review?.status!=='approved')issues.push('Sound units not human-approved');
  if(word.teaching.sound_units.some(u=>!u.audio_id||!u.verified_label||BLOCKED_SOUNDS.has(u.source)))issues.push('Unverified or incomplete sound unit');
 }
 if(word.teaching?.orthographic_units?.length && word.teaching.orthographic_units.join('')!==word.spelling)issues.push('Orthographic units do not reconstruct spelling');
 if(word.status!=='approved')issues.push('Word record not yet approved');
 return issues;
}
function learningPlan({word,learner={},history=[]}){
 const blockers=checkWord(word);
 if(blockers.length)return {state:'blocked',word_id:word?.id||null,reasons:blockers,stages:[]};
 const prior=history.filter(x=>x.word_id===word.id&&x.independent===true&&x.correct===true);
 const retained=prior.some(x=>x.phase==='delayed_recall'&&x.days_since_last_teaching>=1);
 const hasMisconception=history.some(x=>x.word_id===word.id&&x.correct===false);
 const known=retained&&!hasMisconception;
 const stages=known?['HEAR','RECALL','REMEMBER']:['HEAR','DISCOVER','UNDERSTAND','EXPLAIN','BUILD','RECALL','REINFORCE','REMEMBER'];
 // UNDERSTAND requires verified sound units or an explicit explanation without synthetic phonetic segmentation.
 const activities=stages.map(stage=>{
  const entry={stage,word_id:word.id,autonarrate:true};
  if(stage==='HEAR')entry.audio_id=word.audio.whole_word.id;
  if(stage==='UNDERSTAND')entry.approved_sound_ids=word.teaching.sound_review?.status==='approved'?
    (word.teaching.sound_units||[]).map(x=>x.audio_id):[];
  if(stage==='EXPLAIN')entry.explanation_id=word.teaching.explanation.id;
  if(stage==='BUILD')entry.allowed_modes=['exact_letter_tiles','grapheme_tiles','three_choice'];
  if(stage==='RECALL'||stage==='REMEMBER')entry.allowed_modes=['full_alphabet_tap','physical_keyboard','accessible_unprompted_entry'];
  return entry;
 });
 return {state:'ready',word_id:word.id,stages:activities,teaching_focus:word.teaching.targets,
 presentation_profile:learner.presentation||'age_appropriate_default',preferred_input:learner.input||'learner_choice',
 requires_delayed_check:true,had_prior_errors:hasMisconception};
}
function gradeAttempt({word,answer,mode,shown_target_letters=false,clues=0,phase='practice',occurred_at=new Date().toISOString(),last_teaching_at=null}){
 assert(word?.id&&word.spelling,'Word missing');assert(ASSISTED_MODES.has(mode)||INDEPENDENT_MODES.has(mode),'Unknown input mode');
 const correct=plainWord(answer)===plainWord(word.spelling);
 const independent=INDEPENDENT_MODES.has(mode)&&!shown_target_letters&&clues===0;
 const days=last_teaching_at?dayDiff(occurred_at,last_teaching_at):null;
 const delayed=phase==='delayed_recall'&&independent&&days!==null&&days>=1;
 const classification=!correct?'needs_practice':!independent?'assisted_success':delayed?'retained_unaided':'immediate_unaided';
 return {word_id:word.id,mode,phase,correct,independent,assisted:!independent,days_since_last_teaching:days,occurred_at,classification,counts_as_mastery:delayed&&correct};
}
function chooseSupport({current_attempts=[],learner={},target_category='general'}={}){
 const misses=current_attempts.filter(x=>!x.correct).length;
 const prefer=learner.input||'learner_choice';
 const age=learner.age; // UX defaults only — NEVER determines difficulty
 const touchDefault=Number.isFinite(age)&&age<=9;
 const input=prefer!=='learner_choice'?prefer:touchDefault?'full_alphabet_tap':'physical_keyboard';
 const support=misses>=2?'targeted_explanation_and_scaffold':misses===1?'specific_corrective_feedback':'no_additional_scaffold';
 return {input,support,target_category,allow_switch:true,never_infer_learning_style:true};
}
function nextReview({attempt,previous_review_count=0}){
 assert(attempt?.word_id,'Attempt required');
 if(!attempt.correct)return {due_days:1,reason:'needs_more_instruction_not_mastered'};
 if(!attempt.independent)return {due_days:1,reason:'assisted_not_mastered'};
 // Draft scheduling heuristics; not a validated optimal dyslexia schedule.
 const intervals=[2,5,10,21];
 return {due_days:intervals[Math.min(previous_review_count,intervals.length-1)],reason:'heuristic_delayed_unaided_review',experimental_timing:true};
}
function evaluateMethodEvidence(outcomes){
 // Descriptive only: not a causal inference or learner-type label.
 const groups={A:[],B:[],C:[]};
 for(const x of outcomes||[]){
  if(groups[x.arm]&&x.independent&&x.phase==='delayed_recall'&&x.days_since_last_teaching>=1)
   groups[x.arm].push(x.correct?1:0);
 }
 const summary=Object.fromEntries(Object.entries(groups).map(([arm,a])=>[arm,{
   n:a.length,correct:a.reduce((v,x)=>v+x,0),accuracy:a.length?a.reduce((v,x)=>v+x,0)/a.length:null
 }]));
 const reliable=Object.values(summary).every(x=>x.n>=20);
 return {summary,decision:'no_causal_personalisation',sufficient_to_describe:reliable,
   note:'Matched word sets, time-matching, randomisation and research approval are required before comparative claims.'};
}
module.exports={STAGES,checkWord,learningPlan,gradeAttempt,chooseSupport,nextReview,evaluateMethodEvidence};

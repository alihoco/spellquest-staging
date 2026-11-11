'use strict';
const STAGES=['HEAR','DISCOVER','UNDERSTAND','EXPLAIN','BUILD','RECALL','REINFORCE','REMEMBER'];
function compileDraftLesson(word,{responseMode='full_alphabet_tap',includeMeaning=false}={}){
 if(!word||!word.spelling)throw Error('A validated word record is required');
 const script=word.teaching?.provisional_script;
 if(!script)throw Error('Instruction scripts are absent');
 const segments=[
  {stage:'HEAR',kind:'teacher_audio',text:script.preview_word,answerVisible:false},
  {stage:'HEAR',kind:'whole_word_audio',word:word.spelling,answerVisible:false,source_status:word.audio?.whole_word?.approved?'approved':'awaiting_audio_approval'},
  {stage:'DISCOVER',kind:'teacher_audio',text:script.question,answerVisible:false},
  {stage:'DISCOVER',kind:'independent_input',mode:responseMode,answerVisible:false},
  {stage:'UNDERSTAND',kind:'verified_speech_analysis',requiresReviewedSoundUnits:true,enabled:word.teaching?.sound_review?.status==='approved'},
  {stage:'EXPLAIN',kind:'teacher_audio',text:script.first_error,conditional:'after_incorrect'},
  {stage:'EXPLAIN',kind:'orthography_teaching',text:script.explain,orthographicUnits:word.teaching.orthographic_units,conditional:'after_incorrect'},
  ...(includeMeaning?[{stage:'EXPLAIN',kind:'optional_definition',text:script.definition,example:script.contextual_example}]:[]),
  {stage:'BUILD',kind:'assisted_practice',options:['grapheme_tiles','exact_letter_tiles','three_choice'],conditional:'if_needed'},
  {stage:'RECALL',kind:'teacher_audio',text:script.independent_recall,answerVisible:false},
  {stage:'RECALL',kind:'independent_input',mode:responseMode,answerVisible:false},
  {stage:'REINFORCE',kind:'targeted_feedback',source:'reviewed_error_patterns',notGenericPraise:true},
  {stage:'REMEMBER',kind:'schedule_delayed_independent_recall',minimumDelayDays:1}
 ];
 const blockers=[];
 if(!word.audio?.whole_word?.approved)blockers.push('Whole word audio is unapproved');
 if(!word.teaching?.explanation?.approved)blockers.push('Teaching explanation is unapproved');
 if(word.teaching?.sound_review?.status!=='approved')blockers.push('No specialist-reviewed spoken units; do not play isolated sounds');
 if(!word.meaning?.definition||!word.meaning?.example_sentence)blockers.push('Definition / example missing');
 if(word.status!=='approved')blockers.push('Word not editorially approved');
 return {wordId:word.id,status:blockers.length?'draft_only':'publish_candidate',blockers,segments,reviewedStandaloneSounds:segments.some(x=>x.kind==='verified_speech_analysis'&&x.enabled),
  clinicalEfficacyEstablished:false};
}
module.exports={STAGES,compileDraftLesson};

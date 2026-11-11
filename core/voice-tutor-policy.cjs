'use strict';
const STATES=Object.freeze(['idle','teacher_speaking','learner_turn','checking','explaining','waiting_for_input','paused','audio_unavailable']);
const SPEECH_EVAL=Object.freeze({activity:'pilot_only',whole_word:'experimental_uncertain',phoneme:'disabled_pending_validation'});
const SCRIPT_PHASES=Object.freeze({
 welcome:'y6-v08-welcome',hear:'whole_word_approved',discover:'approved_question_audio',
 understand:'reviewed_sound_audio_only',explain:'reviewed_spelling_explanation',
 build:'assisted_build_instruction',recall:'unaided_spelling_instruction',
 reinforce:'specific_feedback',remember:'delayed_recall_instruction'
});
function createVoiceState({approvedNarrator,enabled=true}={}){
 if(!approvedNarrator)throw Error('Approved narrator required');
 return {state:'idle',narrator:approvedNarrator,enabled,hasUserGesture:false,microphonePermission:false,
  transcript:null,recognitionUncertain:false,activeClip:null,learnerPace:'relaxed'};
}
function advanceVoice(state,event){
 if(!state||!STATES.includes(state.state))throw Error('Invalid voice state');
 const s={...state};const {type}=event||{};
 if(type==='START'){if(!event.userGesture)throw Error('Start requires gesture');s.hasUserGesture=true;s.state=s.enabled?'teacher_speaking':'waiting_for_input';return s}
 if(type==='PLAY'){if(!s.hasUserGesture||!event.approvedClip)throw Error('Only approved audio after gesture');s.state='teacher_speaking';s.activeClip=event.approvedClip;return s}
 if(type==='TEACHER_DONE'){if(s.state!=='teacher_speaking')throw Error('Not playing');s.activeClip=null;s.state='learner_turn';return s}
 if(type==='ALLOW_INPUT'){s.state='waiting_for_input';return s}
 if(type==='LISTEN'){if(s.state==='teacher_speaking'||!s.microphonePermission)throw Error('Cannot listen during playback or without permission');s.state='learner_turn';return s}
 if(type==='MIC_PERMISSION'){s.microphonePermission=!!event.allowed;return s}
 if(type==='WHOLE_WORD_RECOGNITION'){
  if(s.state!=='learner_turn')throw Error('No learner turn');
  s.recognitionUncertain=!event.confident;s.transcript=event.confident?event.transcript||null:null;
  // Even a confident recogniser does NOT validate phoneme articulation.
  s.state='waiting_for_input';return s;
 }
 if(type==='PHONEME_CORRECTION')throw Error('Automated phoneme correction not approved');
 if(type==='AUDIO_ERROR'){s.state='audio_unavailable';s.activeClip=null;return s}
 if(type==='PAUSE'){s.state='paused';s.activeClip=null;return s}
 if(type==='RESUME'){s.state='waiting_for_input';return s}
 if(type==='TURN_OFF_AUDIO'){s.enabled=false;s.state='waiting_for_input';s.activeClip=null;return s}
 throw Error('Unsupported event '+type);
}
module.exports={STATES,SPEECH_EVAL,SCRIPT_PHASES,createVoiceState,advanceVoice};

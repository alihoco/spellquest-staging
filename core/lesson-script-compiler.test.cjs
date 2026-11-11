'use strict';
const assert=require('node:assert/strict');
const {compileDraftLesson}=require('./lesson-script-compiler.cjs');
const data=require('./seed-word-records-y5-6.json');
assert.equal(data.records.length,5);
for(const word of data.records){
 const lesson=compileDraftLesson(word,{includeMeaning:true,responseMode:'full_alphabet_tap'});
 assert.equal(lesson.status,'draft_only');
 assert.equal(lesson.reviewedStandaloneSounds,false);
 assert.equal(lesson.segments.some(x=>x.kind==='optional_definition'),true);
 const inputs=lesson.segments.filter(x=>x.kind==='independent_input');
 assert.equal(inputs.length,2);
 assert.equal(inputs.every(x=>!x.answerVisible&&x.mode==='full_alphabet_tap'),true);
 assert.equal(lesson.blockers.some(x=>x.includes('unapproved')),true);
 assert.equal(word.pronunciation_reference.reviewed_by_specialist,false);
 assert.equal(word.pronunciation_reference.source.startsWith('https://dictionary.cambridge.org/pronunciation/english/'),true);
 assert.equal(word.teaching.orthographic_units.join(''),word.spelling);
 assert.equal(lesson.segments.some(x=>x.kind==='teacher_audio'&&x.text===word.teaching.provisional_script.question),true);
}
console.log('Five voice-led lesson drafts compiled and safely blocked pending reviews');

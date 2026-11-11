'use strict';
const assert=require('node:assert/strict');
const data=require('./seed-word-records-y5-6.json');
const engine=require('./teaching-engine.cjs');
assert.equal(data.records.length,5);
assert.equal(new Set(data.records.map(w=>w.spelling)).size,5);
for(const w of data.records){
 assert.equal(w.locale,'en-GB');
 assert.equal(w.curriculum.verified_against_source,true);
 assert.equal(w.teaching.orthographic_units.join(''),w.spelling);
 assert.ok(w.meaning.definition.length>15);
 assert.ok(w.meaning.example_sentence.includes(w.spelling));
 assert.ok(w.meaning.source_url.startsWith('https://'));
 assert.ok(w.teaching.targets.length>0);
 assert.equal(w.teaching.sound_units.length,0,'No invented phonetic data');
 assert.equal(w.audio.whole_word.approved,false);
 assert.equal(engine.learningPlan({word:w}).state,'blocked','Unreviewed words must remain unavailable to learner');
 assert.equal(w.publishable,false);
 for(const example of w.teaching.misconception_examples){
   assert.notEqual(example.match,w.spelling);
   assert.ok(example.say.length>15);
 }
}
console.log('Five draft word records verified and safely blocked until expert/audio approval');

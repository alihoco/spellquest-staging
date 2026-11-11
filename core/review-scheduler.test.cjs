'use strict';
const assert=require('node:assert/strict');
const S=require('./review-scheduler.cjs');
assert.equal(S.addDays('2026-11-11',1),'2026-11-12');
assert.equal(S.schedule({word_id:'necessary',teaching_date:'2026-11-11'}).due,'2026-11-12');
const history=[{word_id:'necessary',date:'2026-11-12',correct:true,independent:true,delayed:true,shown_target_letters:false}];
assert.equal(S.schedule({word_id:'necessary',teaching_date:'2026-11-11',history}).due,'2026-11-15');
const miss=[{word_id:'necessary',date:'2026-11-12',correct:false,independent:true,shown_target_letters:false}];
assert.equal(S.schedule({word_id:'necessary',teaching_date:'2026-11-11',history:miss}).phase,'targeted_reteach');
const queue=S.dailyQueue({today:'2026-11-13',word_records:[{id:'necessary',teaching_date:'2026-11-11'}],new_words:['embarrass']});
assert.equal(queue.review.length,1);
const mixed=S.mixedReview({word_ids:['a','b','c','d'],items:[{id:'a',cluster:'double'},{id:'b',cluster:'double'},{id:'c',cluster:'suffix'},{id:'d',cluster:'suffix'}]});
assert.notEqual(mixed[0],mixed[1]);

const reviewed=S.buildMixedSession({
 today:'2026-11-15',
 word_records:[
  {id:'necessary',teaching_date:'2026-11-01'},
  {id:'foreign',teaching_date:'2026-11-01'},
  {id:'government',teaching_date:'2026-11-01'},
  {id:'rhythm',teaching_date:'2026-11-01'}
 ],
 candidate_new_words:['environment','embarrass','temperature'],
 max_turns:8,max_new:2,review_to_new:2
});
assert.deepEqual(reviewed.turns.map(x=>x.type),[
 'delayed_independent_recall','delayed_independent_recall','new_instruction',
 'delayed_independent_recall','delayed_independent_recall','new_instruction'
]);
assert.equal(reviewed.turns.filter(x=>x.type==='new_instruction').length,2);
const reviewOnly=S.buildMixedSession({
 today:'2026-11-15',word_records:Array.from({length:9},(_,i)=>({id:'old'+i,teaching_date:'2026-11-01'})),
 candidate_new_words:['new-a','new-b'],max_turns:6,max_new:2
});
assert.equal(reviewOnly.turns.every(x=>x.type==='delayed_independent_recall'),true);
assert.equal(reviewOnly.due_remaining,3);
const startNew=S.buildMixedSession({today:'2026-11-15',candidate_new_words:['a','b','c'],max_turns:6,max_new:2});
assert.deepEqual(startNew.turns.map(x=>x.word_id),['a','b']);

console.log('SpellQuest pilot scheduler checks passed');

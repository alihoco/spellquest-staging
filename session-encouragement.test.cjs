'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const close=require('./session-encouragement.js');
const html=x=>fs.readFileSync('./'+x,'utf8');
test('Brand promise is prominent and has safe mobile sizes',()=>{
 const page=html('year6.html'),styles=html('spellmaster-entry.css');
 assert.match(page,/class="brand-promise"/);
 assert.match(page,/Better today <em>than yesterday<\/em>/);
 assert.match(styles,/\.brand-promise strong/);
 assert.match(styles,/body\.lesson-active \.brand-promise/);
 assert.match(styles,/@media\(max-width:640px\)/);
});
test('First session encourages effort without falsely claiming improvement',()=>{
 const note=close.message({attempts:[{word:'people',initial:false,learned:false}],history:{}});
 assert.equal(note.hasMeasuredImprovement,false);
 assert.match(note.spoken,/Every word you try is a chance to learn/);
 assert.equal(note.slogan,'Better today than yesterday');
 assert.ok(!/you are better today/i.test(note.fullSpeech));
});
test('Assisted correction praises persistence rather than mastered memory',()=>{
 const note=close.message({attempts:[{word:'people',initial:false,learned:true}],history:{}});
 assert.equal(note.hasMeasuredImprovement,false);
 assert.match(note.spoken,/with help/);
 assert.ok(!/mastered/i.test(note.spoken));
});
test('Only an independent correct spelling after an earlier error supports personal improvement',()=>{
 const attempts=[{word:'people',initial:true,learned:true}];
 const history={people:{events:[{date:'2026-11-17',correct:false,afterHelp:false}]}};
 const previous=close.message({attempts,history,today:'2026-11-19'});
 assert.equal(previous.hasMeasuredImprovement,true);
 assert.match(previous.spoken,/tricky before/);
 assert.equal(close.message({attempts,history:{people:{events:[{date:'2026-11-19',correct:false,afterHelp:false}]}},today:'2026-11-19'}).hasMeasuredImprovement,false);
 assert.equal(close.message({attempts:[{word:'people',initial:false,learned:true}],history,today:'2026-11-19'}).hasMeasuredImprovement,false);
});
test('All practice session endpoints display and speak the personalised slogan',()=>{
 const game=html('year6.html'),sprint=html('spelling-sprint.html'),assessment=html('starting-assessment.html');
 assert.match(game,/sessionClosingBlock\(ending\)/);
 assert.match(game,/speakSessionClosing\(ending\)/);
 assert.match(game,/replaySessionClosing/);
 assert.match(sprint,/function finishSprint\(\)/);
 assert.match(sprint,/id="sprint-session-close"/);
 assert.match(sprint,/session-encouragement\.js/);
 assert.match(assessment,/function showAssessmentClosing\(\)/);
 assert.match(assessment,/id="assessment-session-close"/);
 assert.match(assessment,/replayAssessmentClosing/);
});

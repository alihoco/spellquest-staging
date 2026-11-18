'use strict';
const assert=require('node:assert/strict');
const sel=require('./mixed-word-selection.js');
const words=['necessary','embarrass','accommodate','government','foreign','familiar','environment','privilege','rhythm','temperature'].map(word=>({word}));
const today='2026-11-18',later='2026-11-19';
const history={};
assert.equal(sel.select({words,history,session:[],today,runCount:0}).kind,'new');
history.necessary={events:[{date:today,correct:true}],next:later};
const first=sel.select({words,history,session:[],today,runCount:0});
assert.equal(first.word,undefined);
assert.equal(first.kind,'new');
assert.equal(words[first.i].word,'embarrass');
history.embarrass={events:[{date:'2026-11-15',correct:true}],next:today};
const due=sel.select({words,history,session:[],today,runCount:0});
assert.equal(due.kind,'due');
assert.equal(words[due.i].word,'embarrass');
const earlyMix=sel.select({words,history:{necessary:{events:[{correct:true}],next:later},embarrass:{events:[{correct:true}],next:later}},
 session:[{word:'necessary'},{word:'embarrass'}],today,runCount:2});
assert.equal(earlyMix.kind,'practice','Interleave a previous spelling after two initial words');
assert.equal(words[earlyMix.i].word,'necessary','Avoid immediately repeating the last word');
const session=[{word:'necessary',initial:true},{word:'government',initial:true},{word:'privilege',initial:true},
 {word:'foreign',initial:true},{word:'environment',initial:true}];
const combined=sel.select({words,history,session,today,runCount:5});
assert.equal(combined.kind,'practice');
assert.equal(['foreign','environment'].includes(words[combined.i].word),false,'No immediate two-word repeat');
const allKnown=Object.fromEntries(words.map(w=>[w.word,{events:[{date:today,correct:true}],next:later}]));
const firstOld=sel.select({words,history:allKnown,session:[],today,runCount:0});
assert.equal(firstOld.kind,'practice','All-known but not-due accounts must not lock out');
let turns=[];
for(let i=0;i<110;i++){
 const choice=sel.select({words,history:allKnown,session:turns,today,runCount:i});
 assert.equal(choice.kind,'practice');
 const name=words[choice.i].word;
 if(i>=2)assert.notEqual(name,turns.at(-1).word,'Back-to-back same word is avoidable');
 turns.push({word:name});
}
assert.ok(new Set(turns.map(x=>x.word)).size===10,'All ten reviewed pilot words circulate');
assert.equal(sel.select({words:[],history:allKnown,session:turns,today,runCount:110}),null);
console.log('Mixed due/novel/practice scheduling remains playable beyond 100 words without immediate repetitions');

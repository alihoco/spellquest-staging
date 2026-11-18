'use strict';
const assert=require('node:assert/strict');
const p=require('./celebration-feedback.js');
const state=p.makeState();
const outputs=[];
for(let i=0;i<70;i++){
 const category=i%4===0?'after_help':'first';
 const v=p.next(state,category);
 assert.equal(v.category,category);
 assert.equal(v.indicatesMastery,false);
 assert.equal(p.audioClips()[v.clip],v.text);
 if(outputs.length)assert.notEqual(v.clip,outputs.at(-1).clip,'Do not repeat immediately');
 outputs.push(v);
}
assert.equal(Object.keys(p.audioClips()).length,20);
assert.ok(p.POOLS.first.some(x=>x.startsWith('Great job')));
assert.ok(p.POOLS.after_help.some(x=>x.startsWith('Awesome work')));
assert.throws(()=>p.next(state,'master'));
console.log('20 proportionate varied praise clips, matching audio and no adjacent repeat validated');

'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const curriculum=require('./adaptive-curriculum.js');
const catalogue=require('./core/national-curriculum-catalogue.json');
test('People uses spelling-only visual groups, independently of the learner age',()=>{
 const words=curriculum.prepare(catalogue,{});
 const entry=words.find(w=>w.word==='people');
 assert.deepEqual(entry.spelling,['peo','ple']);
 assert.equal(entry.spelling.join(''),'people');
 assert.equal(entry.audioApproved,false);
 assert.equal(entry.wholeWordDraft,true);
});
test('Compact read-aloud uses shared AI audio endpoint, never browser speech synthesis',()=>{
 const reader=fs.readFileSync('./spellmaster-reader.js','utf8');
 assert.ok(reader.includes('/api/read-aloud'));
 assert.ok(reader.includes('spellmaster-speaker'));
 assert.equal(reader.includes('speechSynthesis'),false);
 new vm.Script(reader);
 const app=fs.readFileSync('./accessibility-tools.js','utf8');
 assert.equal(app.includes('speechSynthesis'),false);
});
test('Learner-facing pages load compact speaker controls',()=>{
 for(const page of ['year6.html','starting-assessment.html','spelling-sprint.html']){
  const html=fs.readFileSync('./'+page,'utf8');
  assert.ok(html.includes('spellmaster-reader.js'),page+' missing reader');
 }
});

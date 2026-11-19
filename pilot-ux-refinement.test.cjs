'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const words=require('./core/national-curriculum-catalogue.json').words;
const policy=require('./starting-point-policy.js');
const LP=require('./learner-profiles.js');
const read=file=>fs.readFileSync(__dirname+'/'+file,'utf8');
test('Ten-word assessment adapts from independent responses, never age',()=>{
 for(const correct of [true,false]){
  const responses=[],seen=new Set();
  for(let i=0;i<10;i++){
   const item=policy.planned(responses);
   assert.ok(item,'A word should be available for each of ten turns');
   assert.ok(words.some(x=>x.word===item.word),'All probes must exist in the curriculum');
   assert.equal(seen.has(item.word),false,'No word repeated');
   seen.add(item.word);responses.push({...item,independent:correct});
  }
  assert.equal(policy.planned(responses),null);
  assert.ok(['year1','year2','year3_4','year5_6'].includes(policy.placement(responses).currentBand));
  assert.equal(policy.placement(responses).source,'adaptive_10_word_assessment_provisional');
 }
 const wrong=[],right=[];
 for(let i=0;i<10;i++){const a=policy.planned(wrong),b=policy.planned(right);wrong.push({...a,independent:false});right.push({...b,independent:true});}
 assert.notDeepEqual(wrong.map(x=>x.word),right.map(x=>x.word),'Early accuracy changes later probe difficulty');
});
test('Guest assessment attaches only to first learner profile, with no sibling mixing',()=>{
 const store=new Map();
 const storage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
 const responses=Array.from({length:10},(_,i)=>({word:'word'+i,band:'year1',independent:i<5}));
 const placement=policy.placement(responses);
 storage.setItem('spellmaster-starting-assessment-v1:guest',JSON.stringify({date:'2026-11-19',responses,placement}));
 const first=LP.add(storage,{alias:'First Explorer',ageYears:9});
 const original=JSON.parse(storage.getItem('spellmaster-starting-assessment-v1:'+first.id));
 assert.equal(original.transferredFromGuest,true);
 assert.equal(original.responses.length,10);
 assert.equal(storage.getItem('spellmaster-starting-assessment-v1:guest'),null);
 assert.equal(JSON.parse(storage.getItem('spellmaster-placement-v1:'+first.id)).currentBand,placement.currentBand);
 const second=LP.add(storage,{alias:'Second Explorer',ageYears:7});
 assert.equal(storage.getItem('spellmaster-starting-assessment-v1:'+second.id),null);
});
test('Mobile learner experience prioritises the question and retry over controls',()=>{
 const css=read('pilot-learning-focus.css'),game=read('year6.html');
 assert.match(css,/body\.lesson-active main>\.hero\{display:none/);
 assert.match(css,/body\.lesson-active \.sm-path/);
 assert.match(css,/position:sticky/);
 assert.match(game,/quick-play/);
 assert.match(game,/SpellmasterLessonAudioStop=stop/);
 assert.match(game,/<button onclick=\\"retry\(\)\\">/);
 assert.match(game,/class="voice-options"/);
});
test('Narration and guardian setup are concise but accessible',()=>{
 const server=read('server.js'),reader=read('spellmaster-reader.js'),form=read('family-signup.html');
 const match=server.match(/CLIPS\['spellmaster-adaptive-welcome-v1'\]='([^']+)';/);
 assert.ok(match&&match[1].length<170,'Welcome should be a brief prompt');
 assert.match(reader,/width:44px/);
 assert.match(reader,/data-speak-label/);
 assert.match(form,/family-step1/);
 assert.match(form,/family-step2/);
 assert.match(form,/familyGo\(2\)/);
});

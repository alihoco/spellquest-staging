'use strict';
const assert=require('node:assert/strict');
const api=require('./adaptive-curriculum.js');
const source=require('./core/national-curriculum-catalogue.json');
const words=api.prepare(source,{necessary:{word:'necessary',spelling:['ne','ces','sa','ry']}});
assert.equal(words.length,615);
assert.equal(new Set(words.map(w=>w.word)).size,615);
assert.deepEqual(words.find(w=>w.word==='necessary').spelling,['ne','ces','sa','ry']);
assert.deepEqual(words.find(w=>w.word==='about').spelling,['about']);
assert.equal(words.find(w=>w.word==='about').audioApproved,false);
assert.equal(api.ageStartingBand(5),'year1');
assert.equal(api.ageStartingBand(7),'year2');
assert.equal(api.ageStartingBand(8),'year3_4');
assert.equal(api.ageStartingBand(10),'year5_6');
assert.equal(api.yearStartingBand(1),'year1');
assert.equal(api.yearStartingBand(3),'year3_4');
assert.equal(api.yearStartingBand(6),'year5_6');
assert.equal(api.starter({schoolYear:6},6),'year2');
assert.equal(api.starter({},6),'year2');
assert.equal(api.starter({},15),'year2','Age never infers spelling ability');
const data=new Map(),store={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v))};
const learner={id:'lp-test123',schoolYear:1};
assert.equal(api.readPlacement(store,learner,6).currentBand,'year2');
for(const w of words.filter(x=>x.band==='year2'&&!x.teachingGroups.includes('homophone_context')).slice(0,4)){
 api.recordIndependent(store,learner,6,w,true);
}
assert.equal(api.readPlacement(store,learner,6).currentBand,'year3_4','Strong first tries should move a band up');
for(const w of words.filter(x=>x.band==='year3_4'&&!x.teachingGroups.includes('homophone_context')).slice(0,4)){
 api.recordIndependent(store,learner,6,w,false);
}
assert.equal(api.readPlacement(store,learner,6).currentBand,'year2','Repeated difficulty should move a band down');
assert.equal(api.readPlacement(store,learner,6).baselineBand,'year2');
assert.equal(api.readPlacement(store,learner,6).moves.length,2);
const p1=api.pool(words,{},api.readPlacement(store,learner,6));
assert.ok(p1.every(w=>w.band==='year2'),'Fresh words should start at the assessment-neutral band');
assert.ok(p1.every(w=>!w.teachingGroups.includes('homophone_context')),'Ambiguous homophones require approved context');
assert.ok(p1.length>100);
const history={necessary:{events:[{correct:false}],next:'2026-11-18'},about:{events:[{correct:true}]}};
const p2=api.pool(words,history,api.readPlacement(store,learner,6));
assert.ok(p2.find(w=>w.word==='necessary'),'Previously encountered words remain eligible across bands');
const one=words.find(x=>x.word==='one');
assert.ok(one.teachingGroups.includes('homophone_context'));
assert.equal(p2.some(x=>x.word==='one'),false,'No bare homophone tests');
for(const ambiguous of ['live','minute','use'])
 assert.equal(api.pool(words,{}, {currentBand:words.find(w=>w.word===ambiguous).band}).some(w=>w.word===ambiguous),false,
 'No uncontextualised homograph quiz: '+ambiguous);
const playable=api.BANDS.flatMap(b=>api.pool(words,{}, {currentBand:b}));
assert.equal(playable.length,588,'The bank contains 615 entries, with 27 held for spoken context');
api.resetStartingPoint(store,{...learner,schoolYear:5},10);
assert.equal(api.readPlacement(store,{...learner,schoolYear:5},10).currentBand,'year2');
assert.throws(()=>api.prepare({words:[]}),/count/);
console.log('615 bank, correct year placement, independent rise/fall, reviewed homophone gate and local persistence verified');

'use strict';
const assert=require('node:assert/strict');
const p=require('./learner-profiles.js');
const map=new Map(),store={getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
const alice=p.add(store,{alias:'Explorer One',birth:'2020-07'});
assert.ok(alice.id.startsWith('lp-'));
assert.equal(p.ageInYears(alice.birth,new Date('2026-11-13T09:00:00Z')),6);
assert.equal(p.themeForAge(6),'wonder');
const bob=p.add(store,{alias:'Word Fox',birth:'2013-05'});
assert.notEqual(p.historyKey(alice),p.historyKey(bob));
assert.equal(p.active(store).id,bob.id);
p.choose(store,alice.id);
assert.equal(p.active(store).id,alice.id);
p.updateTheme(store,alice.id,'adventure');
assert.equal(p.active(store).theme,'adventure');
const sample={necessary:{retained:0,next:'2026-11-13',events:[
 {correct:false,error_category:'missing_s',afterHelp:false},
 {correct:true,afterHelp:true}]},government:{retained:1,next:'2026-11-16',events:[
 {correct:true,afterHelp:false}]}};
const s=p.summary(sample,'2026-11-13');
assert.equal(s.wordsSeen,2);
assert.equal(s.dueWords,1);
assert.equal(s.initialCorrect,1);
assert.equal(s.delayedRetained,1);
assert.equal(s.difficulties[0].misses,1);
assert.throws(()=>p.add(store,{alias:'bad',birth:'2030-12'}));
store.setItem(p.historyKey(alice),'{"necessary":{}}');
p.forget(store,alice.id);
assert.equal(store.getItem(p.historyKey(alice)),null);
assert.equal(p.readProfiles(store).length,1);
console.log('Local tester profiles, age themes, isolation and progress tests passed');

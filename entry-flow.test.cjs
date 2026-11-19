'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const entry=require('./spellmaster-entry.js');
const source=fs.readFileSync('./year6.html','utf8');
const css=fs.readFileSync('./spellmaster-entry.css','utf8');
function makeStore(){
 const mem=new Map();
 return {getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,String(v))};
}
test('No learner sees one simple age-and-nickname setup',()=>{
 const store=makeStore();
 assert.equal(entry.state(null,store,{}),'setup');
 assert.ok(source.includes('id="new-alias"'));
 assert.ok(source.includes('id="new-age"'));
 assert.ok(source.includes('Start my adventure'));
 assert.ok(source.includes("window.location.assign('/starting-assessment.html')"));
 assert.ok(!source.includes('id="new-birth"'));
});
test('Profile without a diagnostic enters the 10-word assessment',()=>{
 const store=makeStore(),p={id:'lp-abc',ageYears:9,alias:'Explorer'};
 assert.equal(entry.state(p,store,{}),'assessment');
 assert.ok(source.includes('Begin my ten words'));
 assert.ok(source.includes('starting-assessment.html'));
});
test('Assessment or earlier attempts make the same learner a returning explorer',()=>{
 const store=makeStore(),p={id:'lp-abc',alias:'Explorer'};
 store.setItem('spellmaster-starting-assessment-v1:lp-abc',JSON.stringify({responses:Array.from({length:10},()=>({word:'said',independent:false}))}));
 assert.equal(entry.state(p,store,{}),'returning');
 assert.equal(entry.state({id:'lp-other',alias:'Another'},store,{}),'assessment','Must not share the first learner’s baseline');
 assert.equal(entry.state({id:'lp-other'},store,{people:{events:[{correct:false}]}}),'returning');
 assert.ok(source.includes('Continue my adventure'));
});
test('Landing hides decorative bars and the child never sees empty peer progress before the lesson',()=>{
 assert.ok(css.includes('body.entry-home .sm-path'));
 assert.ok(css.includes('body.entry-home .sm-character'));
 assert.ok(css.includes('body.entry-home .sm-side'));
 assert.ok(css.includes('body.entry-home #app.panel:before'));
 assert.ok(source.includes('class="entry-progress"')||source.includes('class="entry-progress'));
 assert.ok(source.includes('Parent & explorer settings'));
 assert.ok(source.includes('class="sprint-feature"'));
 assert.ok(source.includes('class="next-chapter"'));
 assert.ok(source.includes('SpellmasterEntry'));
});

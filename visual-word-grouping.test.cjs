'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const catalogue=require('./core/national-curriculum-catalogue.json');
const proposals=require('./core/visual-word-grouping-proposals-v1.json');
const generator=require('./core/generate-visual-word-groups.cjs');
test('Every one of the 615 DfE inventory words has a versioned draft visual segmentation',()=>{
 assert.equal(catalogue.words.length,615);
 assert.equal(proposals.entries.length,615);
 assert.equal(new Set(proposals.entries.map(x=>x.id)).size,615);
 for(const word of catalogue.words){
  const proposed=proposals.entries.find(x=>x.id===word.id);
  assert.ok(proposed,word.word+' missing grouping record');
  assert.equal(proposed.word,word.word);
  assert.equal(proposed.visual_units.join(''),word.word);
  assert.ok(proposed.visual_units.length>=1&&proposed.visual_units.length<=5);
  assert.ok(proposed.visual_units.every(x=>x.length>0));
 }
});
test('Approved phoneme, syllable and morphology fields are never invented',()=>{
 for(const word of proposals.entries){
  assert.equal(word.lesson_approved,false,word.word);
  assert.equal(word.audio_segments_approved,false,word.word);
  assert.equal(word.sound_alignment_approved,false,word.word);
  assert.equal(word.linguistic_accuracy_approved,false,word.word);
  assert.equal(word.review_status,'pending_specialist_review');
  assert.deepEqual(word.phoneme_units,[]);
  assert.deepEqual(word.spoken_syllables,[]);
  assert.deepEqual(word.morphemes,[]);
 }
});
test('Non-linguistic visual groups remain distinct from sound claims',()=>{
 const words=Object.fromEntries(proposals.entries.map(x=>[x.word,x]));
 for(const [word,expected] of Object.entries({people:'peo|ple',necessary:'ne|ces|sa|ry',government:'govern|ment',environment:'environ|ment',back:'b|a|ck',happy:'hap|py',blackberry:'black|berry',book:'b|oo|k'})){
  assert.equal(words[word]?.visual_units.join('|'),expected);
 }
});
test('Generated proposals are repeatable from DfE source and never rely on age as spelling ability',()=>{
 assert.deepEqual(generator.generate(catalogue).entries,proposals.entries);
 const text=fs.readFileSync('./core/generate-visual-word-groups.cjs','utf8');
 assert.ok(!text.includes('learner.age'));
});
test('The 615 proposed chunks are not automatically placed into live phonics lessons',()=>{
 const code=fs.readFileSync('./adaptive-curriculum.js','utf8');
 assert.ok(!code.includes('visual-word-grouping-proposals-v1.json'));
 const html=fs.readFileSync('./curriculum-grouping-review.html','utf8');
 assert.ok(html.includes('pending')||html.includes('Pending specialist review'));
 assert.ok(html.includes('visual-word-grouping-proposals-v1.json'));
});

test('Only documented specialist approval records can replace a staging grouping',()=>{
 const curriculum=require('./adaptive-curriculum.js');
 const word=catalogue.words.find(x=>x.word==='people');
 const noApproval=curriculum.prepare(catalogue,{},proposals).find(x=>x.word==='people');
 assert.equal(noApproval.visualGroupingStatus,'staging_draft_or_whole_word');
 assert.deepEqual(noApproval.spelling,['peo','ple']);
 const reviewed={entries:[{id:word.id,spelling:word.word,status:'approved',reviewer_role:'qualified_literacy_specialist',reviewer_ref:'specialist-review-record-001',reviewed_at:'2026-11-19',visual_units:['pe','ople']}]};
 const newResult=curriculum.prepare(catalogue,{},reviewed).find(x=>x.word==='people');
 assert.equal(newResult.visualGroupingStatus,'specialist_reviewed');
 assert.deepEqual(newResult.spelling,['pe','ople']);
 const falseApproval=curriculum.prepare(catalogue,{}, {entries:[{...reviewed.entries[0],visual_units:['people','x']}]}).find(x=>x.word==='people');
 assert.equal(falseApproval.visualGroupingStatus,'staging_draft_or_whole_word');
});
test('Full inventory distinguishes visually grouped and deliberately whole words',()=>{
 const split=proposals.entries.filter(w=>w.visual_units.length>1).length;
 const whole=proposals.entries.filter(w=>w.visual_units.length===1).length;
 assert.equal(split,499);
 assert.equal(whole,116);
 assert.equal(split+whole,615);
 assert.equal(proposals.entries.filter(w=>w.basis==='curated_model_editorial_draft').length,557);
});

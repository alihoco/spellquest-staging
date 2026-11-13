'use strict';
const assert=require('node:assert/strict');
const source=require('./england-national-curriculum-source-v1.json');
const {buildCatalog,expandOfficial}=require('./national-curriculum-catalogue.cjs');
const catalog=require('./national-curriculum-catalogue.json');
assert.equal(source.sets.year3_4_statutory.length,100);
assert.equal(source.sets.year5_6_statutory.length,100);
assert.equal(catalog.counts.official_year3_4_entries,100);
assert.equal(catalog.counts.official_year5_6_entries,100);
assert.equal(catalog.words.length,catalog.counts.unique_words);
assert.deepEqual(buildCatalog(),catalog);
assert.deepEqual(expandOfficial('equip (–ped, –ment)'),['equip','equipped','equipment']);
assert.deepEqual(expandOfficial('woman/women'),['woman','women']);
assert.deepEqual(expandOfficial('occasion(ally)'),['occasion','occasionally']);
assert.equal(new Set(catalog.words.map(x=>x.word)).size,catalog.words.length);
for(const word of ['necessary','government','embarrass','environment','accommodate']){
 const row=catalog.words.find(x=>x.word===word);
 assert.equal(row.curriculum_band,'year5_6');
 assert.equal(row.curriculum_role,'statutory_wordlist');
 assert.equal(row.sound_alignment_approved,false);
}
for(const word of ['their','children','because','today']){
 const row=catalog.words.find(x=>x.word===word);
 assert.ok(row);
 assert.notEqual(row.curriculum_role,'statutory_wordlist','Year 1/2 exceptions are not KS2 statutory list entries');
}
for(const row of catalog.words){
 assert.ok(row.teaching_groups.length);
 assert.equal(row.teaching_approval,'curriculum_inventory_only');
 assert.ok(['year1','year2','year3_4','year5_6'].includes(row.curriculum_band));
 assert.equal(row.source_entry.length>0,true);
 assert.ok(row.teaching_groups.every(x=>x.annotation_status==='provisional_nonclinical'));
}
console.log('England spelling source, 200 statutory entries and '+catalog.words.length+' deduplicated inventory words validated');

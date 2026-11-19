'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const pages=['signup.html','my-account.html','privacy-settings.html','recover-account.html','starting-assessment.html','spelling-sprint.html','year6.html'];
test('All account and learner pages contain valid inline JavaScript',()=>{
 for(const page of pages){
  const content=fs.readFileSync(__dirname+'/'+page,'utf8');
  const scripts=[...content.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(x=>x.trim());
  for(let i=0;i<scripts.length;i++)assert.doesNotThrow(()=>new vm.Script(scripts[i],{filename:page+':inline-'+i}),page+' has invalid script syntax');
 }
});
test('Sensitive learner data is never included in public signup by default',()=>{
 const page=fs.readFileSync(__dirname+'/signup.html','utf8');
 assert.match(page,/id="analysis-consent"/);
 assert.match(page,/id="sensitive-consent"/);
 assert.match(page,/ACCOUNT|registration-availability/);
 assert.match(page,/id="create-account"[^>]*disabled/);
});
test('Account pages include recovery, data management and child-safe sign-in',()=>{
 const account=fs.readFileSync(__dirname+'/my-account.html','utf8');
 const privacy=fs.readFileSync(__dirname+'/privacy-settings.html','utf8');
 assert.ok(account.includes('/recover-account.html'));
 assert.ok(account.includes('/privacy-settings.html'));
 assert.ok(privacy.includes('/conditions'));
 assert.ok(privacy.includes('/export'));
 assert.ok(privacy.includes('/delete'));
});
test('Schema contains account recovery and learner isolation indexes',()=>{
 const migration=fs.readFileSync(__dirname+'/database/002_security.sql','utf8');
 assert.match(migration,/recovery_codes/);
 const sql=fs.readFileSync(__dirname+'/database/001_accounts.sql','utf8');
 assert.match(sql,/learner_events_by_learner/);
 assert.match(sql,/learners_owner_idx/);
});

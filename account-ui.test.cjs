'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const pages=['signup.html','family-signup.html','family-pilot-information.html','my-account.html','privacy-settings.html','recover-account.html','starting-assessment.html','spelling-sprint.html','year6.html'];
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

test('Optional grouping research is independent of diagnosis consent and prohibited for child profiles',()=>{
 const api=fs.readFileSync(__dirname+'/account-api.js','utf8');
 const schema=fs.readFileSync(__dirname+'/database/003_grouping_research.sql','utf8');
 const privacy=fs.readFileSync(__dirname+'/privacy-settings.html','utf8');
 assert.match(schema,/ADD COLUMN IF NOT EXISTS grouping_research_consent_at/);
 assert.match(api,/section==='research'/);
 assert.match(api,/if\(learner\.isChild\)throw inputError/);
 assert.match(api,/grouping_research_consent_at=CASE WHEN \$2 THEN now\(\) ELSE NULL END/);
 assert.match(privacy,/id="group-research"/);
 assert.match(privacy,/id="save-group-research"/);
});

test('Guardian-only family route is age-only with no diagnosis or email inputs',()=>{
 const page=fs.readFileSync(__dirname+'/family-signup.html','utf8');
 const sql=fs.readFileSync(__dirname+'/database/004_guardian_age.sql','utf8');
 assert.match(page,/id="age"/);
 assert.match(page,/guardianConfirmed:true,guardianConsent:true/);
 assert.match(page,/conditionChoice:'not_supplied'/);
 assert.ok(!page.includes('id="birth"'));
 assert.ok(!page.includes('id="diagnosis"'));
 assert.match(sql,/age_years BETWEEN 4 AND 17/);
 assert.ok(!sql.includes('DO $'));
});

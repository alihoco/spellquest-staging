'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const safe=require('./account-security');
const api=require('./account-api').__test;
test('Recovery codes are strong, single-format values and never stored in plaintext',()=>{
 const a=safe.recoveryCode(),b=safe.recoveryCode();
 assert.equal(a.length,32);assert.notEqual(a,b);assert.equal(safe.normaliseCode(a),a);
 assert.equal(safe.safeCompareHex(safe.safeHash(a),safe.safeHash(a)),true);
 assert.equal(safe.safeCompareHex(safe.safeHash(a),safe.safeHash(b)),false);
 assert.equal(safe.normaliseCode('not-a-real-recovery'),null);
});
test('Passwords are salted and verified without exact string comparison',()=>{
 const hash=api.hashPassword('correct horse battery staple');
 assert.ok(hash.startsWith('scrypt$'));assert.notEqual(hash,api.hashPassword('correct horse battery staple'));
 assert.equal(api.verifyPassword('correct horse battery staple',hash),true);
 assert.equal(api.verifyPassword('wrong',hash),false);
 assert.throws(()=>api.password('weak'),/at least 12/);
});
test('Guardian identities and consent are independently validated',()=>{
 assert.equal(api.username(' Explorer_1 '),'explorer_1');
 assert.throws(()=>api.username('bad username'),/username/);
 assert.throws(()=>api.learnerInput({alias:'Child',conditions:[{code:'dyslexia',status:'suspected'}],conditionChoice:'selected'},'guardian'),/consent/);
 const child=api.learnerInput({alias:'Child',avatar:'fox',conditions:[{code:'dyslexia',status:'suspected'},{code:'adhd',status:'diagnosed'}],conditionChoice:'selected',supportConsent:true,analysisConsent:false},'guardian');
 assert.equal(child.isChild,true);assert.equal(child.conditions.length,2);assert.equal(child.analysisConsent,false);
 assert.throws(()=>api.learnerInput({alias:'Adult',analysisConsent:true},'adult'),/consent/);
 assert.throws(()=>api.learnerInput({alias:'Child',conditions:[{code:'dyslexia',status:'suspected'},{code:'dyslexia',status:'diagnosed'}],conditionChoice:'selected',supportConsent:true},'guardian'),/repeated/);
});
test('The same account cannot label a child as an adult self-managed learner',()=>{
 assert.throws(()=>api.learnerInput({alias:'Learner',isChild:true},'adult'),/guardian/);
});

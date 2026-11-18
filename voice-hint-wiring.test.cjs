'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const server=fs.readFileSync(require('node:path').join(__dirname,'server.js'),'utf8');
const html=fs.readFileSync(require('node:path').join(__dirname,'year6.html'),'utf8');
const feedback=require('./spelling-feedback.js');
assert.match(server,/\nObject\.assign\(CLIPS,require\('\.\/spelling-feedback\.js'\)\.audioClips\(\)\);/);
assert.doesNotMatch(server,/spoken\.\\nObject\.assign/);
for(const id of ['spellmaster-error-government-missing_n','spellmaster-error-necessary-missing_s','spellmaster-error-generic-beginning'])
 assert.equal(typeof feedback.audioClips()[id],'string');
assert.ok(html.includes('function replayWordHint()'));
assert.ok(html.includes('Hear this hint'));
assert.ok(html.includes('introduceSplitterOnce(t)'));
assert.ok(html.includes("localStorage.setItem(key,'heard')"));
console.log('Hint audio allowlist and once-per-learner divider introduction wiring passed');

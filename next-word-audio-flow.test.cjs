'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const server=fs.readFileSync(path.join(__dirname,'server.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'year6.html'),'utf8');
assert.match(server,/const AUTO_NEXT_WORDS=\[/);
for(const word of ['necessary','embarrass','accommodate','government','foreign','familiar','environment','privilege','rhythm','temperature']){
 assert.match(server,new RegExp("'"+word+"'"));
 assert.match(server,new RegExp("'y6-"+word+"'"));
}
assert.match(server,/CLIPS\['spellmaster-next-'\+word\+'-v1'\]/);
assert.match(server,/spellmaster-right-short-v1/);
assert.match(server,/spellmaster-learned-short-v1/);
assert.match(html,/async function instructionAudio\(\)/);
assert.ok(html.includes('runCount>1?[nextAudioClip(WORDS[idx])]'), 'Use curriculum-aware next word narration');
assert.match(html,/replayCurrentWord\(\)/);
assert.match(html,/The word could not be heard/);
assert.match(html,/if\(t===ticket&&stage==='success'\)next\(\)/);
assert.match(html,/if\(elapsed<8\)\{adaptiveStartWord\(\);return\}/);
assert.doesNotMatch(html,/voiceSet\(\);if\(narration\)talk\(\['y6-v08-next'\]\)/);
console.log('Correct-answer auto-advance and single-clip next-word voice regression checks passed');

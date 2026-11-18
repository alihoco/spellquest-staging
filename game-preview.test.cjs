'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync(__dirname+'/game-preview.html','utf8');
const script=html.split('<script>')[1].split('</script>')[0];
new Function(script);
for(const item of ['The Word Trail','function question()','function check()',
 'function help(guess)','async function celebrate()','function bonusStart()',
 'function bonusEnd()','function groups()','function renderDividers()',
 'if(guess===list[step].word)','Spell the mystery word','spellmaster-next-',
 'prefers-reduced-motion','profile&&SpellmasterChunkUI']){
 assert.ok(html.includes(item),'Missing feature: '+item);
}
assert.ok(!html.includes('value="'+String('necessary')+'"'), 'Word answer must not preload');
console.log('Word Trail gameplay source, script and feature checks passed');

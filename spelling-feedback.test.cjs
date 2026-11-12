'use strict';
const assert=require('node:assert/strict');
const m=require('./spelling-feedback.js');
for(const [word,guess,id] of [
 ['necessary','neccessary','extra_c'],['necessary','necesary','missing_s'],
 ['necessary','nessesary','c_as_s'],['embarrass','embarass','missing_r'],
 ['embarrass','embarras','missing_s'],['accommodate','acommodate','missing_c'],
 ['accommodate','accomodate','missing_m'],['government','goverment','missing_n'],
 ['environment','enviroment','missing_n'],['foreign','foriegn','swapped_i_e'],
 ['rhythm','rythm','missing_h'],['temperature','temprature','missing_e']
]){
 const feedback=m.diagnose(word,guess);
 assert.equal(feedback.id,id,word+' '+guess);
 assert.equal(m.audioClips()[feedback.clip],feedback.text);
 assert.ok(!feedback.text.includes(guess),'Do not read out wrong form');
}
assert.equal(m.diagnose('necessary','necessary'),null);
const uncertain=m.diagnose('necessary','nesesurry');
assert.equal(uncertain.kind,'location_only');
assert.ok(!uncertain.text.includes('phoneme'));
console.log('Spelling-error feedback checks passed');

'use strict';
const assert=require('node:assert/strict');
const E=require('./teaching-engine.cjs');
const word={
 id:'en-GB-necessary',locale:'en-GB',spelling:'necessary',status:'approved',
 audio:{whole_word:{id:'audio-necessary-en-gb',approved:true}},
 teaching:{targets:['double-s'],explanation:{id:'explain-necessary-01',approved:true},
   sound_units:[],orthographic_units:['ne','ces','sa','ry']}
};
const clone=x=>JSON.parse(JSON.stringify(x));
assert.equal(E.STAGES.length,8);
assert.deepEqual(E.checkWord(word),[]);
const blocked=clone(word);blocked.status='draft';
assert.equal(E.learningPlan({word:blocked}).state,'blocked');
const badAudio=clone(word);badAudio.teaching.sound_units=[{verified_label:'ness',audio_id:'auto-tts',source:'synthetic_guess'}];
assert.equal(E.learningPlan({word:badAudio}).state,'blocked');
const wrongParts=clone(word);wrongParts.teaching.orthographic_units=['ne','ces','ry'];
assert.equal(E.learningPlan({word:wrongParts}).state,'blocked');
const plan=E.learningPlan({word,learner:{age:5,presentation:'playful'}});
assert.equal(plan.state,'ready');assert.equal(plan.stages[0].stage,'HEAR');
assert.equal(plan.stages[2].approved_sound_ids.length,0);
assert.equal(plan.stages.at(-1).stage,'REMEMBER');
const tiles=E.gradeAttempt({word,answer:'necessary',mode:'exact_letter_tiles'});
assert.equal(tiles.classification,'assisted_success');assert.equal(tiles.counts_as_mastery,false);
const options=E.gradeAttempt({word,answer:'necessary',mode:'three_choice'});
assert.equal(options.independent,false);
const fullAlpha=E.gradeAttempt({word,answer:'necessary',mode:'full_alphabet_tap'});
assert.equal(fullAlpha.classification,'immediate_unaided');assert.equal(fullAlpha.counts_as_mastery,false);
const delayed=E.gradeAttempt({word,answer:'necessary',mode:'full_alphabet_tap',phase:'delayed_recall',last_teaching_at:'2026-11-01T12:00:00Z',occurred_at:'2026-11-09T12:00:00Z'});
assert.equal(delayed.classification,'retained_unaided');assert.equal(delayed.counts_as_mastery,true);
const preview=E.gradeAttempt({word,answer:'necessary',mode:'physical_keyboard',shown_target_letters:true,phase:'delayed_recall',last_teaching_at:'2026-11-01',occurred_at:'2026-11-09'});
assert.equal(preview.counts_as_mastery,false);
assert.equal(E.chooseSupport({learner:{age:4}}).input,'full_alphabet_tap');
assert.equal(E.chooseSupport({learner:{age:16,input:'exact_letter_tiles'}}).input,'exact_letter_tiles');
assert.equal(E.nextReview({attempt:tiles}).reason,'assisted_not_mastered');
assert.equal(E.evaluateMethodEvidence([]).decision,'no_causal_personalisation');
console.log('SpellQuest core tests passed');

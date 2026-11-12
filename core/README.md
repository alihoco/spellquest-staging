# SpellQuest Teaching Core — v1.0 (headless)

This folder is the *instruction engine*, not a website or game. It implements the versioned research-informed curriculum logic in `research/SPELLQUEST_TEACHING_METHOD_V1.md`, and deliberately rejects unreviewed phonetic guesses. **No intervention has yet been clinically validated.**

## What exists
- `teaching-engine.cjs`: pure JavaScript policy for the eight stages, editorial approval, adaptive scaffolding, independent versus assisted spelling and delayed recall classification.
- `teaching-engine.test.cjs`: regression tests that must pass before every release.
- `../research/WORD_RECORD_SPEC.json`: word record fields and activity contracts (draft specification).
- `../research/ADAPTIVE_TEACHING_EXPERIMENT_PROTOCOL.md`: separate experimental plan; the software does **not** assign learners to experimental groups.

## The eight learning stages
HEAR → DISCOVER → UNDERSTAND → EXPLAIN → BUILD → RECALL → REINFORCE → REMEMBER.

These are teaching stages, **not** mandatory visual screens. Stronger learners can skip unnecessary supports. The UNDERSTAND stage must use only approved sounds and real letter–sound mappings, or an accurate non-phonetic explanation. Without approved sound data, the engine returns no sound unit IDs for playback. A production integration should skip the sound-playing subactivity and not synthesise guesses.

## Sample application
```js
const E = require('./teaching-engine.cjs');
const plan = E.learningPlan({word: approvedWord, learner: learnerSettings, history: learnerHistory});
if (plan.state === 'blocked') {
  // Don't offer the word as a published lesson.
} else {
  // A UI can implement the plan using accessible speech and suitable controls.
}
const attempt = E.gradeAttempt({
  word: approvedWord,
  answer: submittedSpelling,
  mode: 'full_alphabet_tap',
  phase: 'delayed_recall',
  last_teaching_at: previousTeachingDate,
  occurred_at: currentDate
});
```

## Hard rules
1. Word must be editorially approved and carry approved full-word audio, explanation and target patterns.
2. Spoken syllables, phonemes, graphemes, morphemes and printed spelling chunks are **different** data types.
3. Exact-letter tile construction and three-choice spelling recognition are **assisted**, never independently mastered.
4. Full on-screen alphabet can count as independent production if the target letters weren't supplied or hinted.
5. A correct first try after instruction is *immediate unaided*, not proof of long-term retention.
6. Retention requires an independent later attempt. Current `>=1 day` rule is a **software threshold**, not an evidence-validated mastery definition; delayed checks at multiple intervals remain necessary.
7. Age changes presentation and default input, **never** spelling challenge or an intelligence assessment.
8. The system never infers an immutable visual/auditory learner identity.
9. No child is compared with another child and no experimental treatment is automatically assigned.
10. AI narration must be reviewed and safely served. It must not silently fall back to robotic or letter-name audio as if approved.

## Still needed before learner-facing launch
- Specialist phonics/linguistic annotation of a **small validated seed word corpus**; review of actual spoken clips.
- Verified error taxonomy, mapping rules and selection of related transfer words.
- Clear audio-first scripts, accessibility testing and configurable pacing.
- Session and review persistence, data protection/consent, security review, diagnostics and curriculum coverage.
- A real test runner in CI, browser and audio device tests, expert review, usability pilots and delayed learning assessments.
- Ethical/parental permissions and a research protocol before any study or experimentation with learners.

## Testing
`node core/teaching-engine.test.cjs` from repository root, using Node 20+.

**Readiness:** Teaching policy/code *prototype*, not production-ready, and not proof of clinical efficacy. Freeze full gameplay until word validation and audio test gates are passed.


## Audio-first contract (separate from live prototype)
See [../research/SPELLMASTER_VOICE_FIRST_TEACHER_CONTRACT_V1.md](../research/SPELLMASTER_VOICE_FIRST_TEACHER_CONTRACT_V1.md), [voice-tutor-policy.cjs](voice-tutor-policy.cjs) and [voice-tutor-policy.test.cjs](voice-tutor-policy.test.cjs). This guards voice turn-taking and forbids unvalidated automated phoneme grading. The existing staging page is not yet wired to this headless policy; its narration and microphone behaviour have not passed the target child/device acceptance tests.


## Mandatory diagnostic correction loop
See [../research/DIAGNOSTIC_FEEDBACK_LOOP_V1.md](../research/DIAGNOSTIC_FEEDBACK_LOOP_V1.md). Every learning activity must **observe, identify, explain, equip, retry, revisit, adapt**. Give precise reviewed feedback when supported, admit uncertainty where not, and vary approach on repeated errors. Immediate assisted success never substitutes for delayed independent recall. Staging implements some pattern-matched feedback in [../spelling-feedback.js](../spelling-feedback.js), but this is not a universal validated tutor.

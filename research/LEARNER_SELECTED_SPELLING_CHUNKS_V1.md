# Spellmaster learner-selected spelling chunks — research and design v1
Date: 18 November 2026
Status: Proposed optional memory strategy; not demonstrated efficacy and not live in staging.

## Decision
Support learner-controlled **visual letter dividers** on a correctly spelled word, saved to the learner's pseudonymous profile as a *personal mnemonic preference*. This is NOT a learner-authored override of linguistic truth. The teacher's verified phonemes, sound–grapheme correspondences, spoken syllables, and meaningful morphemes remain distinct, unchanged and authoritative. A custom divider should never prompt the teacher to pronounce its segments as standalone speech sounds.

## Research
International Dyslexia Association (IDA) Structured Literacy describes phonemes, graphemes, syllables, spelling patterns and morphemes as distinct aspects of language and teaches them explicitly and cumulatively:
- https://eida.org/structured-literacy-effective-instruction-for-students-with-dyslexia-and-related-reading-difficulties/
- https://dyslexiaida.org/spelling/
- https://or.dyslexiaida.org/wp-content/uploads/sites/20/2018/10/ida-standards2018.pdf
University of Michigan DyslexiaHelp supports syllable knowledge, morphology and accurate sound-to-grapheme mapping, while warning not to confuse sounds and letters:
- https://dyslexiahelp.umich.edu/professionals/dyslexia-and-intervention/spelling/how-should-spelling-be-taught/
- https://dyslexiahelp.umich.edu/professionals/dyslexia-and-intervention/spelling/how-should-spelling-be-taught/more-on-spelling/

**Evidence boundary:** These authorities support the accuracy and use of structured linguistic segmentation, **not** a proven benefit of arbitrary user-divided orthographic chunks. Allowing a learner to choose a visual memorisation grouping is a testable personalisation idea, not a replacement for structured instruction and not an assumption about "visual learning style".

## Example
Correct spelling: `necessary`.
Teacher-reviewed orthographic chunks are separate from phoneme/IPA, syllable, morpheme data.
A learner may select positions after 2, 5 and 7 letters (`ne|ces|sa|ry`) or another segmentation of the SAME correctly spelled word. No letters change order and no split generates new pronunciations. Do not show visually plausible but incorrect spellings.

## Interaction
1. Initially teach the word with accurate complete-word audio and the teacher's verified linguistic explanation.
2. Only if the existing explanation does not help, or learner requests: "Would you like to group the letters your own way?"
3. Show all letters correctly in a large age-appropriate interface with dividers between letters; allow touch/tap, drag and keyboard-accessible equivalents.
4. Give optional short audio description, not text that must be read. No need to narrate "I have hidden the word".
5. Permit 0–4 dividers initially, to discourage over-fragmentation, but test constraints with actual learners. Do not claim four to be an optimal number.
6. Learner chooses "Use my groups" or "Keep teacher's groups"; the teacher should not say their choice is linguistically correct or incorrect if it is merely a memory aid.
7. When next teaching this word, start with their saved groups *as a review option*. Use the formal sound/meaning structure for phoneme or morphology teaching.
8. For genuine **independent retrieval**, display no full target, spelling chunks, divider positions, exact letter tiles or other target-revealing prompts. Record whether hints had previously been displayed.
9. Track whether future unaided retention improves for this individual and word class; allow reset and alternative groups. No static diagnosis or immutable preference.

## Persistence
Save only under a scoped `learner_id` and `word_id`: `grouping_version`, `positions` as integer boundaries, `created_at`, `last_used_at`, `source:'learner_selected_visual'`, `times_used`, `strategy_outcome_summary`. Never overwrite approved `spoken_syllables`, `phonemes`, `graphemes` or `morphemes`. A grouping is discarded or re-reviewed when the word record spelling changes.

## Safety / quality
- Client may suggest grouped spelling, but must **not** infer a phonetic explanation, play invented isolated syllable sounds, or assume all boundaries preserve graphemes.
- If the learner places a divider inside a grapheme or morpheme, it is still a visual cue, but the teacher must never present it as a sound or meaningful part. We may gently point out the distinction when relevant rather than falsely correcting a memory preference.
- Word segmentation routines must reconstruct the original spelling exactly.
- If the word is read aloud, pronounce the *whole word* with approved audio; never concatenate separately synthesised learner chunks.
- For research, use matched words and comparable teaching/retrieval exposure. Compare standard grouping vs learner-chosen visual grouping using delayed unaided spelling and learner comfort. A choice can feel better without necessarily increasing retention; record this distinction.
- Child privacy: user grouping preferences are pseudonymous learning records; only store with lawful basis/guardian controls. In a local staging prototype, browser storage is accessible to other users of the device.

## Release status
This specification and a headless chunking/persistence policy are committed. No student-facing drag UI or production server-side account storage has been released yet. Specialist review is required for formal segmentation.


## Working staging prototype — 18 November 2026

The optional UI is now implemented in the existing Year 6 staging review and short-review steps (`year6.html`, `spelling-chunks-ui.js`). It allows tapping the gaps between letters on touch devices and dragging active divider handles with a desktop pointer, and always reconstructs the exact correct word. The learner can choose the suggested split, save a different split, or skip the feature. A saved custom split is shown automatically in later supported-teaching explanations; the original educator-curated/approved linguistic data is unchanged and **no custom split or hint is shown in the unaided spelling entry**. Custom choices are scoped to the local learner profile and erased with that profile.

The local event log counts the offer, opening, editing, different grouping saved, default kept, later reuse, changes and resets; feedback on the profile page reports the **local** changed-opportunity ratio. A locally saved choice is evidence of preference, not a claim of efficacy. The independent randomised A/B/C study and measurement of active learning time, 7-day/28-day retained accuracy **have not been implemented**, and no child research data are being centrally collected. The updated study and adoption specification is [PERSONAL_WORD_GROUPING_ADOPTION_AND_RETENTION_STUDY_V1.md](PERSONAL_WORD_GROUPING_ADOPTION_AND_RETENTION_STUDY_V1.md). Pending quality review, the feature remains an experimental memory aid, not endorsed phonics teaching.

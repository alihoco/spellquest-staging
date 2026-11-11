# Spellmaster Pilot: First Five Year 5–6 Words

**Created:** 11 November 2026  
**Status:** Editorial word-record drafts complete; **NOT** specialist approved or suitable for phonetic audio publication.

## Word selection
The five draft words are **necessary**, **embarrass**, **accommodate**, **government** and **environment**, all from the England Years 5–6 statutory spelling list.

| Word | Main provisional learning target | Possible follow-on comparison |
|---|---|---|
| necessary | one c and two s letters; reviewed word-specific mnemonic | irregular vowel patterns and doubled s |
| embarrass | double r and double s | harass, aggressive (contrasts require specialist checking) |
| accommodate | double c and double m | accompany, according (not necessarily a single shared rule) |
| government | govern + -ment; keep n | environment, equipment |
| environment | environ + -ment; keep n | government and other verified -ment words |

**Introduce strategically:** Initially teach a focused pattern in closely related examples, then interleave *due* old spellings with new words. Do not assume the table is a mandatory five-word sequential lesson. Assess actual knowledge first.

## Verified provenance vs editorial draft
- Official spelling list: https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/239784/English_Appendix_1_-_Spelling.pdf
- The meaning sources are linked individually in `seed-word-records-y5-6.json`. The simple definitions and example sentences are Spellmaster-authored drafts, **not copied dictionary content** and not yet specialist reviewed.
- Letter groups are currently **orthographic aids only**. They are NOT phonemes and must not be spoken as if they were individual sounds or syllables.
- No generated audio is marked approved; no sound-alignment data has been fabricated.

## Required sign-off sequence
1. A qualified spelling/structured-literacy specialist reviews the word's core instructional target, explanation, misconception patterns, morphology and whether its grouping is misleading.
2. A qualified phonics/linguistic reviewer annotates real speech sounds, syllables, accent/stress variations and grapheme correspondences *only where pedagogically useful*. They must not simply split displayed written chunks into sounds.
3. Review the original learner-friendly definition and context sentence for accuracy, age appropriateness and relevance to spelling.
4. Create the whole-word model, short natural narrator introduction, definition, example sentence, explicit spelling explanation and feedback audio.
5. Listen to all generated audio, including transitions and playback timing, on mobile; require human sign-off.
6. Run an audio-first learner flow: welcome after one gesture, whole word in context, optional repetition without pronunciation judgement, low-pressure independent spell, specific teaching, scaffolded practice, unaided spell, mixed delayed review.
7. Check accessible on-screen alphabet and keyboard options, no required reading of instructions and no shame or false praise.
8. Promote a word to status `approved` **only** after all review fields and audio approvals are populated.
9. Conduct supervised usability testing with a small sample before expansion. Research efficacy requires delayed unaided outcomes and a separate reviewed protocol.

## Automated checks
`node core/seed-word-records-y5-6.test.cjs`

The tests verify five distinct sourced spellings, meaning/example completeness, reconstructed spelling chunks, no phoneme guesses and refusal by the teaching engine to publish unapproved lessons.

## Current state
- **Completed:** curriculum cross-check, initial definitions, example sentence drafts, provisional teaching targets, common mistakes and software safety checks.
- **Not yet completed:** independent expert review, phoneme/grapheme alignment, production-quality audio approval, real-device audio testing or trials of spelling retention.
- **Existing staging website:** remains experimental; it is not yet driven by these five approved records.

The product must not claim its teaching is validated simply because word meanings are dictionary-grounded or the code's quality gates pass.


## Update: researched pronunciation references and audio review route

- The five records now include UK IPA and reference syllable segmentation from the Cambridge Dictionary pronunciation pages; they are **reference annotations**, not approved sound-breakdown teaching. Valid UK pronunciation alternatives have been recorded for `government`.
- Each word has a draft spoken welcome/prompt, meaning, example sentence, targeted explanation and follow-up instruction.
- The headless [lesson-script-compiler.cjs](lesson-script-compiler.cjs) assembles an eight-stage draft lesson and blocks publication while the whole-word recording, teaching explanation and reviewed phoneme units are outstanding.
- [lesson-script-compiler.test.cjs](lesson-script-compiler.test.cjs) has been checked: all five words remain blocked, and their initial and subsequent independent spelling turns hide the answer.
- [Audio review page](https://spellquest-staging.onrender.com/audio-review.html) offers AI-generated narrator previews for the *whole word*, *instruction*, *definition*, *example sentence* and *spelling explanation* only. It is NOT the approved student lesson.
- The temporary TTS model currently used by staging is scheduled for retirement on **6 January 2027**; production voice infrastructure will need migration to a supported Realtime audio integration. See https://developers.openai.com/api/docs/guides/text-to-speech.

### Human sign-off still required
1. Structured-literacy/dyslexia educator: review grapheme and spelling explanations, word choice and error-correction language.
2. Linguist/phonics expert: approve spoken syllables, phonemes and their grapheme mapping where instruction requires these.
3. Voice reviewer: listen to complete generated audio in real browsers; verify UK accent, pacing, naturalness and consistency.
4. Parent/child usability pilot: test the actual narrator-led interaction and comfort, then delayed spelling recall. This must not be called efficacy evidence from one child.

The curriculum remains **not approved for child-facing structured phoneme lessons**.

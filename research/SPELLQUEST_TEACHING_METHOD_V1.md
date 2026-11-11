# SpellQuest Teaching Method v1.0 — The Eight-Stage Learning Cycle

**Status:** Research-informed instructional specification, pending specialist review and learner testing  
**Date:** 11 November 2026  
**Audience:** Learners aged 4–16 and adults; UK English initially  
**Primary outcome:** Delayed, independent spelling accuracy and transferable spelling knowledge; never game completion alone

## Foundation

SpellQuest is an audio-accessible, age-respectful spelling tutoring system grounded in explicit, systematic, cumulative Structured Literacy. The eight phases are a **curricular logic**, not eight mandatory screens or identical activity durations. Use the fewest stages necessary while ensuring the learner understands the spelling structure and can ultimately retrieve the word independently.

- **Evidence-backed components:** phoneme awareness tied to graphemes, orthographic conventions, syllables/stress patterns, morphemes, explicit modelling, scaffolded practice, corrective feedback, cumulative review and diagnostic adjustment.
- **Design hypotheses needing product validation:** audio-first narration as a preferred interface, specific tile/recognition sequences, optimal timing, game rewards and pacing, automated phoneme audio, and particular review scheduling.
- **No fixed learning styles:** preference, observed response and learning outcome inform activity choices.
- **Age affects presentation and usable input, never default spelling difficulty.**

## The Eight-Stage SpellQuest Learning Cycle

### 1. HEAR — Establish the spoken target
- Clearly play the *whole word* in a natural UK English accent, ideally within a short meaningful sentence if ambiguity is possible.
- Use a single user-initiated start action to unlock subsequent automatically guided narration. Offer visible replay, captions, pace and silence controls.
- Asking a learner to repeat aloud may help engagement and phonological attention, but never require recording or speech-recognition grading to continue.
- Never expose the spelling during a first independent attempt. Ensure homophones and multiple meanings have suitable sentence-level context.

### 2. DISCOVER — Probe independent prior knowledge
- If the learner can use an accessible response mode, invite an **unaided** spelling attempt from audio.
- Record original attempt, error type and assistance level; do not present an unpleasant or shaming exam experience.
- For very new learners, a low-pressure diagnostic on speech sounds and sound-to-grapheme mapping can replace the initial whole-word attempt.
- First attempts are diagnostic; avoid treating errors as failure.

### 3. UNDERSTAND — Analyze real sounds and syllables
- Teacher/linguist-verified phonemes, syllables and stress are **distinct** from arbitrary written 'chunks'.
- When useful, model the whole word, then genuine spoken units, with visually meaningful support and enough time to repeat.
- Connect the relevant phonemes to the graphemes that represent them; **never infer phonemes from letter sequences with unreviewed AI-generated audio**.
- If sound–grapheme explanation would mislead for this word, teach its verified orthographic or morphological structure instead.
- Use precise sound-boxes or grapheme highlighting only where annotated correspondences are validated.

### 4. EXPLAIN — Teach why the spelling works
- Choose and explicitly teach the dominant *spelling obstacle*: grapheme choice, vowel pattern, silent letter, consonant doubling, suffixing convention, real morpheme, syllable/stress pattern, etymological relationship, or irregular element.
- Show **real morphemes** as meaningful components. Do not treat spelling mnemonics as linguistically valid segmentation.
- Memory tricks are supplementary, optional and reviewed for correctness and developmental suitability.
- Narrate brief targeted explanations, anchored to the specific error.

### 5. BUILD — Supported encoding practice
- Select assistance based on need and interface usability: phoneme/grapheme tiles, exact-letter-bank sequencing, relevant pattern choices, three-option orthographic discrimination, tracing or other accessible motor response.
- Each mode states its **help level**, and all supplied-target-letter or recognition successes are *assisted practice*, never proof of independent mastery.
- For a child with motor/keyboard difficulties, tap-to-place and large controls are available; older learners can use the same tool with mature visuals.
- Avoid repetitive busywork or unnecessary screen transitions.

### 6. RECALL — Unaided spelling production
- Hide all helpful spelling-specific letters and word choices; replay the whole word and sentence as often as needed.
- Permit a physical keyboard, full on-screen alphabet, or equally valid accessible production modality. **A full alphabet is not a reveal of the target letters.**
- Capture the first independent response after teaching separately from earlier diagnostic and supported attempts.
- Never require a child's spoken pronunciation to be automatically judged to allow spelling.

### 7. REINFORCE — Feedback and transfer
- Show what was correct before identifying the precise error and the linked rule or pattern.
- If incorrect, loop to the **smallest necessary teaching step**, not always to the beginning.
- Practise related exemplars and, where appropriate, an untaught word to assess pattern transfer.
- Praise specific learner actions and genuine changes; no competition or leaderboard.

### 8. REMEMBER — Retained mastery
- Schedule brief, independent, delayed checks (e.g., several days and weeks later). The precise intervals remain to be experimentally tuned.
- Distinguish: **recognised**, **assembled with supplied letters**, **independently produced immediately**, **retained unaided after delay**, **transferred to an untaught word**.
- Reintroduce explanations only when needed, not based solely on time or age.
- Progress summaries compare the learner only to their previous performance.

## Adaptive teaching logic

Inputs: current word/pattern, phoneme–grapheme and morphology knowledge, previous error history, delayed recall, accessibility needs, preferred input, engagement/frustration indicators, learner-chosen theme and birth month/year.

Rules:
1. **Presentation** follows age and learner-chosen style; does not determine ability.
2. **Input** follows accessibility and preference; never equates tile preference with low intelligence or poor spelling.
3. **Pedagogy** follows diagnosed error type and observed retained spelling.
4. New phonics/orthographic concept: HEAR → explicit UNDERSTAND/EXPLAIN → BUILD → RECALL → delayed REMEMBER. DISCOVER may be a brief diagnostic.
5. Already-known item: HEAR → RECALL → REMEMBER, avoiding unnecessary instruction.
6. After a wrong spelling: choose targeted teaching (e.g., double letters vs suffix, not arbitrary letter chunks), then RECALL.
7. After assisted success: lower assistance before awarding independent-mastery status.
8. After immediate independent success: check delayed retention before durable-mastery status.
9. If pronunciation cues are unreviewed, **do not play them**. Use verified full-word pronunciation and reviewed pattern explanations instead.
10. Minimise spoken introductions, but avoid startling fast transitions: explicit prompts before new activity types, brief configurable post-audio thinking pauses and replay.

## Age and accessibility defaults (hypotheses, user-overridable)

| Age suggestion | Interface default | Mastery-compatible production |
|---|---|---|
| 4–6 | Spoken instructions, large tap-to-place grapheme/letter tiles, minimal reading, short activities | Full alphabet on-screen or other validated unaided input |
| 7–9 | Tile building with gradual transition to on-screen full alphabet | Full alphabet/keyboard selected by learner |
| 10–12 | Choice of on-screen alphabet, physical keyboard and support tiles | Unaided alphabet/keyboard |
| 13–16 | Age-respectful, mature UI, default unobtrusive full alphabet/keyboard | Unaided alphabet/keyboard |
| Adults | Modern practical interface, accessibility choices preserved | Unaided spelling in chosen accessible production mode |

These age boundaries are **design defaults, not normative research cut-offs**.

## Word categories determine which teaching elements dominate

1. Simple consistent phoneme–grapheme patterns: phoneme segmentation and grapheme mapping.
2. Complex graphemes (sh, igh, ai, etc.): teach graphemes explicitly rather than sounding out letter names.
3. Orthographic conventions: e.g., consonant doubling or suffix rules with contrastive examples.
4. Morphology-rich words: genuine bases, suffixes/prefixes, meaning and family transfer.
5. Less predictable spellings: verified pronunciation, explain predictable and unpredictable pieces, supplement with reviewed mnemonic; never invent a false rule.
6. Homophones: sentence and meaning context, morphology where relevant.
7. Advanced multisyllabic words: validated syllable/stress patterns, morphology, conventions and independent dictation.

## Data recorded per attempt

`learner_id_pseudonymous`, `word_id`, `pattern_id`, `timestamp`, `activity_mode`, `assistance_level`, `first_attempt`, `spelling_response`, `error_class`, `response_correct`, `time_to_complete_optional`, `audio_replays`, `teaching_stage`, `delayed_interval`, `retained_unaided`, `transfer_result`.

Store only necessary child data, protect by guardian/school permissions, and do not retain raw speech recordings in the baseline product.

## Release gates (must pass before publishing a word/lesson)

- Published spelling and regional variant validated against reliable reference.
- Whole-word narration and any segmented sound audio approved by a trained reviewer.
- Phonemes, spoken syllables, graphemes, orthographic spelling parts and morphemes stored **separately**.
- Explanation and mnemonic accurate and not misleading.
- Accessible path through lesson without having to read instructions.
- No robotic/browser fallback silently switching narrator on success.
- At least one supported practice mode plus an unaided-accessible production mode.
- Assistance is tracked and mastery cannot be awarded from choices or exact tiles.
- Delayed retrieval scheduled; genuine independent learning outcomes measured.
- Age-appropriate presentation independent of ability, and no peer ranking.

## Practical testing plan

Pilot with a small, specialist-reviewed word set spanning the seven categories. Conduct expert review of linguistic segmentation and teaching scripts first, then observed usability sessions with varied ages and dyslexic learners. Compare teaching variants with common immediate and delayed independent spelling tests; track transfer, errors, drop-off, time and confidence. Pre-register which outcomes count as success. Do not claim clinical efficacy from a small pilot.

## Evidence anchors

- International Dyslexia Association, *Structured Literacy: Effective Instruction for Students with Dyslexia and Related Reading Difficulties*: https://dyslexiaida.org/structured-literacy-effective-instruction-for-students-with-dyslexia-and-related-reading-difficulties/
- International Dyslexia Association, *Spelling*: https://dyslexiaida.org/spelling/
- International Dyslexia Association, *Structured Literacy: An Approach Grounded in the Science of Reading*: https://dyslexiaida.org/wp-content/uploads/2023/10/Structured-Literacy-Grounded-in-the-Science-of-Reading-SOR-V18.pdf
- Petersen-Brown & Kromminga (2024), systematic review/meta-analysis of 81 spelling instruction studies: https://doi.org/10.1002/pits.23223
- Morphology meta-analysis (2024): https://link.springer.com/article/10.1007/s10648-024-09953-3
- Research and product synthesis: `TEACHING_KNOWLEDGE_BASE.md`, `EVIDENCE_REGISTER.csv`, `COMPETITOR_MORPHS_SPELLING_INFO.md`

**Evidence status:** A coherent research-informed instructional architecture; exact UI timing, speech technology, adaptive decision policies, optimal task mix and outcome magnitude are not yet experimentally validated for SpellQuest.

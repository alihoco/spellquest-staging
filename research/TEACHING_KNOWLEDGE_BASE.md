# SpellQuest research knowledge base — v1.0
**Created:** 11 November 2026  
**Scope:** English spelling instruction for learners with dyslexia/spelling difficulties, ages 4 to adult, initially British English.  
**Status:** Research-backed design specification; **not** a clinically validated programme. Expert review and outcomes testing required before claiming effectiveness.

## The foundational conclusion
Spelling is **encoding language**, not simply remembering the visual shape of a word. Effective teaching therefore brings together (a) awareness of the *spoken sounds* in words, (b) the letters and letter groups that represent those sounds, (c) syllables and spelling conventions, (d) meaningful word parts, including roots and affixes, (e) explicit attention to irregular spellings, and (f) repeated independent retrieval with corrective feedback. No single mnemonic, sensory preference, activity or game feature replaces this structure.

This conclusion is strongest when based on controlled spelling-intervention research and complemented by structured-literacy professional guidance. Specific claims about the *ideal game mechanics*, *ideal duration*, *voice-led instruction*, or *AI-generated syllable clips* are **design hypotheses requiring testing**, not established scientific facts.

## 1. Evidence hierarchy

| Status | Meaning | SpellQuest action |
|---|---|---|
| A: replicated / systematic-review support | Supported across a coherent collection of studies, noting heterogeneity | Include in core teaching system |
| B: converging research and professional guidance | Plausible, commonly recommended, but exact parameters unresolved | Implement conservatively and measure |
| C: preliminary or indirect | Extrapolated from another population, language or outcome | Pilot and test; do not claim proven |
| D: unsupported, contradictory, or unvalidated | Marketing assertions, fixed learning-style types, unreviewed AI phonetics | Do not make a core pedagogical rule |

We distinguish outcomes for **taught words**, **untaught transfer words**, and **delayed retention**. These are not interchangeable. Study effects should never be presented as a promise for any individual child.

## 2. The highest-priority research findings

**Explicit, systematic, cumulative spelling instruction (A/B).** The 2020 dyslexia-focused meta-analysis of 34 controlled trials found beneficial effects from phonics, orthographic-rule and morphological instruction; a clear benefit of memorisation-only strategies was not established. IDA's structured-literacy guidance calls for explicit sound-symbol and pattern instruction, cumulative progression, guided practice and immediate feedback. Teaching a word as only a sequence of letters or a visual picture is inadequate. Sources R01, R04, R05.

**Spelling instruction works but gains and generalisation are modest (A).** A 2024 meta-analysis of 81 studies found average positive spelling effects (group-design Hedges' g ~0.32). A 2025 online / 2026 print review of 59 studies found group-design spelling g ~0.33, word-reading g ~0.25; subgroup analyses suggested benefits from whole-word and multilinguistic approaches, but cannot prove which is best head-to-head. Taught words generally benefit more than untaught words. Sources R02, R03.

**Sounds matter, but writing English needs more than sounds (A/B).** Learners should understand phonemes and link them with appropriate graphemes. English contains competing spellings for the same sound and variable pronunciations of letter patterns. Especially in older or irregular words, morphology, conventions and specific word memory matter. England's spelling curriculum explicitly notes that spelling sound-to-letter correspondences are more variable than reading letter-to-sound correspondences. Sources R04, R05, R06, R07.

**Meaningful word parts (morphology) improve learning (A/B).** A 2024 preregistered meta-analysis of 28 studies supports morphology instruction, particularly for taught words; transfer evidence is less secure. Teach actual roots/base words, prefixes, suffixes and word families when accurate, not invented ones. Source R08.

**Independent retrieval with immediate feedback helps (B).** A study with fifth-grade children found better spelling retention at four days after retrieval rather than copying *when immediate corrective feedback was given*. Do not substitute repeated copying or repetitive guessing for explain–retrieve–correct–review. Population/language differ from UK dyslexic learners. Source R09.

**Adaptivity and games can support learning, but entertainment is not pedagogy (B/C).** A German randomised trial (65 children, second/third grade) found benefits from an adaptive spelling game that taught phonology, sound–symbol links, spelling rules and morphology, with immediate feedback. This does not prove any arbitrary English game or AI lesson works. Source R10.

**Avoid fixed visual/auditory/kinaesthetic learner identities (A for absence of supporting evidence).** EEF warns that fixed learning-style matching lacks evidence and may harm learning. Assess current skills, barriers, responses and long-term retention instead. Source R11.

**Multisensory presentation is an accessibility option, not an automatic evidence of superiority.** Let children hear, see and manipulate spelling representations; do not require all senses for every word or claim that sensory labels diagnose ability. Orton–Gillingham branded approaches have insufficient rigorous evidence for a special advantage over other explicit instruction. Sources R04, R12.

## 3. Precisely distinguish four linguistic layers

1. **Whole-word pronunciation:** Audio recording of the word in natural British English, including stress. This is necessary to know which word is intended; it is not proof the learner pronounced it correctly.
2. **Spoken syllables:** Oral rhythm/beat units, e.g. necessary generally has four syllables in careful UK pronunciation. A syllable is not the same as a grapheme or morpheme.
3. **Phonemes and graphemes:** Individual speech sounds and their corresponding written letters/groups. One phoneme may be spelled with multiple letters (e.g. /ʃ/ → `sh`), and a letter group may have different sounds in different words. Cues must be reviewed by a phonics expert.
4. **Orthographic and morphological chunks:** Letter sequences useful for spelling memory (e.g. `govern` + `ment`). These are not necessarily pronounced as standalone sounds. Explain them as *spelling chunks*, never pretend they are phonemes.

**Hard rule:** No automatic text-to-speech pronunciation of `ne`, `ces`, `sa`, `ry` or invented phonetic snippets can be treated as validated audio. Natural-language TTS can read letter names, incorrect vowels or the wrong stress. **Until manually recorded or reviewed, use only full-word audio and proven spelling-pattern explanations.** Letter names remain useful for identifying an irregular letter sequence *after* sound awareness.

## 4. Research-grounded lesson flow — proposed default

The following is a **proposed design**, not a uniquely proven 7-step protocol. Users' feedback should inform usability; instructional outcomes must determine pedagogical success.

**Step 0: One-tap welcome / audio consent**
- Welcome is spoken once after a user gesture (autoplay restrictions). Briefly explain what will happen. Narration is ON by default and replay is always available.
- Read every essential instruction aloud, with large clear visual and text equivalents. Screen-reader semantics remain intact.

**Step 1: Meaning and full-word listening**
- Say the word clearly in natural British English and place it in a short spoken sentence to disambiguate homophones/meaning where relevant.
- Invite repetition but NEVER gate advancement on speech recognition. Pronunciation validation is not a reliable proxy for spelling knowledge.

**Step 2: Initial independent attempt**
- Hide spelling; child types or chooses letter/grapheme tiles. Accept a complete first attempt, preserving all errors for analysis. Don't penalise spelling speed.
- Never reveal the correct spelling before this attempt if it is meant as a baseline.

**Step 3: Diagnostic feedback**
- Compare attempt against target. Distinguish omissions, transpositions, substitutions, double letters, suffixes, unrepresented phonemes, morphological changes and irregular letters.
- Be careful: a spelling error alone may not identify why it occurred. State what changed, then propose a teachable strategy rather than diagnosing a phonological deficit.

**Step 4: Explicit teaching**
- Choose the *linguistic* explanation appropriate to the error and word: sound↔spelling mapping, syllable segmentation, orthographic convention, morphological family, or a word-specific irregular element.
- If a verified syllable recording exists, play it alongside matching syllable highlights; never fake sound correspondence by colouring unrelated spelling chunks.
- If the only approved audio is whole-word audio, play it and highlight *written* patterns without describing them as sounds.
- Mnemonics can supplement but must never substitute for accurate underlying explanation.

**Step 5: Supported practice, then hidden recall**
- Build from graphemes, choose between plausible letter patterns, write/keyboard from memory. Give specific immediate corrective feedback. Repeat the individual weak part only as appropriate.
- Allow child to replay sound, pause or skip. No public score, timer or forced voice recording.

**Step 6: Delayed retrieval**
- Revisit the word after a delay. Treat 1, 3, 7, 14 days as **an initial software heuristic**, NOT a scientifically optimised dyslexia schedule. Adjust using independent recall after delays, not immediate assisted success.
- Mix practiced words with untaught words that test transfer of the same convention or morphology.

**Step 7: Reflect personal growth**
- Present own-history improvements in accuracy, retention, transfer and independence. No leaderboard, age-matched comparison or shaming.

## 5. Adaptive placement / discovery

The opening adventure should collect performance evidence, not label the child a fixed 'visual learner'. Probe multiple areas separately: oral syllable awareness; phoneme identification/manipulation if age and vocabulary appropriate; sound-to-grapheme mapping; common spelling patterns; orthographic constraints; meaningful morphemes; word-specific recall and delayed retention. Try multiple strategies and measure which improves *later independent accuracy*, not just immediate engagement. Age chooses theme and tone only — never placement or intelligence.

Practical example: a 14-year-old learning short-vowel patterns receives age-appropriate visuals and dialogue, not preschool presentation.

## 6. Word knowledge record — what every taught word requires

- Exact spelling, British/American variant, meaning and example sentence
- Curriculum/skill stage and **reason** for teaching
- Natural UK full-word pronunciation audio, pronunciation transcription if expertly reviewed, word stress
- **Separate** reviewed spoken syllable units, phoneme sequence, grapheme mappings, orthographic spelling chunks and morphemes
- Teaching rule(s), exceptions, irregular letter locations, evidence-based alternative spellings, common errors
- Approved mnemonic (optional), with accuracy/age suitability check
- Audio narration for every learner-facing step (human reviewed)
- Feedback rules keyed to *error classes*, not a generic 'wrong'
- Taught related words and untaught transfer test words
- Date/source/expert reviewer, review status, confidence score, locale and speech clip version
- Accessibility requirements and age-appropriate delivery

**Release gate:** Word cannot be marked `approved` until the phonological, graphemic, morphological and audio annotations that it uses are reviewed. If a field is not reviewed, the app must omit that exercise rather than generate an unverified claim.

## 7. Product and accessibility requirements

**Voice-first** means that hearing spoken guidance never depends on reading the screen. It does NOT mean reading should never appear; clear print beside audio is a central way to teach the written system. Spoken text and on-screen text must agree. Do not make speech recognition a gate to progress. A real narrator should guide the learner by default after the initial Start click; keep audio clips preloaded / cached, with brief predictable gaps, adjustable pace, play/pause and replay. Never interrupt the child while typing. If audio fails, the interface provides a clear retry and visual fallback, not silent failure.

Avoid over-stimulating graphics, confusing colourful backgrounds, unnecessary timers and rewards for clicking. Adjustable contrast, size, spacing, font, reduced-motion, and narration preferences should be available. Avoid implying that a special font cures dyslexia; no particular font is established as a universal intervention.

For ages 4–16: minimal child data, guardian controls where applicable, no peer sharing by default, no public microphone recording. A local sound activity detector only detects speech activity, not correct phonemes; whole-word recognition from a browser may transmit audio to external services. Both require clear consent and accessible alternatives.

## 8. Pre-release research / content quality gates

1. **Evidence gate:** Each method maps to cited primary research, synthesis or reputable professional guidance, with confidence and limitations.
2. **Linguistics gate:** Expert reviews IPA/stress, syllables, phonemes, phoneme–grapheme correspondences, morphology, and irregular mappings for locale.
3. **Audio gate:** Human listens to every word/syllable/sound clip; TTS output is not assumed correct from prompt text.
4. **Learning gate:** Lesson gives explicit instruction and active, independent spelling practice, not just recognition or repetition.
5. **Usability gate:** Child can complete entire flow without adult reading; slow/fast pace, replay, screen reader, motor and hearing access work.
6. **Measurement gate:** Record baseline, assisted practice, delayed independent recall, related untaught-word transfer and retention separately.
7. **Clinical/educational review:** Dyslexia-specialist educators approve curriculum and claims; pilot with diverse learners and evaluate controlled pre/post and delayed outcomes.

## 9. Research and validation roadmap

**Phase A — educator review:** Consult qualified specialist dyslexia teachers and speech-language/phonics expertise, especially for UK phonemic segmentation and pronunciation. Select two or three verified instructional sequences for comparison.

**Phase B — a deliberately small word set:** Annotate 20–30 representative words across phonically straightforward, rule-based, morphological and irregular types; get natural British recordings, approved segmentation, and response-specific feedback.

**Phase C — accessibility/user testing:** Co-design with children aged 4–6, 7–9, 10–12, 13–16 and adults. Evaluate instruction comprehension, fatigue, audio clarity and age-respect; include children using screen readers and those with ADHD or motor difficulties.

**Phase D — learning experiment:** For each learner measure pretest, immediate post-test and delayed 1–2 week spell-from-dictation; include transfer words. Compare against an appropriate active alternative. Obtain parental informed consent and assent; preserve anonymity where possible.

**Phase E — release:** Only after sufficient favourable data, expand into the full England statutory curriculum and then US English and additional languages with locale-specific expert review.

## 10. Common teaching errors the engine must block

- Conflating syllable, phoneme, letter, grapheme, and morpheme
- Asking the child to say *letter names* when the activity claims to teach sounds
- Assuming that 'ne–ces–sa–ry' is a spoken pronunciation guide
- Treating a TTS model's phonetic guess as a linguistically correct sound recording
- Using mnemonics as a substitute for teaching the spelling's structure
- Requiring repetition aloud or automatic voice recognition before a learner can proceed
- Calling a word mastered because it was typed correctly while visible
- Comparing children to classmates, norms or school years in the learner view
- Inferring 'visual learner' or 'auditory learner' profiles
- Claiming that one app, font or approach is proven best for every dyslexic child

## 11. Sources and interpretation

See `evidence_register.csv` for title, source, population, outcomes, limits, and linked URLs. Source IDs used above:

R01 Galuschka et al. (2020), dyslexia-focused spelling meta-analysis; R02 Petersen-Brown & Kromminga (2024), broad spelling meta-analysis; R03 Chandler et al. (2025 online / 2026 print), LD spelling meta-analysis; R04 IDA structured literacy; R05 IDA spelling guidance; R06 England national curriculum; R07 BDA spelling; R08 morphological instruction meta-analysis (2024); R09 retrieval practice study (2023); R10 German spelling-game RCT (2024); R11 EEF learning styles; R12 ASHA Orton-Gillingham evidence summary.

### Claims that are NOT validated by the sources

- That audio-first websites produce greater spelling gains than a properly delivered multimodal alternative
- That singing/chunking a word with AI produces phonologically accurate segments
- That live speech recognition can assess phoneme pronunciation correctly in dyslexic children
- That a particular game theme or 10-minute session length is optimal for learning
- That fixed review delays (1/3/7/14 days) outperform adaptive alternatives in dyslexic populations

*This document is a research-informed product specification, not a recommendation to replace personalised teaching, classroom instruction or clinical assessment.*

---

## 12. Supported spelling response modes: letter tiles and recognition choices (11 November 2026)

### Research question
Do two lower-motor-demand response formats — (A) arranging a supplied pool of exactly the correct letters in order and (B) selecting the correctly spelled word among three alternatives — improve *independent, delayed spelling ability*, or do they mainly improve success during an assisted game?

### Evidence-backed basis
- The International Dyslexia Association's *Spelling* guidance explicitly identifies **building words with letter tiles** as one useful activity among tracing, saying, copying and writing; this supports using tiles as a teaching modality, **not** a claim that a supplied exact-letter bank is superior to unaided spelling.
  https://dyslexiaida.org/spelling/
- Galuschka et al. (2020) meta-analysis of 34 controlled trials supports explicit phonics, orthographic rules and morphology; neither exact-letter tile selection nor three-choice recognition was isolated as the proven best response method.
  https://doi.org/10.1080/00461520.2019.1659794
- Veiga da Silva et al. (2023), three experiments with Brazilian fifth graders, found that spelling retrieval followed by **immediate corrective feedback** improved accuracy after four days relative to copying in one experiment. This supports including delayed *production* measures; it does not demonstrate that keyboard input is necessary.
  https://pubmed.ncbi.nlm.nih.gov/37605436/
- Smith & Karpicke (2014) found nuanced results in four retrieval-practice experiments comparing short-answer and multiple-choice formats for text learning, not dyslexic spelling. There is **no general law** that multiple-choice never supports learning or that free recall always wins.
  https://pubmed.ncbi.nlm.nih.gov/24059563/
- Petersen-Brown & Kromminga (2024) caution that evidence on individualising spelling instruction is limited and gains often concentrate on taught words.
  https://doi.org/10.1002/pits.23223
- A study of children with isolated spelling difficulties reported weaker delayed retention despite intact initial learning, which reinforces assessing **later recall**, not only today's tiles/choices.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC6343368/

### Proposed activity A — *Build the spelling from supplied letters*
**Role:** optional, supported **encoding and sequencing** practice after explicit sound-to-grapheme/pattern teaching; accessible alternative when typing is a motor or keyboard-navigation barrier.

**Configuration:** display precisely the letters needed, including duplicates, in random order; child taps/drag-and-drops to construct the word. Provide audio for whole word, optional replay for verified syllables, and corrective feedback focused on a relevant pattern. Do not call this an independent-spelling assessment because the bank reveals the spelling's letter identities and length. Sequence of letters can still be educationally demanding, especially with repeats or confusable letters. Some learners will benefit from **grapheme tiles** (e.g., sh, igh) rather than single letters when teaching correspondences; these are different tasks and should be tagged separately. Avoid demanding drag gestures: tap-to-place, undo, large targets and keyboard access.

**Scaffold ladder** (not a rigid progression):
1. Fully modelled sound–spelling mapping.
2. Given relevant grapheme tiles, build a word.
3. Given all correct letter tiles, sequence the spelling.
4. Reduce cues: add carefully chosen distractors or provide a complete on-screen letter keyboard without revealing only the needed letters.
5. Recover spelling from audio with no supplied letter list using accessible on-screen keyboard or physical keyboard, at the learner's choice.
6. Check delayed unaided spelling on a later date.

**Critical caveat:** distinguish "all correct tiles present" from "all needed tiles plus distractors". They measure different knowledge.

### Proposed activity B — *Choose the correct spelling from three*
**Role:** optional **orthographic discrimination**, formative check and error-spotting exercise, not proof of autonomous spelling.

**Configuration:** speak the target word and provide one correct form and two plausible errors drawn from the **specific pattern being taught** (e.g., single/double consonants). Randomise positions. Explain why the correct letter pattern works and correct the misconception after the response; minimise unnecessary repeated exposure to incorrect forms, and never use random nonsensical distractors. Avoid inferring mastery because of guessing: with three options, chance success is 1/3 even with no spelling knowledge.

**Use:** especially after a learner has compared a correct form with a common misspelling; sometimes as a low-demand entry task. Do not replace an unaided production check with this response.

### Game success vs learning success
Keep outcome fields separate:
- **Assisted success:** recognition / sequencing / clue use / completion.
- **Independent production:** spell word from audio with *no preview of the needed letters*, either physical keyboard, full alphabet on-screen keyboard, or other accessibility-compatible input.
- **Retained mastery:** independent production on a later day (e.g. 4 or 7+ days), with no preview.
- **Transfer:** accurately spell untaught words sharing the target pattern.
- **Usability and confidence:** task completion, perceived anxiety, optional assistance needed, time engaged and errors due to motor/input difficulty.

**Never count an exact-letter-bank or three-choice success as mastery of an independently spelled word.** The interface should not shame children who choose assistance.

### Evidence status and planned evaluation
- Letter tiles as a component of structured instruction: supported by authoritative practical guidance, but their comparative effectiveness as an interface is **unproven** here.
- Three-choice selection: plausibly useful for orthographic discrimination; direct evidence of superior delayed dyslexic spelling outcomes is **insufficient**.
- No high-confidence head-to-head controlled trial was identified in this review showing that either mode outperforms handwriting, on-screen alphabet input or free typing for learners with dyslexia.
- Treat interface preferences (typing, taps, drag, recognition) as accessibility choices, **not fixed learning-style classifications**.

**A/B pilot:** Within learner, counterbalance equivalent word sets across (A) exact-letter sequencing, (B) three-option recognition, (C) keyboard-free *full alphabet* on-screen production, and (D) typed independent production (where comfortable). Keep teaching content, feedback, exposure time and difficulty comparable. Measure immediate unaided production separately, then delayed unaided spelling after 4–7 days and again at 3–4 weeks, plus transfer to untaught words. Pre-register a primary outcome of delayed unaided accuracy and track completion time, fatigue and engagement as secondary. Specialist reviewers must validate patterns, distractors and the spelling test.

### Product decision
**Include both proposed modes as optional learning supports**, not as replacements for the unaided spelling check. Design a full-alphabet tap keyboard so learners can independently spell without the motor/keyboard-layout barrier. Run comparative research before claiming one mode teaches spelling better.


## 13. Age-responsive interaction design, independent of spelling attainment (11 November 2026)

**Core distinction:** age and motor/interface familiarity can influence *how* a learner responds, but birth month/year must never determine the spelling difficulty, diagnose dyslexia, or override the adaptive skills assessment. The learner should always be able to change interaction mode.

### Suggested defaults to test, not fixed developmental rules

| Approximate age | Initial interface suggestion | Accessible alternatives |
|---|---|---|
| 4–6 | Large, generously spaced letter/grapheme tiles; short spoken prompts; tap-to-place and one-tap undo | Whole alphabet on-screen, adult-supported interaction, optional physical keyboard |
| 7–9 | Tile construction plus optional on-screen alphabet; gradual introduction of independent production | Three-choice error discrimination, keyboard, supportive cues |
| 10–12 | Choice of tiles, on-screen alphabet or keyboard; age-respectful visuals and language | Minimal/maximum scaffolding as needed, not tied to school year |
| 13–16 | Modern interface and discreet keyboard/on-screen-alphabet defaults | Tiles and recognition remain available without childish presentation |
| Adults | Practical, uncluttered response modes chosen by learner | Same evidence-informed supports as all age groups |

### Design and accessibility rules

- Never equate younger age with lower spelling knowledge, or older age with better typing skills.
- Use *ability to operate a control* and explicit preferences to select interaction mode; allow rapid mode switching.
- Younger learners may struggle with physical keyboard location and fine-motor coordination; minimise extraneous demands with large tap targets and optional tap-to-place instead of drag-and-drop.
- Give instructions aloud by default after a user start gesture, with an accessible narration toggle, replay, captions/text, and no forced pronunciation grading.
- Distinguish **assisted exact-letter selection** from **unaided spelling with a complete alphabet**. Even if both use tapping, only the latter can contribute to independent spelling evidence.
- At mastery-check time, use the least revealing response mode that the individual can operate comfortably: keyboard, full on-screen alphabet, handwriting captured by a trained adult, or an equivalent validated modality.
- Do not punish slower motor responses, and do not automatically award mastery for a task with all necessary letters displayed.
- Preserve age-respectful visual design when someone chooses easier input controls.

### What is supported versus what needs testing

These are accessibility-driven design hypotheses, not research-verified age cutoffs. There is no established basis here for claiming that tile ordering is generally superior for every 4–6-year-old or that keyboard typing is better for teenagers. Pilot age-responsive defaults and allow learners to override them; evaluate actual spelling acquisition and delayed retention alongside ease of use, motor load and frustration.

### Data model implication

Store the response mode separately from spelling skill and from the amount of assistance. An older learner using tap tiles must not be assigned a younger visual theme, and a younger learner who spells independently with a full alphabet should receive full credit.


## 14. Comparative system review — Morphs (spelling.info), 11 November 2026

A public-source evaluation of Grammarsaurus's Morphs spelling game has been added at [COMPETITOR_MORPHS_SPELLING_INFO.md](COMPETITOR_MORPHS_SPELLING_INFO.md). Morphs is structured around explicit teaching of genuine morphemes, followed by game application in an immersive adventure world. Its teacher-facing spelling heatmap helps identify gaps. This is a particularly useful reference for designing transferable word-family and morphology lessons rather than teaching isolated spellings.

**Research caution:** published product descriptions and screenshots establish intended functionality, not controlled evidence of the software's efficacy for dyslexic learners. The student login itself was not inspected in an authenticated session. Stronger aspects to investigate include explicit morpheme progression and targeted diagnosis; SpellQuest's differentiators should be verified phonological/orthographic teaching, audio-first guidance, learner-age-respectful accessibility and delayed independent recall, not copying the game's artwork, characters, world or proprietary lessons.


## 15. Core teaching method — SpellQuest Learning Cycle v1.0

The product-wide, eight-stage research-informed lesson sequence and adaptive rules are now specified in [SPELLQUEST_TEACHING_METHOD_V1.md](SPELLQUEST_TEACHING_METHOD_V1.md). This is the normative product teaching specification for future design, curriculum and implementation decisions, **pending expert linguistic review and efficacy testing**. It separates the required pedagogic mechanisms from optional interaction screens, and does not treat assisted recognition or supplied-letter building as independent spelling mastery.


## 16. Davis methods and Richard Whitehead — research comparison (11 November 2026)

The review [DAVIS_WHITEHEAD_METHODS_REVIEW.md](DAVIS_WHITEHEAD_METHODS_REVIEW.md) compares Davis visual/experiential approaches, Richard Whitehead's work and the evidence for Structured Literacy. Evidence includes a small Davis-based controlled spelling study (van Staden et al., 2009) but does not support universal claims about visual learning style, disorientation or eliminating systematic retrieval practice. SpellQuest retains explicit sound–spelling, orthography and morphology instruction as the baseline. A proposed **Meaning and Making** branch experiments with visual, tactile and meaning-centred activities; its value must be assessed through delayed unaided spelling and transfer rather than anecdote or engagement alone. Proprietary Davis methods require licensing before being represented as such.


## 17. Individualised A/B/C teaching experiments (11 November 2026)

See [ADAPTIVE_TEACHING_EXPERIMENT_PROTOCOL.md](ADAPTIVE_TEACHING_EXPERIMENT_PROTOCOL.md). All pupils retain the established Structured Literacy baseline; we compare core teaching (A), core plus original Davis-inspired Meaning & Making (B), and core plus the same extra time in structured practice (C). The primary outcome is **delayed independent spelling**, not game completion. Randomise matched word sets, repeatedly assess before personalising, and distinguish genuine technique effects from extra teaching time or repeated exposure. This protocol requires specialist and child-research ethics review before learner-level experimentation.


## 19. Teaching core implementation freeze (11 November 2026)

The **headless learning-policy core** now lives in [../core/README.md](../core/README.md), with executable logic [../core/teaching-engine.cjs](../core/teaching-engine.cjs), regression tests [../core/teaching-engine.test.cjs](../core/teaching-engine.test.cjs), and curriculum/error rules [../core/curriculum-policy.json](../core/curriculum-policy.json). It operationalises the eight-stage [SPELLQUEST_TEACHING_METHOD_V1.md](SPELLQUEST_TEACHING_METHOD_V1.md). These are implementation specifications and a tested prototype, **not a clinically validated intervention**. Until educator-approved audio and word annotations are available, it must not be used to automatically create learner-facing phoneme lessons. Gameplay development is explicitly secondary to specialist-reviewed curriculum and functional learning assessments.


## 20. Mixed old/new spelling retrieval throughout gameplay (11 November 2026)

### Evidence

- IDA's *Spelling* guidance recommends practising a few new words, with repeated accurate writing and fluency-building dictation as words are learned: https://dyslexiaida.org/spelling/
- University of Michigan DyslexiaHelp guidance calls for structured, **cumulative** spelling instruction, introducing new information only after earlier content has been learned securely: https://dyslexiahelp.umich.edu/professionals/dyslexia-and-intervention/spelling/how-should-spelling-be-taught/
- Warwickshire literacy practice guidance explicitly describes interleaving older with newly learned spelling words (two new words followed by already learned words): https://www.sasc.org.uk/media/gedbejuc/warwickshire-literacy-practice-guidance-oct-2020.pdf
- Veiga da Silva et al. (2023) found improved four-day spelling retention after retrieval plus immediate feedback compared with copying, in one of three experiments with Brazilian fifth graders: https://pubmed.ncbi.nlm.nih.gov/37605436/
- Klimovich & Richter (2025) found some longer-term benefits from interleaving German spelling rules, with results affected by prior knowledge and guidance. This was **not** a trial of English spelling in dyslexic pupils: https://pmc.ncbi.nlm.nih.gov/articles/PMC12511507/

### Core gameplay policy

1. Never keep adding only novel words: every adventure session draws **due older words** into current play, including words last seen days or weeks earlier.
2. Teach a new validated feature with a small connected set first, where appropriate. During retrieval, mix it with previously taught and different-feature words to practise discrimination and memory.
3. At the start of a session, prioritise a short **unaided recall of a due old word**, followed by a mixture of due reviews and, only if review workload permits, a small number of new words.
4. Prototype default: up to eight word-turns, at most two new words, and around two due review opportunities for each new-word opportunity. These numbers are **adjustable pilot hypotheses**, not a proven dosage; learners can opt for shorter sessions.
5. If there is a review backlog or a difficult day, reduce or omit new words. A day of revising old knowledge counts as meaningful progress.
6. Familiar-word successes are emotionally helpful, but **never manipulate scores by secretly choosing only known-easy items** or count assisted construction as independent retention. Use genuinely due words selected by review schedule, acknowledge growth when the child actually remembers.
7. A review begins with the whole word spoken, no visible spelling and an accessible complete alphabet/keyboard. If incorrect, give focused feedback and optional supported building; save initial independent result separately.
8. Celebrate a *real* later correct answer with warm praise or game progress; avoid public comparisons, loss-based streak penalties, speed pressure or rewards solely for taps. Review achievements should distinguish 'practised' from 'remembered unaided'.
9. Keep new words and older reviews in the **same adventure story**, not segregated into punitive tests. Give an explicit reason for reappearing old words (e.g. helping the explorer remember it for longer).
10. Test actual ratios, spacing, mixed-vs-blocked retrieval schedules, and reward effects against retained spelling and learner fatigue rather than assuming gamification improves learning.

### Implementation

The headless core now includes `buildMixedSession` in [../core/review-scheduler.cjs](../core/review-scheduler.cjs), with checks in `review-scheduler.test.cjs`. It interleaves due previously taught words with a capped number of new entries and prioritises overdue reviews. It is a **prototype deterministic scheduler**, not a clinically validated adaptive spaced repetition model. Teacher-verified word data and meaningful delayed evaluation must precede live educational use.

### Open questions for pilot
- How many due items are tolerable per session at different learner skill levels (not age alone)?
- Which spaced intervals and backlog thresholds produce long-term recall without frustration?
- How much initial grouped introduction is helpful before mixed practice for a genuinely new spelling pattern?
- Do personal rewards for delayed independent recall increase engagement without substituting for true learning?


## 21. Brand and mastery reward design: Spellmaster (11 November 2026)

The product is now named **Spellmaster**; original SpellQuest repository and staging URLs remain temporary technical identifiers until deliberate migration. See [SPELLMASTER_BRAND_AND_MASTERY_V1.md](SPELLMASTER_BRAND_AND_MASTERY_V1.md) and [../core/mastery-rewards-policy.json](../core/mastery-rewards-policy.json). Learners can earn **Master** in a specific skill realm through independently retained spelling and later unlock new realms; this never implies comparison with another child, school year or a fixed ability level. Supported practice and recognition can earn progress but not retained mastery; rewards must support confidence without introducing speed or streak pressure. Mastery threshold details require educational validation.


## 22. Emotional safety and learner dignity (11 November 2026)

See [PSYCHOLOGICAL_SAFETY_AND_FEEDBACK_V1.md](PSYCHOLOGICAL_SAFETY_AND_FEEDBACK_V1.md), now a mandatory product design standard. British Dyslexia Association survey data show significant self-esteem and perceived-intelligence stigma; NHS guidance notes dyslexia does not affect intelligence, and EEF evidence supports specific task-focused actionable feedback. Spellmaster must never shame, rank or stigmatise learners. Incorrect spellings remain accurately marked for the teaching system and trigger a constructive next action, rather than being falsely praised or framed as personal failure. Preserve earned progress, offer support/skip/break, avoid punitive streaks and forced voice assessments, and celebrate authentic independent retained knowledge. This approach is research-informed; exact feedback scripts and effects on confidence/retention require specialist review and learner testing.


## 23. Voice-first teaching and pronunciation validation (11 November 2026)

**Mandatory core specification:** [SPELLMASTER_VOICE_FIRST_TEACHER_CONTRACT_V1.md](SPELLMASTER_VOICE_FIRST_TEACHER_CONTRACT_V1.md). Every task starts with spoken guidance after one user gesture; the learner must not read instructions, although seeing written spelling is necessary for teaching graphemes. Accurate spoken-syllable/phoneme modelling needs educator-approved audio, distinct from written chunks. Optional microphone input may support turn-taking and uncertain whole-word recognition but must never make unvalidated phoneme-level judgements; see the 2018 children's ASA accuracy review and 2024 NCIL teaching guidance linked in that specification. The headless contract lives in [../core/voice-tutor-policy.cjs](../core/voice-tutor-policy.cjs) with tests. This does **not** yet mean the live site has been corrected or clinically validated.


## 24. Optional spoken definitions, meaning/context, and minimal speech response (11 November 2026)

**Research question:** Does a meaning explanation or contextual spoken sentence support independent spelling retention beyond equal-time phonics/orthography practice?

### Evidence reviewed
- IDA Spelling guidance explicitly recommends teaching **word structure, origin and meaning** alongside sound-symbol mapping, syllable patterns and morphology. https://dyslexiaida.org/spelling/
- University of Michigan DyslexiaHelp lists **semantics** as a core linguistic component of spelling, especially for homophones (e.g. there/their/they're) where spelling depends on meaning/context. https://dyslexiahelp.umich.edu/professionals/dyslexia-and-intervention/spelling/how-should-spelling-be-taught/more-on-spelling/
- Hilte & Reitsma (2011; online 2010), `Orthographic learning in learning to spell: the roles of semantics and type of practice`, 36 Grade 2 learners and novel nonwords. Semantic information improved spelling accuracy at 1- and 7-day dictation relative to nonwords taught without a semantic representation; spelling practice also beat reading practice. This is small, not a dyslexia-specific trial and cannot establish benefits for every familiar word. https://pubmed.ncbi.nlm.nih.gov/20494368/
- ASHA written-language disorders guidance includes semantic awareness and word meaning in spelling assessment, especially homophones and meaning-linked word families. https://www.asha.org/practice-portal/clinical-topics/written-language-disorders

### Core teaching decision
- Provide **"What does it mean?"**, a user-initiated, optional **spoken definition** (brief, everyday language) and a spoken example sentence. Offer visuals/context when helpful without introducing a required reading task.
- When homophones/homographs require meaning to identify which spelling is requested, give an **unambiguous spoken context sentence as part of the initial HEAR stage**, not only as an optional hint.
- At explicit EXPLAIN stage, real morpheme meanings and related word families can help the learner *understand why* the word is spelled that way. Do not infer invented etymologies or meanings from syllable chunks.
- Definitions are not mandatory for every familiar word; keep lesson flow short. No literacy burden: child need not read any instructions to access semantic support.
- Do **not** treat understanding a definition or selecting a picture as evidence of independent spelling mastery.
- Use the same verified natural narrator for definition and sentence, and review meaning, example and word sense before publication.
- Measure optional support's incremental value with matched word sets and delayed **unaided spelling** rather than engagement alone. The evidence suggests possible value, not universal benefit or the optimal duration.

### Spoken-response decision for the core
- First implementation detects **whether child speech activity occurred**, only with explicit microphone permission, and never claims to recognise the word or correct pronunciation.
- Use voice activity detection (VAD) with echo suppression/no microphone listening during teacher playback; distinguish speech activity from general noise as far as practical. Local processing is preferred; no recording storage or transmission for this core feature.
- **Never** withhold lesson progression due to missed/uncertain speech activity. Always present an equally straightforward manual Continue option; no negative feedback.
- Voice recognition and phoneme-level correctness remain out of scope pending separate validation for children's speech, accents, devices, background noise and privacy.
- If microphone is disabled, simply invite the learner to say the word aloud or silently and continue. Speaking aloud remains optional, including for children with speech/language differences.

### Testing obligations
1. Adult and child device/room testing of microphone false positives from narration, siblings and background noise.
2. Check silence/noise handling and timeout never leaves the learner stranded.
3. A/B test definitions on word sets where semantic support plausibly matters, using time-matched practice as a control. Pre-register delayed unaided spelling outcome.
4. Test separately words where meaning is essential (homophones) versus a regular spelling with obvious meaning; never withhold needed disambiguating context just to run an experiment.

**Status:** Teaching-research decision and data-schema update, *not yet a live website feature*. Spoken word scoring is intentionally disabled.


## 25. First five Year 5–6 pilot word records (11 November 2026)

The initial researched editorial drafts are [../core/seed-word-records-y5-6.json](../core/seed-word-records-y5-6.json), with [review checklist](../core/PILOT_FIRST_FIVE_WORDS.md) and [automated checks](../core/seed-word-records-y5-6.test.cjs). They cover **necessary, embarrass, accommodate, government and environment**, each with curriculum provenance, an original learner-facing definition, contextual example, key spelling targets and targeted correction scripts. They remain **blocked** in the teaching engine until a qualified phonics/structured-literacy expert approves explanations and linguistic mapping and the natural voice audio is checked. No synthetic sound chunks are automatically approved. The existing public demo does not yet consume this curriculum.


## 26. Short frequent sessions, 3-word weekly hypothesis and Word Vault (12 November 2026)

Full research and game-design policy: [SESSION_DOSAGE_AND_WORD_VAULT_V1.md](SESSION_DOSAGE_AND_WORD_VAULT_V1.md). The IDA recommends only a few new irregular words at once; 2023 distributed-spelling evidence favours practice across days for 28-day retention, and a 2026 classroom meta-analysis supports context-dependent retrieval, spacing and interleaving. No research establishes exactly **three new words each week** or **five to eight minutes** as optimal for all dyslexic learners. These are learner-adjustable *pilot defaults*. Old words should reappear throughout play. The Word Vault allows words to be collected, protected, rescued and mastered, while preserving earned achievements and separating storytelling from actual unaided retained spelling. Daily reminders are proposed opt-in guardian-controlled product functionality, not active scheduled tasks.

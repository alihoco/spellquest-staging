# Spellmaster: 615-word orthographic-grouping audit (editorial candidate set)

**Date:** 19 November 2026  
**Source:** England DfE *English Appendix 1: Spelling*, via `core/national-curriculum-catalogue.json`.  
**Status:** The complete word-by-word **editorial visual-grouping pass** is complete. **Linguistic/specialist approval is not complete.** No draft is labelled a verified syllable, phoneme, grapheme-to-phoneme alignment, or genuine morpheme.

## What has been inspected and recorded

| Measure | Actual total |
| --- | ---: |
| Unique words in the complete England catalogue | **615** |
| Words with proposed visible written groups | **499** |
| Words deliberately left in a single visible group | **116** |
| Words with individually curated model/editorial decisions (including deliberate no-divide) | **557** |
| Words with an unspecialised default “whole word” disposition | **58** |
| High-priority specialist review queue | **157** |
| Specialist-approved word-grouping records | **0** |
| Model-curated candidates with potential multi-letter-cluster crossing needing extra scrutiny | **11** |

The choice not to divide a short or unusually spelt word is a deliberate **correctness safeguard**, not missing work. A short word can have one spoken syllable, several phonemes and graphemes, and an unusual spelling; the UI can highlight the specific grapheme rather than invent a chunk boundary.

An additional orthographic-cluster audit flags 11 written boundary locations for specialist inspection (such as the variable value of letter pairs in *quiet*, *language* and *experience*). These are **not eleven confirmed errors**: a pair of letters can represent one sound in one word but two sounds in another. The draft for *kitchen* was adjusted to keep the written *tch* together. The temporary heuristic does not certify phonology.

The 615 rows include stable DfE word IDs, curriculum bands, current draft visual parts, provenance/feature tags, review priority, explicit model/editorial origin and separate empty specialist approval fields. All groups have been programmatically checked to rebuild the exact correct spelling. That protects spelling identity, **not** linguistic validity.

### Current outputs
- `core/visual-word-grouping-proposals-v1.json` — full frozen, auditable 615-word candidate inventory.
- `core/generate-visual-word-groups.cjs` — reproducible draft-generator and curated overrides; editorial suggestions are **not** a source of linguistic truth.
- `research/615_WORD_GROUPING_REVIEW_REGISTER.csv` — all 615 individual candidate decisions and reviewer fields.
- `curriculum-grouping-review.html` — visually inspect, filter and export the source-backed proposals.
- `core/approved-visual-word-groups-v1.json` — deliberately **empty** specialist-reviewed publication list.
- `core/grouping-approval.cjs`, `adaptive-curriculum.js` — strict source/word/boundary/reviewer gate to activate only approved records.
- `visual-word-grouping.test.cjs` — tests for full coverage, exact reconstruction, no fabricated phoneme or morphology claims and zero implicit approvals.

## Scientific rationale and what it does **not** establish

**British Dyslexia Association, [Spelling](https://www.bdadyslexia.org.uk/advice/children/how-can-i-support-my-child/spelling)**: advocates attending to genuine syllables, spelling rules, difficult word sections and meaningful prefixes/suffixes, with repeated practice.

**Galuschka et al. (2020), [Effectiveness of spelling interventions for learners with dyslexia](https://eric.ed.gov/?id=EJ1241982)**: systematic review/meta-analysis of 34 controlled trials, concluding that phonics, orthographic and morphological instruction can improve spelling. The review did not establish arbitrary word-divider positions as an independent treatment.

**Education Endowment Foundation, [Phonics](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/phonics)**: systematic and explicit phoneme–grapheme instruction, assessment responsive to actual knowledge, not age-based fixed labels. Its reported average impact relates to phonics evidence broadly, **not** a predicted Spellmaster chunking effect.

**Goodwin & Ahn (2010), [Morphological interventions](https://pubmed.ncbi.nlm.nih.gov/20799003/)**: reports benefits across literacy outcomes, with a smaller positive effect on spelling. Genuine meaningful roots and affixes should be used when authentic; English letter endings alone are not proof of morphology.

**University of Michigan DyslexiaHelp, [How should spelling be taught?](https://dyslexiahelp.umich.edu/professionals/dyslexia-and-intervention/spelling/how-should-spelling-be-taught/)**: supports syllable knowledge, morphology and explicit teaching of spelling patterns, while limiting the amount of new information in a lesson.

**Spellmaster's prior approved project principles**, from `research/SPELLQUEST_TEACHING_METHOD_V1.md`, `research/NATIONAL_CURRICULUM_WORD_GROUPING_V1.md`, and `research/LEARNER_SELECTED_SPELLING_CHUNKS_V1.md`, require:
1. Whole-word natural en-GB audio is separate from verified spoken syllables.
2. A **phoneme** is not a letter, grapheme, word group or arbitrary screen divider.
3. Meaningful **morphemes** are not inferred from matching letter endings (e.g. *shoulder* is **not** `should + -er`).
4. Visual spelling groups are a supplementary written-memory aid; learner-selected groups never rewrite linguistic truth.
5. Individual correction loops respond to the actual error, then hide the word for unaided recall.
6. Teaching benefits must be judged by delayed independent spelling and pattern transfer, not merely whether a word appears nicely divided.

### Examples to inspect with specialist care
| Word | Candidate written layout | Critical distinction |
| --- | --- | --- |
| people | `peo | ple` | Visual grouping; **not** two spoken sound labels |
| necessary | `ne | ces | sa | ry` | One **c**, two **s** letters; pronunciation needs independent en-GB annotation |
| government | `govern | ment` | Genuine written base + `-ment` is a promising meaningful explanation, to be verified |
| environment | `environ | ment` | Written base + suffix, but do not infer spoken syllable timing |
| shoulder | `shoul | der` | Purely visual candidate; **not** `should + -er` morphology |
| night | `n | igh | t` | Written `igh` pattern; the visual chunks themselves are **not** audio units |
| yacht | `yacht` | Leave whole, highlight its unusual spelling only after verified instruction |
| one | `one` | Leave whole, focus on exceptional correspondences with a reviewer |

## Release gates — still open

A qualified structured-literacy/dyslexia specialist must inspect **each of the 615 words**, confirm the visual grouping's *instructional purpose* or explicitly approve the decision to leave it whole, and record reviewer, date, rationale and targeted spelling difficulty.

A qualified phonics/linguistic reviewer must separately approve **where pedagogically needed**: en-GB spoken syllable boundaries/stress, phonemes, accurate grapheme alignments, meaningful morphemes and appropriate pronunciation variants. A visual grouping is *not* a stand-in for these fields. Any segmented speech requires independently reviewed sound audio.

The 157 highest-priority entries (common-exception, irregularity and homophone-related candidates) should be the first review tranche. A homophone/homograph needs a contextual sentence as well as a word pronunciation; isolated speech may be ambiguous. No learner diagnosis affects where letters are grouped, and age changes presentation only.

The current adult volunteer staging retains its deliberately provisional few pilot examples. **It must not automatically replace all 615 live teaching groupings with these unapproved model drafts.** Once reviewed records are introduced into the empty approvals file, the learner loader will accept only records with matching word IDs, exact spelling, validated partitions and explicit review evidence.

## Verification outcomes and limitations

**Completed mechanically:** 615/615 IDs present; 615/615 reconstructed spellings; no duplicate records; no invented phoneme/syllable/morpheme arrays; no positive approval flags; review workbench; full reviewer register; reproducible candidate inventory.

**Still dependent on a qualified person:** 615 individual pedagogical decisions and any sound-alignment annotations, proof-listening of the voice prompts, instructional clarity, and supervised testing on dyslexic learners. No assistant-generated text or algorithm can honestly substitute for that independent sign-off.

**No efficacy claim:** these draft dividers have not been proven to improve 7-day or 28-day unaided retention. The existing `research/PERSONAL_WORD_GROUPING_ADOPTION_AND_RETENTION_STUDY_V1.md` remains a proposed methodology, not a completed experiment.

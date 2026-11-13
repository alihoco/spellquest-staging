# Spellmaster — National Curriculum Word Library and Teaching Grouping Policy v1

**Established 13 November 2026; evidence-informed inventory, pending educational sign-off.**

## Scope and provenance
We loaded England's [English Appendix 1: Spelling](https://assets.publishing.service.gov.uk/media/5a7ccc06ed915d63cc65ce61/English_Appendix_1_-_Spelling.pdf) into a source dataset and compiled searchable word catalogue.

- **100 official Years 3–4 entries**, exactly as enumerated in the government list (source page 16).
- **100 official Years 5–6 entries**, exactly as enumerated in the government list (source page 23).
- Expanded official combined entries where the list supplies variants (e.g., *eight/eighth*, *busy/business*, *equip (–ped, –ment)*). Variants remain linked to the original entry. Thus the number of actual spellings exceeds 200.
- **45 Year 1 and 64 Year 2 common-exception words** from the relevant statutory spelling-work tables. Unlike KS2, these are not a fixed statutory 100-word list.
- **Selected Year 1 and Year 2 non-statutory examples** from the curriculum's grapheme/spelling-pattern tables. These examples are useful teaching inventory but are *not* an exhaustive transcription of every exemplar in every table.
- After case-normalisation, combined-source variation expansion and duplicate merging, the first release contains **615 unique words**; some words appear in more than one curricular context.

**Jurisdiction:** These files are exclusively for **England**. Wales uses Curriculum for Wales progression descriptions; Scotland uses Curriculum for Excellence benchmarks; Northern Ireland uses its own curriculum. There is no single mandatory UK-wide word list. Those curricula will need their own provenance and mapping if Spellmaster is to claim comprehensive UK coverage.

## Why we should group by teaching features, not calendar age alone
The DfE spelling appendix says phonics should underpin spelling beyond Year 1–2, while increasingly drawing on morphology and etymology. In the [Writing Framework (2025)](https://assets.publishing.service.gov.uk/media/68bec95444fd43581bda1c86/The_writing_framework_092025.pdf), DfE describes learning spellings through phonics, orthographic conventions and meaningful morphemes. The International Dyslexia Association's [Structured Literacy framework](https://dyslexiaida.org/wp-content/uploads/2023/10/Structured-Literacy-Grounded-in-the-Science-of-Reading-SOR-V18.pdf) explicitly integrates phoneme↔grapheme links, word morphology, syllables/stress, orthographic conventions, vocabulary and contextual language.

Age and school year should influence **only the initial diagnostic sample**. What matters later is **observed independent spelling, specific error patterns, true phoneme/grapheme instruction needs and delayed retained recall**. Display styling uses chronological age independently of lesson difficulty.

## Learning group taxonomy — provisional
- **Phoneme–grapheme relationships:** consonant digraphs, alternative vowel spellings, split digraphs and reviewed sound correspondences.
- **Orthographic patterns:** doubled letters, permissible letter combinations, silent/less audible letters, unusual fixed spellings.
- **Syllable, stress and schwa awareness:** only after qualified human phonetic analysis; never convert written chunks automatically into sounds.
- **Morphological knowledge:** genuine roots, prefixes, suffixes and spelling changes when adding endings.
- **Homophones and meaning:** a target spelling may require a spoken example sentence to disambiguate.
- **Common exception/high-utility words:** explicit review and application of patterns already taught, with genuine exceptions treated transparently.
- **Diagnostic error clusters:** missing double letter, order swap, ending confusion, omitted vowel, and other categories; these are observations about answers, not clinical labels about the learner.

## Quality / research safeguards
1. The generated catalogue tags are **heuristic candidates, not expert-reviewed truth**. Regex-based suffixes are not a valid test that a sequence is a morpheme; automatic 'silent letter' guesses are unsafe.
2. A single word may belong to several groups, and group labels can change as specialist annotations improve.
3. The absence of an approved pattern does not mean the learner cannot access a word: it means the *teaching lesson* needs reviewed script/audio.
4. Every child-facing word must have its correct whole-word voice model, age-respectful spoken definition/context where needed, human-reviewed explanation, a safe diagnosis-aware correction loop, and validated sound units if used.
5. No false claims of a child's 'learning type' based on a regex-derived category or one spelling error. Change support based on replicated delayed performance.
6. Curriculum origin, age hint and actual mastered skill are three separate fields. Do not tie learner graphics to spelling level.
7. Record and test plural words, spelling variants (e.g., UK '-ise'), proper nouns and homophones for disambiguation. UK accents may influence spoken vowel interpretation.
8. Acknowledge data limitations: small pilot Year 5–6 word records and the ten-word staging audio demo remain separate; this expanded reference catalogue is **not yet a validated 615-word playable lesson bank**.

## Implementation
- Original reference: `core/england-national-curriculum-source-v1.json`
- Compiler: `core/national-curriculum-catalogue.cjs`
- Generated searchable dataset: `core/national-curriculum-catalogue.json`
- Validation tests: `core/national-curriculum-catalogue.test.cjs`
- Reviewer browser: `curriculum-library.html`

## Next validation
- Expert audit of all 200 KS2 source entries/variant expansions and 109 KS1 exception entries against PDF.
- Complete / verify non-statutory Year 1–2 examples and their pattern rows without inventing sound correspondences.
- Specialist grade of teaching clusters; add word frequency, usage, definitions and sentence context only where professionally checked.
- Link age-sensitive baseline to short *approved* words; avoid making the whole reference inventory playable prematurely.
- Add separate jurisdictions only with their own curriculum source and precise status labels.

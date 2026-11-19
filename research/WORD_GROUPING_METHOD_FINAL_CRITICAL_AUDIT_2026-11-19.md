# Spellmaster — independent methodological audit of learner-controlled word groups

**Reviewed 19 November 2026.** Scope: current research policies, 615-word visual grouping inventory, adaptive curriculum intake, learner-selected divider UI, and cloud profile bridge.

**Bottom line:** The instructional architecture is credible and research-informed, **but not validated as an intervention**. Personal visual partitions can be offered as optional mnemonic aids without requiring each arbitrary divider to be professionally labelled as a phoneme or syllable. Professional review is warranted when Spellmaster makes claims about language structure, pronunciation, spelling rules, morphemes or error diagnosis. A binary 'specialist approves all 615 dividers before any can be shown' gate is overbroad for an optional visual preference.

## Evidence hierarchy
1. Stronger support: systematic, explicit instruction in phoneme–grapheme correspondences, orthographic conventions and authentic morphemes; timely feedback and opportunities for delayed unaided retrieval. IDA Structured Literacy: https://dyslexiaida.org/structured-literacy-effective-instruction-for-students-with-dyslexia-and-related-reading-difficulties/ ; Galuschka et al. (2020): https://doi.org/10.1080/00461520.2019.1659794 ; Petersen-Brown & Kromminga (2024): https://doi.org/10.1002/pits.23223
2. Supporting evidence: distributed spelling practice with 28-day checks and feedback-linked retrieval. https://doi.org/10.1002/pits.22943 ; https://pubmed.ncbi.nlm.nih.gov/37605436/
3. Practitioner recommendations: BDA encourages highlighting tricky sections, building words, real prefixes/suffixes and memory supports; does not establish the superiority of a particular arbitrary set of dividers. https://www.bdadyslexia.org.uk/advice/children/how-can-i-support-my-child/spelling
4. Hypothesis, not established outcome: giving a learner freedom to choose and reuse their own visual letter divisions improves spelling retention. The study design is documented in research/PERSONAL_WORD_GROUPING_ADOPTION_AND_RETENTION_STUDY_V1.md but not executed. Do not imply causal benefits or immutable learning-style fit.

## Corrected operating model: three separate layers
- **Layer A — Learner preference (low linguistic risk):** Correctly spelled whole word; optional editorial *suggested visual grouping*; learners may move dividers, select none, save and change their preference. Never call those pieces syllables or speak them as isolated sounds. Use them only while the full spelling is visible during supported study.
- **Layer B — Explicit language teaching (accuracy required):** Any instruction saying “this makes the /.../ sound”, “this is a suffix”, “these are spoken syllables”, or “the rule is ...” requires reliable word- and locale-specific annotation. Highlight graphemes as whole graphemes where supported. En-GB whole-word voice is a separate field.
- **Layer C — Independent retrieval:** Completely hide correct word, dividers, spelling-specific tiles and hints, then assess later without scaffolds. Longitudinal success is delayed unaided spelling, not time in the editor or custom divider adoption.

## Audit findings
- Source-backed inventory: **615/615** DfE-derived unique spellings. Proposed visual dividers: **499** words; deliberately one group: **116**. Draft model-curated decisions: **557**; remaining short/whole default: **58**. All parts reconstruct the original word; **0** specialist approvals.
- **Not evidence of accuracy:** exact reconstruction and only 11 flagged multigraph crossings are syntactic checks. They do not prove linguistic validity. Even model-curated groups can be arbitrary or confusing, especially irregular words.
- **Actual live player discrepancy:** adaptive-curriculum.js uses ten pilot manual spellings, the 'people' manual entry and an empty approved-entries file. It does **not** load the 615 draft proposal file. The review workbench is complete; the learner default grouping rollout is not.
- **Learner preference sync risk:** spelling-chunks-ui.js writes grouping preference into storage; year6.html calls SpellmasterCloud.save() after a spelling check, but not directly on 'Use my groups'. A learner leaving before the next attempt may not carry their chosen split to another device.
- **Default language risk:** “teacher's groups” or “correct split” is too strong unless linguistically grounded. Use “Suggested written groups” and “My groups” for optional memory aids; learner choices are not a pronunciation or morpheme correction.
- **Scaffolding risk:** counting immediate assisted spelling as mastered would overstate results. The established policy rightly treats retained independent spelling separately.
- **Reviewer effort can be targeted:** do not require a literacy specialist to endorse each arbitrary personal divider. Require a trained review of actual linguistic explanation templates, and high-risk grapheme/suffix/context cases; use staged expert sampling and learner feedback for the low-stakes visual UI.

## Recommended implementation decision
1. Promote the 615 model-written proposals as **optional defaults / visual aids only** with a clear status marker, not as 'verified teaching' or standalone segment audio. The learner can select 'whole word' or modify the split without judgment. Never automatically claim a 615-word linguistically annotated curriculum.
2. Keep the strict reviewed-only gate for *formal phoneme, syllable, morpheme and rule teaching*; split it from the low-stakes visual preference gate rather than simply removing all validation.
3. Save personal grouping changes immediately to account state (versioned); show a success/failure indicator, handle conflicts, protect on shared devices. Retain changes on a second signed-in device.
4. Ensure each teaching lesson includes meaningful *error-specific instruction* when it is available; visual grouping is supplemental, not the complete dyslexia intervention.
5. Begin with the 157 flagged high-priority lexical entries and 11 automatic cluster warnings for targeted professional spot checks, not as a promise that these are the only potential errors. Audit a random cross-section from the 499 defaults too.
6. Test guided options with volunteers and consented learners: unchanged whole-word view, suggested visual grouping, and learner-selected grouping. Match exposure and compare immediate, 7-day and 28-day independent spelling and words never taught. Track usability separately; do not claim treatment efficacy from small pilots.
7. Avoid age-level inference from diagnosis or age when selecting *spelling difficulty*; keep age for presentation and appropriate input defaults only.

**Release principle:** Learner agency can coexist with evidence-informed language teaching. The former does not remove the need for correctness in the latter.

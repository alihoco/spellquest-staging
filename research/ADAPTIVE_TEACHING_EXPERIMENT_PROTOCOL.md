# SpellQuest Adaptive Teaching Experiments — Protocol v1.0

**Date:** 11 November 2026
**Status:** Research proposal for specialist/ethics review; not an established superior intervention.
**Purpose:** Determine whether adding meaning-centred, visual or hands-on activities informed by Davis learning traditions improves an individual learner's *independent and retained spelling* compared with structured instruction alone, and whether any added improvement exceeds the effect of extra time and practice.

## Foundational principle
All learners continue to receive accurate, explicit, systematic and cumulative Structured Literacy teaching of phoneme–grapheme relationships, orthographic patterns, morphology, corrective feedback and repeated unaided retrieval. **Do not withhold foundational evidence-informed instruction for an A/B test.**

The proposed addition is an **original SpellQuest-designed Meaning & Making activity**; it is not a licensed or accredited Davis programme. The Davis causal theories (e.g., disorientation as an explanation for dyslexia) are not assumed to be established.

## The three conditions
- **A — Structured Literacy core:** The standard instructional sequence with normal time, modelling and feedback.
- **B — Core + Meaning & Making:** Identical core *plus* child-generated meaning scenes, contextual visual representations, manipulation/building, or a personal association appropriate to the word.
- **C — Core + time-matched additional structured practice:** The same total time and interactions as B, but the extra minutes are spent on another explicit guided/retrieval activity. This tests whether B outperforms simply doing more useful practice.

**Primary causal comparison:** B versus C (time matched). **Contextual comparison:** B versus A (adds time as well as content). Never call B "better" based only on B versus A.

## Per-learner testing
1. Map baseline spelling patterns and recently demonstrated errors through low-pressure, accessible audio-led tests, recording independent performance and degree of help. Select appropriate words without using age as a proxy for skill.
2. Create *matched word sets*, balanced for number of letters, phonological/orthographic complexity, morphological structure, baseline difficulty and any prior exposure. Do not teach the same word in A and B simultaneously, or carry over a newly learned mnemonic.
3. Randomise/counterbalance assignment across A/B/C and order across sessions and learners. Use multiple words and repeated sessions before inferring a preference; account for within-learner correlations and word-set variability.
4. Deliver common explicit teaching; record content, time actually taught, amount of assistance, voice/audio settings and total retrieval attempts. Provide adequate breaks and equal encouragement.
5. Record: independent pre-test spelling, immediate unaided spelling, delayed unaided spelling after ~7 days and ~28 days, and transfer to *new, untaught related words*. These windows are research-design defaults to evaluate, not proven optimal spacing.
6. Estimate each learner's benefit with uncertainty; allow "similar / insufficient evidence" as an honest result. Do not personalize aggressively after one or two words. Continue exploration where safe and useful.
7. Assign future instruction based on likely retained benefit, learner comfort and accessibility, not solely immediate accuracy, enjoyment or game progress. If evidence is weak, retain the core and offer learner preference.
8. Regularly retest; effects may depend on word type (regular, irregular, morphology-rich, abstract) and change over time.

## Outcomes

**Primary:** Percentage of studied words independently spelled correctly from audio at delayed follow-up, using full on-screen alphabet or physical keyboard (learner choice), with no target letter bank, spelling preview or choices. Evaluate A/B/C for matched words and comparable exposure.

**Secondary:** immediate unaided spelling; 28-day retention; novel-word transfer (if meaningful); number/types of spelling errors; time, frustration, engagement; assisted practice completions; dropout; child confidence and repeated help needed.

**Guardrails:** No negative grades, public rankings, forced speech recognition, penalties for opting out of an activity, or guaranteed benefit claims. Avoid showing families unverified "your child is a Davis learner" labels.

## Adaptive decision policy (prototype)
- Use the core by default.
- After repeated difficulty *on multiple attempts/words* or with learner choice, invite B as one way to learn (not as a corrective diagnosis).
- If B yields a repeatable and practically meaningful advantage over C at delayed recall, increase availability of Meaning & Making for that learner and applicable word types, while keeping core teaching and review.
- If B and C appear similar, use accessibility preference and engagement; do not infer that B has a unique mechanism.
- If both B and C outperform A, that may reflect extra time/practice.
- If B reduces performance, frustrates the learner or raises cognitive load, reduce it.
- Provide transparency to parent/teacher: "This learner retained X/Y words with each approach; the sample is too small for a firm conclusion" rather than personality labels or causal certainty.

## Bias and statistical quality
- A few individually chosen failed words are *not* a fair experiment. Difficulty, repeated exposure, regression to the mean, carry-over, motivation and novelty can mimic a treatment effect.
- Randomize matched sets, counterbalance conditions, keep testing identical and use a preset outcome and stopping/decision rule.
- Avoid optional stopping ("keep testing until B wins") and testing many variants without correction.
- Population-wide analysis should use appropriate hierarchical/multilevel designs, subgroup uncertainty, pre-registration and reporting of null results. Differences among dyslexic learners are expected; do not overinterpret age-group averages.
- Treat any site-wide research beyond routine service improvement as a child-involving research project requiring specialist ethics/privacy review, meaningful consent/assent, lawful basis and safeguarded data minimisation.

## Example without invented effect claims
A learner studies nine comparable words:
- three receive A (core);
- three receive B (core + Meaning & Making);
- three receive C (core + extra matched practice).
After a week, test all nine by unaided spelling. **Three words per condition are not enough to choose the learner's method**. Use repeated blocks over additional weeks to build a credible estimate. This is a design illustration, not study evidence.

## Implementation record
Per experimental assignment store:
`learner_pseudonymous_id`, `word_id`, `verified_word_family`, `baseline_error_class`, `word_difficulty_covariates`, `assignment_arm`, `randomization_block_id`, `lesson_version`, `teaching_time_seconds`, `practice_attempts`, `assistance_level`, `immediate_unaided`, `delay_days`, `delayed_unaided`, `untaught_transfer`, `input_mode`, `learner_preference_optional`, `frustration_optional`, `guardian_consent_metadata`, `research_permission`.
No voice recordings by default; do not expose identifying child records.

## Evidence supporting the *approach to evaluation*, not proving Davis superiority
- Petersen-Brown & Kromminga (2024), 81-study spelling meta-analysis: intervention benefits and limited research on individualisation. https://doi.org/10.1002/pits.23223
- Chandler et al. (2026 print; online 2025), 59-study LD spelling meta-analysis, including 20 single-case designs: heterogeneity, replication needs. https://pubmed.ncbi.nlm.nih.gov/40875456/
- McCurdy et al. (2016), *Identifying Effective Spelling Interventions Using a Brief Experimental Analysis and Extended Analysis*: four struggling spellers; different approaches helped different children, and brief experimental results corresponded with extended comparison. https://doi.org/10.1080/15377903.2015.1121193
- Veiga da Silva et al. (2023), retrieval plus immediate feedback improved delayed spelling relative to copying in one experiment. https://pubmed.ncbi.nlm.nih.gov/37605436/
- Galuschka et al. (2020), dyslexia spelling intervention meta-analysis. https://doi.org/10.1080/00461520.2019.1659794
- Davis / Whitehead evidence limits and product restrictions: [DAVIS_WHITEHEAD_METHODS_REVIEW.md](DAVIS_WHITEHEAD_METHODS_REVIEW.md)

**Release criterion:** No claim of comparative efficacy or automated "best method" classification until an external methodological and dyslexia specialist review approves the experiment design and sufficiently powered data justify the conclusion.

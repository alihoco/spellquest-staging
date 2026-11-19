# Spellmaster: word-grouping outcomes measurement protocol v1
**19 November 2026 · implementation and research governance draft**

## Why this matters
Spellmaster's educational goal is *better today than yesterday*: independent spelling that persists and transfers. Personal visual grouping is a promising, optional memory strategy, but whether it changes durable learning outcomes is **not yet demonstrated**. Collecting outcomes can generate hypotheses and improve teaching; we must not confuse participation, preference, immediate success or repeated practice with durable learning.

## What is now instrumented
For the signed-in learner's supported spelling lesson:
- The **suggested** visual groups and their exact divider positions.
- The **selected** groups (suggested / learner-adjusted / whole word), as actually displayed.
- The time, word, lesson opportunity and whether changes occurred in that or later lessons.
- The learner's saved preference; cloud state is requested immediately on saving, rather than only after the next answer.
- The subsequent independent attempt result; whether it was a fresh probe, assisted retry, same-session practice, or a scheduled review; elapsed days since the most recent grouping exposure.
- Each first independent scheduled review response can be counted in an observational cohort.

**Never** treat letters grouped on screen as automatically validated phonemes, spoken syllables or meaningful morphemes. Whole-word en-GB narration and supported written study are separate.

## Three visual grouping conditions
1. **Suggested**: Learner actually sees Spellmaster's provisional written-group suggestion and leaves it unchanged.
2. **Adjusted**: Learner sees and saves an altered written division. A normal switch from suggested to adjusted *within the same lesson* counts as adjusted, not a cross-session strategy switch.
3. **Whole word**: Learner studies the correctly spelled word as one unit, without visual divisions.

An unexposed word is marked **not_exposed**, not assigned to the whole-word treatment. Do not infer 'no grouping' merely because the learner never opened the divider editor.

## Outcome definitions
Primary candidate outcome: **7-day delayed independent spelling accuracy** among eligible learner–word observations (target spelling hidden; no letter-bank or hint). The recorded 7-day window is **day 5–10 after the last documented grouping exposure**.

Secondary candidate outcomes:
- Next-day independent accuracy (**day 1–3**).
- 28-day independent accuracy (**day 24–35**).
- Accuracy on previously untaught transfer words with a genuinely matched spelling target (future annotation, not implemented).
- Time spent in active instruction excluding tab inactivity and audio waiting (future measurement).
- Attempts until first independent correct spelling, later error patterns, confidence and usability as distinct outcomes.

**The existing adaptive curriculum checks words at variable intervals and does not guarantee a visit in either the 7- or 28-day window.** The report will therefore show the observed denominators and missingness, not pretend all learners reached those checkpoints. A controlled study needs a dedicated schedule with comparable practice exposure for each arm.

## Unit, attribution and exclusions
- Unit: **first independent scheduled-review attempt per learner × word × checkpoint window**, not every repeated answer. Additional attempts do not inflate the numerator.
- Attribute to the **last actual written grouping shown** before the independent check, while preserving the opportunity and elapsed interval. Do not use the preference selected today to reclassify previous lessons.
- Flag a switch of strategy *between* teaching opportunities. Exclude these complex crossovers from the simple primary summary and analyse separately under a prespecified model.
- Exclude assisted attempts, same-session practice, wrong time windows, missing exposure, and anyone without current specific research opt-in.
- Analyse only adult learners for now. Children need separate consent/assent, safeguarding, study and legal/ethical governance.

## Why observational comparisons are not causal
A learner who adjusts a grouping may have been struggling more at baseline, spent longer studying, or be more motivated to interact. This creates **selection bias**. Word difficulty and repetition also differ. Neither the raw percentage difference nor statistical adjustment is proof of causation.

Later causal research should assign matched words to suggested, adjustable, and whole-word conditions with consent and independently reviewed methodology; use counterbalanced within-learner comparisons where feasible; control instructional time and review frequency; preregister primary outcomes, sample size/power, recruitment, handling of missing checks, group switching and attrition; use a hierarchical learner-and-word model and report uncertainty and negative/null findings. The suggestion must remain optional in normal learning even when its trial use is evaluated.

## Confidentiality and reporting
- The optional **grouping-research consent** is separate from neurodiversity/health information and optional teaching support. The default is **off**. A pilot adult may opt in or withdraw in Privacy & Account Settings; enrolment of children is disabled by the API.
- Any research extraction uses **current opt-in**, excludes any exposure before the recorded consent timestamp, excludes child profiles, and never joins condition/diagnosis tables.
- The internal report prints **only aggregates**; strategy/window cells with fewer than **ten distinct learners** suppress percentages and intervals. This threshold is a basic safeguard, not a substitute for re-identification risk assessment.
- The report remains disabled unless a research-governance approval flag is deliberately set, and is not exposed as a public HTTP endpoint.
- Avoid writing raw attempted spellings, diagnoses, emails, passwords, or full child profiles into research event payloads.
- A formal publication needs controller details, ethics/legal review as applicable, anonymisation risk checks, sample-size and attrition disclosures, and a versioned analytical plan.

## Data contracts / implementation
- `grouping-measurement.js`: classify **actual grouping exposure**, method changes, and independent attempts.
- `spelling-chunks-ui.js`: report visible grouping and saved selected cuts.
- `year6.html`: attach a grouping observation to existing spelling-attempt events; request immediate cloud synchronisation of saved choices.
- `database/003_grouping_research.sql` and `account-api.js`: separate adult study opt-in, withdrawal and child prohibition.
- `privacy-settings.html`: clear optional research consent/withdrawal control.
- `core/grouping-outcome-analysis.cjs`: per learner–word–time-window deduplication, success numerators and denominators, Wilson 95% intervals, suppression and explicit observational caveat.
- `scripts/grouping-research-report.cjs`: restricted, on-demand, aggregate-only report, disabled until governance approval.

## References and evidence boundaries
- Petersen-Brown & Kromminga (2024), meta-analysis of 81 spelling instruction studies: https://doi.org/10.1002/pits.23223. Notes limited rigorous evidence on individualisation.
- Chandler et al. (2025 online, 2026 issue), review of 59 studies and 2,229 students with or at risk for learning disabilities: https://pubmed.ncbi.nlm.nih.gov/40875456/. Supports spelling interventions; does **not** establish optimal user-selected visual dividers.
- *Applying distributed practice in the schools to enhance retention of spelling words* (2023): https://doi.org/10.1002/pits.22943. Found greater 28-day retention for across-session distributed practice in the studied conditions.
- Prior Spellmaster draft protocol: `research/PERSONAL_WORD_GROUPING_ADOPTION_AND_RETENTION_STUDY_V1.md`.

## Release status
**Instrumentation and consent controls: staged and subject to deployment and browser verification. No formal research results exist yet.** Raw cumulative 'success rate' cannot support claims of a best teaching method. This is a credible evidence-building foundation, not a completed experiment.

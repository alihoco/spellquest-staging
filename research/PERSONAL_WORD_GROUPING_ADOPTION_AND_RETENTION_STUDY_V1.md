# Spellmaster — Personal Word Grouping Study and Feature Adoption Protocol (draft)

Date: 18 November 2026  
Status: research-design proposal only; **no enrolled research subjects, experimental allocation, causal claims or external ethics approval**.

## Core question

Does allowing learners to place their own visual dividers between **correctly spelled letters** improve how quickly and durably they learn to spell, compared with teacher-suggested groups and equally timed alternative teaching? Does the feature attract genuine voluntary use?

These are **two separate hypotheses**: (1) learning efficacy and (2) preference/appeal. A popular feature is not necessarily an effective method for durable spelling.

## Research arms — with structured spelling teaching preserved in all

- **A: Reviewed default visual grouping.** Learner sees educator-approved teacher grouping.
- **B: Learner-selected grouping.** Learner may add/remove/move visual divider positions, save their preference and reuse it when practising the same word.
- **C: Equal-time conventional practice.** Learner receives equivalent teacher interaction and elapsed active instructional time without learner-selected dividers.

Additional later study: separate the *choice/agency* effect from the *particular chunking* effect (e.g. interactive default-group exercise) only if approved by research experts. Do not change approved phonemes, syllables, morphemes, voice model or corrective guidance across groups.

Randomise matched word sets and counterbalance exposure; never infer success from an anecdotal single-learner test. Ensure learners may opt out and choose low-pressure alternatives. Require approved child-facing explanations and an ethically reviewed consent/assent pathway before any formal study.

## Learning and retention outcomes

**Primary:** 7-day independent spelling retention, target word not shown, no dividers, no letter bank, no hint.

Secondary:
- Next-day and 28-day independent unaided accuracy.
- **Speed:** cumulative *active teaching seconds* to independent success; measure later sustained criterion separately. Exclude audio buffering, pauses and tab inactivity.
- **Efficiency:** active learning time per word **still correctly spelled independently at 28 days**.
- Attempts until first independent correct attempt; repeat error patterns; support requests.
- Confidence/comfort and voluntary return, analysed as separate outcomes; never substitute engagement for retention.

Document initial familiarity, word length, difficulty, letter/grapheme patterns, teacher annotation version, word assignment, time/exposure, assistance and initial/delayed unaided answers. Adjust analyses for repeated words within learners and word difficulty; register sample-size/power plan and missing-data rules before study.

## Feature popularity and actual behaviour (separate from outcomes)

**Denominators** matter. Count one `offered` event for each **distinct learner + word + session opportunity** where the editor is accessible, not for every page redraw.

Capture:
- `offered`: teacher grouping and splitter option available.
- `opened`: user opens the tool.
- `edited`: user adds/removes/moves a divider, even if later reversed.
- `custom_saved`: **saved positions differ from the teacher suggestion** (not merely opened).
- `default_kept`: user explicitly confirms teacher grouping unchanged.
- `previous_grouping_confirmed`: learner re-saves previous choice without changing it.
- `custom_reused`: previously saved custom grouping opened in a *later* opportunity.
- `custom_reset`: previously custom grouping switched back to default.
- `custom_revised`: previous custom grouping changed to a different custom grouping.
- `skipped`: user closes editor without saving.

**Primary popularity metric:** unique learners who ever save a different grouping / unique learners offered a usable choice.

Secondary:
- Changed learner–word opportunities / learner–word opportunities offered.
- Editor opened / offered (exploration).
- Custom saved / editor opened (expressed preference, not success).
- Later reuse / later opportunities with saved custom groups (sustained preference).
- Revisions/resets and repeated choices.
- Broad age groups / learning challenge categories only if privacy thresholds allow; no individual-learners' public ranking.

A learner who experiments ten times still counts once in unique-learner adoption. A visible choice does not mean it was understood, and a control's placement/wording affects engagement. Differences between arms B and A in appeal must be interpreted separately from spelling outcomes; consider neutral prompt wording and comparable interactions.

## Minimum event schema

`learner_pseudonym_id`, `word_id`, `lesson_version`, `opportunity_id`, `timestamp`, `event_type`, `teacher_boundary_positions`, `selected_boundary_positions_optional`, `device_access_mode_optional`, `phase`, `prior_independent_accuracy`, `study_assignment_optional`, `research_consent_reference_optional`.

Never store audio or raw child misspellings simply to measure divider preference. Mark all observations as routine product telemetry unless research consent and ethics approval are actually in place.

## Current staging implementation

- `spelling-chunks-ui.js` provides a **tap and desktop drag** visual splitter, preserving the correct letter sequence.
- Saving choices stores a learner–word preference only in **browser localStorage**; no production database, signed-in cross-device identity or recruitment.
- A current word group is shown during supported instruction only, **never during unaided spelling checks**.
- Local test analytics are intentionally per device/profile. We **cannot yet compute a trustworthy global unique-learner adoption rate**.
- The rollout is a **usability prototype**, not a controlled A/B/C trial or a validated teaching intervention.

## Next research readiness gate

Complete UK child privacy/DPIA, secure profiles, consent/assent and ethics/legal review; obtain phonics/orthographic specialist signoff; pre-register outcome/analysis definitions and assignment plan; run supervised accessibility testing on desktop, tablet and mobile; then assess causal effectiveness. Only after robust independent replication should findings be shared as potential general teaching guidance.

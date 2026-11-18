# Spellmaster — All England Curriculum Words in Adaptive Staging (Pilot v1)

**Date:** 18 November 2026  
**Scope:** Existing staging teaching game, browser-local tester profiles; not secure production memberships, nor expert-approved national curriculum instruction.

## Inventory

- Imported exactly **615 distinct words** from `core/national-curriculum-catalogue.json` (source: Department for Education, England primary English spelling Appendix 1).
- Breakdown: Year 1 **244**, Year 2 **158**, Years 3–4 **109**, Years 5–6 **104**.
- Includes non-statutory examples and Years 1–2 common exception words. It is **not** 615 distinct statutory spellings.
- The complete inventory is fetched and verified by `adaptive-curriculum.js` before launching a new session; existing historic tester profiles are retained.
- **27 ambiguous words withheld from unattended independent challenge:** 24 words annotated for homophone context, plus `live`, `minute`, `use` requiring a reviewed pronunciation/context. The 615 are still present in the catalogue; **588 are presently eligible** for the provisional audio-first staging exercises. No invented sentence or pronunciation is supplied to fill the gap.

## Placement

- School year input (optional) takes precedence over birth-month/year: Y1→Year1, Y2→Year2, Y3–4→Years3–4, Y5–6→Years5–6.
- If not selected, estimated age supplies the initial band (5–6→Y1, 7→Y2, 8–9→Y3–4, 10+→Y5–6). Age is NOT a difficulty cap.
- The initial learner band is stored per pseudonymous tester profile in `spellmaster-placement-v1:<learner_id>`.
- Each band begins with a source-grounded, provisional mix of several spelling probes rather than only the shortest words; these are not a validated psychometric assessment.
- After four independently correct new/due words in the current band (or four of the latest five), the band can move **up one step**. After three or more independently incorrect answers in four or five distinct words, it can move **down one step**. Assisting a retry or same-session practice does not trigger band movement.
- The learner can still review previously encountered words from any band. Changing school-year preference resets the suggested starting band but **does not erase historic attempts**. Future decisions should be refined through educator feedback and a calibrated placement study, not treated as diagnostic evidence of dyslexia severity.
- This prototype does not ask learners to self-identify as a fixed visual or auditory learner.

## Teaching content quality gate

**Important:** Every imported record is currently `curriculum_inventory_only` with `sound_alignment_approved=false`; only the original 10 staging words have draft-specific grouping and corrections. Most imported words are not fully taught with reviewed phoneme/grapheme alignments, morphology and definitions yet.

For the 615-source integration:
- `server.js` derives allowlisted clips from the checked catalogue: one whole-word draft TTS clip and one short “Here is your next word” clip. No raw child answer ever enters TTS.
- Generic safe support says to inspect the real spelling, choose visual memory chunks and retrieve again. The player must NOT invent a syllable split, fake sound-letter transcription or etymology for these unreviewed words.
- Incorrect answers display the correct spelling only during teaching/review, **never** during unaided assessment. Optional learner-chosen visual chunks stay profile-scoped.
- Source-word audio remains draft until listened to and reviewed by an appropriate British-English speech/phonics specialist, especially for very short words and homographs.
- Due words, supported retries, same-session practice and later independent retention remain distinct in event logs. Same-session correct answers do not automatically award delayed mastery.

## Teacher and personal account readiness

- Both the word-bank history and placement are currently **browser localStorage**, isolated by test profile, not secure cross-device school/personal accounts.
- Membership, school admin, teacher monitoring and production consent architecture are separate requirements. Learner data must not be centralised until authorised identity, child privacy protections and tenant boundaries are built.
- Adult/guardian control and optional school year should eventually be set via an authorised onboarding flow.
- Future skill mastery must use multiple delayed independent spelling observations and comparable word-difficulty evidence; the one-band movement rule is only a pilot usability heuristic.

## Automated coverage

- `adaptive-curriculum.test.cjs`: imported unique 615 records, initial band, up/down moves, review pool, homophone gate, per-profile persistence.
- `curriculum-game-integration.test.cjs`: browser source, 615 server voice clips, secure no-freeform allowlist, profile year preference, progress counts.
- `learner-profiles.test.cjs` and `mixed-word-selection.test.cjs` cover existing histories, no dead end and profile isolation.

## Next quality milestones

1. Specialist-reviewed phonics/morpheme segmentation, word-level contextual example sentences and correct pronunciation for each release batch.
2. Review/report actual first-attempt probe accuracy vs difficulty; adjust placement thresholds with educator evaluation and delayed retention.
3. Release homophones/homographs only with reviewed narrated sentence context.
4. Replace local-only persistence with audited authenticated per-learner records and authorised school/guardian dashboards.

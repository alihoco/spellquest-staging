# Spellmaster — simulated nine-year-old dyslexic learner UX audit

**Date:** 19 November 2026  
**Environment:** Live Spellmaster staging, headless Chromium on GitHub Actions Ubuntu 24.04.  
**Persona:** Simulated nine-year-old with difficulties reading and spelling. **Not a real child**, not a dyslexia diagnosis, and not an observational usability study. A scripted computer user cannot reproduce attention, motor skills, distress, hearing or accent perception.

## Test performed
- Tested mobile at **390 × 844 CSS pixels** and desktop at **1280 × 800**.
- Completed the 10-word starting assessment using a mixture of correct and incorrect synthetic entries: `sed`, `come`, `nite`, `becos`, `enuf`, `faverit`, `nesesary`, `enviroment`, `rithm`, `acomodate`.
- Verified the 10-answer completion panel and local-browser saved guest results.
- Continued into the spelling adventure; created a pseudonymous nine-year-old tester profile called **Star Explorer**, played a new-word prompt and deliberately entered `speling` to inspect the supported-teaching screen for **could**.
- Captured welcome, assessment, learning, wrong-answer review and parent/guardian sign-up screenshots. Chromium test narration requests were **intentionally blocked** to test UI steps without asynchronous speech delays. The audio error banners seen in those screenshots were caused by this test harness, not a production outage.
- Independently fetched actual **Marin** voice MP3 from the live backend with the permitted frontend origin. Measured network timing and MP3 length, but **did not personally listen** or rate accent/warmth.
- Live guardian backend underwent separate synthetic database checks (invitation enforcement, parent confirmation, age-only data, blocked diagnosis/research, progress persistence, deletion) and live external checks.

## Findings, by severity

### P0 — Mobile learner path should put the word before the decoration
The first mobile adventure landing is **2762px** high, first question **1805px**, and supported review **2330px**, all on a **844px-high** viewport. The hero, five-step progress panel, character panel and repeated instructional headings consume much of the screen before the current answer area. Browser scroll positions can remain displaced across activity transitions.

**Fix:** Once the child enters a lesson, collapse hero and character into a narrow header, keep the progress indicator slim, scroll the new word/activity heading into view, and keep a fixed bottom action area (e.g. Check spelling / Hear word), respecting mobile safe areas and keyboard. Move optional avatar, rewards, narrator settings and profile tools into a drawer. Require no repeated long scroll to complete each word.

### P0 — Welcome speech takes too long
A real Marin welcome clip was **24.6 seconds long** and took **4.96 seconds to fetch** in the external test. The sample word **people** was **0.9 seconds long** and took **1.17 seconds to fetch**. Initial latency is a network condition, not proof of consistent speed; free-instance sleeping could make it substantially worse. No real listening-based accent/voice judgement was possible.

**Fix:** Break introductory speech into short, 4–8-second prompts, play the next only as relevant, prefetch/check audio after the adult or learner's first gesture, show a single clear preparing/narrator indicator and offer immediate replay. Check natural UK English pronunciation, speaking tempo, volume and silence on actual tablets and phones.

### P0 — Assessment guest baseline not attached to a later profile
The 10 submitted words were stored under `spellmaster-starting-assessment-v1:guest`; creating a new local learner *after* the assessment did not automatically attach that baseline or apply its provisional skill placement to the new local learner. This issue affects the guest demo; the guardian account flow should create the selected learner before beginning the assessment, but the entire browser-authenticated journey still needs device testing.

**Fix:** In every route, establish a pseudonymous profile before the diagnostic, then write outcomes to that profile. If a guest assessment was already completed, explicitly offer to transfer it to the selected profile without mixing siblings. Prevent "starting point saved" messages from implying an assessment actually influenced placement when it did not.

### P1 — Too many speaker controls and duplicate narration paths
The assessment mobile welcome has about **five visible** tiny speaker icons; the page DOM contains eleven across visible and hidden states. The game review simultaneously offers text speaker icons, Hear this hint, How to split, Hear this lesson again, plus narrator settings. This is cognitively busy.

**Fix:** One primary “Listen to instructions” control for the activity, and small inline speaker icons only on optional specific content. Make the visual speaker 18–20px but the clickable hit area **44–48px**, not the current **30–32px**. Use specific screen-reader labels such as “Hear how this word works,” not the same “Listen to this text” everywhere. Cancel other audio before starting new playback.

### P1 — Too much text for a struggling reader
The welcome panel says roughly 65+ words across two paragraphs, in addition to title and hero. The learning review also contains several explanatory sections and repeated teaching. The screen looks polished but is text-heavy for the audience.

**Fix:** Audio-first, one short instruction at a time; progressive disclosure of optional written information. Keep the main action and word on one screen. A child should be able to understand the entire journey without reading paragraphs.

### P1 — Word difficulty and learning intelligence
The fixed ten-word sample runs from common spellings to challenging words such as *necessary*, *environment*, *rhythm* and *accommodate*. Age alone must **not** decide spelling difficulty, but an escalating fixed 10-word set can still feel like repeated failure. In the supported review of *could*, the draft written groups appeared as `c | ould` and correct spelling was visible only after a wrong answer, which is appropriate; the synthetic attempt `speling` produced appropriately generic “a few letters need another look,” not a fictitious phoneme diagnosis.

**Fix:** Start with a short mixed sample, then adapt the remaining diagnostic items to demonstrated ability, with optional “I'm not sure,” no shame, and a whole word replay. Build genuinely word-specific, linguistically reliable explanations when the spelling error is identifiable. Keep selected visual groups separate from spoken phoneme instruction.

### P1 — Family registration needs progressive steps for the adult
Family sign-up is **2863px** tall at 390px width. The form is reasonably clear and illustrated avatar tiles look good, but the adult must scroll through the entire profile, access code, account-password and consent flow to find Create. Parent/guardian consent is properly an adult action, not a child's choice.

**Fix:** Use two short stages: *About the learner* (nickname, age, avatar) and *Parent/guardian access & consent* (invitation, credentials, assurances). Do not ask the child to read or complete the adult setup. The code and adult-only controls must remain enforced at the backend.

### P2 — Privacy and wording consistency
The guest player still says “profiles and birth month/year stay in this browser” and describes an “age/year-based starting point,” although its new form asks for **age only** and placement was intentionally made independent of chronological age. This is stale wording and undermines trust. The browser has no horizontal overflow at 390px, which is positive.

**Fix:** Remove old birth-month and age-as-ability copy. Say “age changes appearance, while the spelling assessment determines where learning starts.” Remove staging/developer terminology from child-visible sections.

## Suggested acceptance criteria
1. A 390px phone opens the active spelling word with the main answer field, voice control and primary action reasonably near the visible viewport; no multi-screen scrolling to submit every word.
2. All main instructions understandable through natural narrated speech without needing to read a long paragraph.
3. Single active audio source; welcome prompt shortened; audio buffering has explicit friendly feedback and accessible replay.
4. Actual, not merely simulated, tablets/phones confirm female-presenting UK/neutral narrator is warm, clear, unhurried and consistent.
5. A nine-year-old tester can independently locate Replay, I'm not sure, Check spelling and Retry without reading an adult explanation.
6. Guardian account creates a nine-year-old nickname profile and persists its ten assessment answers, personal grouping and lesson progress across sign-out/re-login and two devices.
7. Scheduled 1-, 7- and 28-day independent checks mark nonattendance **missing**, not wrong.
8. Independent consent, privacy review and guardian authority remain distinct; no child's diagnosis/research information requested during this pilot.

## Positive observations
- The fantasy library, illustrated avatar and consistent yellow/purple palette are coherent and visually inviting, with no horizontal scroll at 390px.
- Answer entry fields are large and visually distinct.
- Main purple/yellow action buttons are typically at least 48px high; the primary issue is vertical position, not their size.
- Spoken word replay, opt-out/unsure controls and optional learner-edited written chunks are present.
- No comparative marks, leaderboards or grades are shown in the assessment flow.
- Visual spelling groups are not played as invented isolated sound units.

## Evidence provenance / recordings
- Browser walkthrough and screenshot artifact: https://github.com/alihoco/spellquest-staging/actions/runs/44543522285
- Real MP3 voice latency and durations: https://github.com/alihoco/spellquest-staging/actions/runs/44543912643
- External guardian API and invitation protection check: https://github.com/alihoco/spellquest-staging/actions/runs/44542366297
- These findings are **a simulated usability inspection**, not real child-user evidence and **not a measured dyslexia teaching outcome**.

## Next improvement wave
**First:** Simplify the mobile game layout and fix assessment-to-profile binding. **Second:** Shorten, segment and proof-listen the natural UK narrator and consolidate voice controls. **Third:** Simplify guardian registration and complete real-device multi-session tests with adult supervision. Only then recruit actual children for structured qualitative sessions with their guardians and explicit permission.

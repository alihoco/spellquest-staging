# Spellmaster — pilot usability corrections and verification

**19 November 2026 · staging release**

## Implemented

| Pilot concern | Change made | Verification |
| --- | --- | --- |
| Mobile learner has to scroll past fantasy panels | Dedicated active-lesson styling collapses hero, character, path and sidebar; scroll resets on entering tasks; sticky primary activity controls | 390 × 844 simulated mobile browser |
| Hard-to-find Play and profile setup | Initial unregistered profile form moved above extra material; early prominent Start spelling control; scroll resets after creating first profile | Browser: guest profile nickname field top **463px**, Play top **540px** |
| Fixed 10-word diagnostic that can feel punishing | Ten turns now adapt after three mixed sound-only probes; later questions selected from the learner's actual independent spellings, never chronological age | Automated adaptive policy tests and full 10-turn browser simulation |
| Baseline orphaned after guest diagnostic | First locally created explorer receives the unassigned ten-word result and provisional placement only when ownership is unambiguous; does not merge sibling histories | Regression and live browser audit, `transferredGuestBaseline=true` |
| Long narrator welcome | Welcome voice script shortened, word audio stays separate, friendly “preparing” status retained | Real TTS MP3 length **24.6 seconds → 7.4 seconds**; network download in two separate samples **~4.96s → ~2.81s**; these are not stable timing guarantees |
| Too many and too-small read buttons | One small visible speaker per suitable section heading, 44×44px interactive target; heading speaker now reads adjacent short instructions, not only the title | JS tests and compact mobile screenshots |
| Narrator controls occupy valuable space | Voice/pace options behind collapsible details while active; main word replay stays visible | Live browser game screenshots |
| Repeat failure gives wordy, repeated advice | Written-letter feedback now shorter, target word remains visible only during supported study, learner can still adjust written groups | Browser after deliberately incorrect `speling`, no invented phoneme explanations |
| Incorrect review button emphasis | `Hide it and try spelling` now first and primary; Hear lesson again and Save for later secondary | Browser `primaryReviewAction` and successful full retry |
| Overlong family registration | Split into a child's nickname/age/avatar step and an adult invitation/consent/password step | Live browser verified stage-two visibility |
| Stale statements implying age chooses skill or requiring DOB | Updated guest and child copy; age changes presentation, actual spelling changes provisional ability level; no child's DOB needed | Source and regression tests |
| User-defined visual groupings and scientific measurement | Existing saved grouping, independent recall, opt-in adult research tracking and consent restrictions preserved unchanged | Application tests |

## Measured changes at 390 × 844 (simulated, audio intentionally blocked)

| Screen | Original full document height | Updated height |
| --- | ---: | ---: |
| 10-word assessment question | 1,008px | **844px** |
| Active spelling question | 1,805px | **844px** |
| Supported word-review screen | 2,330px | **1,095px** |
| Guest landing before creating a profile | 2,762px | **1,702px** |
| Guardian sign-up first screen | 2,863px | **1,691px** |

Mobile pages showed no horizontal overflow. The final landing and review screens may still scroll, but the primary spelling field and controls are accessible without scrolling past the decorative content. Voice loading status and failures in the simulated screenshots were artificially induced by the browser harness, not evidence of a live TTS outage.

## Technical testing
- Ten-answer simulated assessment; adaptive word sequence changed as the synthetic learner got words wrong
- Saved the complete assessment, transferred it to the first local learner and excluded possible sibling mixing
- Simulated wrong answer followed by written review and successful independent retry
- Confirmed primary action position and accessibility on a 390px phone
- Confirmed two-step guardian form and adult-only confirmation requirements
- Ran source and automated regression tests successfully
- Confirmed live AI narrator returns MP3 for the requested welcome and whole word

## Evidence and links
- [Original UX audit](SIMULATED_NINE_YEAR_OLD_UX_AUDIT_2026-11-19.md)
- [Successful repeat mobile/desktop browser audit](https://github.com/alihoco/spellquest-staging/actions/runs/44549393775)
- [Real voice timing and MP3 samples](https://github.com/alihoco/spellquest-staging/actions/runs/44549199943)
- [Application regression suite](https://github.com/alihoco/spellquest-staging/actions/runs/44549764756)

## Remaining acceptance testing that cannot be simulated
1. Listen to the actual AI-generated Marin voice on iPhone, Android and tablet and judge accent, intelligibility, volume, prosody and pacing.
2. Observe real children (with guardian permission and appropriate supervision) identifying the next step, correcting spelling and using the optional dividers. A scripted browser cannot reproduce frustration, distraction or fatigue.
3. Verify private family accounts and 10-word baseline persistence across different real devices after sign-in; backend synthetic tests exist but this is not a completed human-device acceptance test.
4. Future research must separately validate durable independent spelling; visual groupings are optional memory prompts, not certified spoken sound segments.

**Status:** Pilot UX changes deployed to staging, subject to the remaining real-person acceptance work; no claim of clinical efficacy or scientifically validated word-specific phonics.

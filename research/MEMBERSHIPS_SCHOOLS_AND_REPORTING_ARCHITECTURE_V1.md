# Spellmaster subscriptions, school access, teacher reporting and progress identity — architecture v1

Date: 18 November 2026
Status: **Staging UX previews and permission-policy code only.** No production authentication, central progress database, live school reporting, payment provider, or real subscriptions yet.

## Memberships and school boundary

- Personal: £10/year, exactly one learner. Guardian may manage a child account; a child does not need an email.
- School 30: £50/year, up to 30 **active distinct pupil IDs** belonging to one institution.
- School Unlimited: £100/year, unlimited pupils **within one authenticated school tenant**, not a multi-school group licence.
- Teacher roles/admin staff accounts do not consume pupil seats. A learner present in multiple classes occupies one seat.
- Annual price is the user-approved target, but VAT treatment, legal terms and auto-renewal policy need validation before launch.
- Every learner gets the same core pedagogical tools. Schools add staff management, class reporting and administration.

## Core secure identity and tenancy

Relational entities: `account`, `verified_adult_auth_identity`, `learner`, `guardian_learner`, `school`, `school_subscription`, `school_staff`, `classroom`, `class_assignment`, `class_enrolment`, `login_session`, `spelling_attempt`, `word_progress`, `strategy_preference`, `lesson_event`, `coin_ledger`, `avatar_inventory`.

- Random, stable `learner_id` provides progress continuity; legal full name is not required in learner play UI.
- School admin, assigned teacher, authorised guardian and individual owner receive *different scopes*. Never infer authorisation from a client-supplied school/class ID alone.
- Child sign-in may use a school-issued, rate-limited access mechanism or guardian-managed profile switch; assess school-shared devices, credential theft, account enumeration and safer access options before production.
- Adult and staff login should use reputable authentication, secure server sessions, verification, recovery and audit logs; no localStorage access token as a substitute for actual authorisation.
- `core/membership-access-policy.cjs` is a **pure decision policy**, not an actual access-control system: every data read must still be checked by a production server.

## Central progress tracking and genuine personalisation

Keep append-only, time-stamped spelling attempts. Each event minimally records:
`learner_id`, `word_id`, `lesson_id/version`, `observed_at`, `phase`, `independent`, `correct`, `support_level`, `error_category`, `strategy_id`, `review_due`, `input_mode`.

Maintain separately:
- **Starting point**: placement-assessment evidence, date, initial word/pattern band, appropriate uncertainty.
- **Current position**: independent accuracy, word/pattern mastery *only after delayed unaided recall*, recent supported success and next due date.
- **Personal strategy choices**: approved teacher word grouping; optional learner-selected visual boundary positions, prior use and revision; never mislabel them as phonemes/syllables.
- **Adaptation trail**: when and why words, explanations, reviews, input modes or support were selected; keep choices revisable instead of fixed learner-style labels.
- **Reward inventory**: coins, owned cosmetic items and Word Vault states, independent of actual spelling retention.
- **Past-to-present progress**: compare suitable evidence on equivalent word difficulty and independent recall; do not simply compare easy first words against harder later words.

The present `year6.html` and `learner-profiles.js` implement **local-browser pilot history only**. `core/age-sensitive-onboarding.cjs` and `core/teaching-engine.cjs` are *headless design modules* not fully wired to the staging learner UI. A robust database and secure cross-device profile syncing remain to implement. Never describe local profiles as secure logins.

## School/teacher reporting

The **school** dashboard should show:
- school active pupil seats vs allowance and authorised teacher/class counts;
- class overview, participation in chosen reporting period, due reviews, aggregated independent recall statistics;
- pupils needing additional attention based on observable spelling attempts (not disability/ability ranking);
- pupil drill-down: starting assessment, independent spelling over time, patterns needing teaching, support strategies offered/chosen, retained words, words due next and Word Vault state;
- carefully interpreted progress trends, based on comparable tasks and time windows, without ranking children against peers.
- aggregated school reports should use thresholding to prevent re-identification in small cohorts; exports audited and permission-checked.
- staff access limited to assigned classes; school admin access limited to same tenant; guardian access limited to linked learner.
- `teacher-report-preview.html` intentionally contains **fictional sample pupils and statistics** and does not read data from the browser or server.

## App and billing readiness

Shared server APIs and native packages for iOS/Android can reuse the same responsive teaching experience. However:
- Apple requires in-app purchase for many consumer digital subscriptions; its enterprise/student access exception may apply to school-only organisational sales in appropriate app configurations. Apple also restricts repackaged websites that add little native utility.
- Google Play also normally requires its billing system for digital features purchased in-app, subject to specific exceptions.
- Build checkout channel rules deliberately; do not assume the £10 website price is the exact final in-app price after platform fees/tax.
- App Store developer account, Google Play Console, build signing keys, privacy disclosures, child-directed safeguards, release verification and store review remain deployment requirements.
- Source: https://developer.apple.com/app-store/review/guidelines/ and https://support.google.com/googleplay/android-developer/answer/18265346?hl=en-GB

## Staging UX

- `/welcome.html`: planned personal/school pricing and roles; no functional sign-in or payment collection.
- `/teacher-report-preview.html`: teacher-report sample built from fictional pupils, selectable classes/periods and a drill-down example.
- `/year6.html`: current learner pilot with browser-only progress.
- No public account forms should collect real child or school data until verified server-side permissions and DPIA.

## Release gates before charging schools or parents

1. Complete data protection assessment (UK Children's Code, DPIA, lawful basis, school-controller/processor allocation, contracts, retention/deletion and research consent boundaries).
2. Implement vetted auth and school tenant isolation on API and database; security reviews including horizontal privilege escalation testing.
3. Connect adaptive learning event writes, data migrations, accurate delayed-recall measures, guardian roles, and full device-sync/restore.
4. Implement subscription provider, secure webhooks, idempotent renewals, billing entitlements, cancellation/charge handling and pricing clarity.
5. Validate reporting with educator testing and accessibility/child privacy review before exposing any class/pupil data.
6. Native-app billing and store policy review, signing, and distribution if shipping mobile apps.

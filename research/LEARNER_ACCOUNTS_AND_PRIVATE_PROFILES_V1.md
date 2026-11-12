# Spellmaster pseudonymous learner identity and adaptive progress — v1

Date: 12 November 2026
Status: architecture & safeguarding specification. **Not an operational authentication system.**
Scope: account required before finished/production learning experience, separated from current developer testing/demo.

## Product rule
A learner gets a private, durable account with a random opaque `learner_id`. The app requires **birth month and year** for age-respectful presentation and initial assessment placement, but does not require the learner's legal name, full birth date, personal email address, school, home address, or precise location for routine spelling lessons. Nickname/avatar may be optional and must not be public-facing. We never promise literal anonymity: persistent IDs, access tokens, device/IP logs and detailed learning records can be **pseudonymous personal data**.

Account creation must be **safe and friction-light**, but not a toy authentication implementation:
- Adult: age-appropriate private account with secure passwordless or vetted authentication.
- Child: guardian-managed account, with optional multiple child aliases under a parent account and safe switching. Children do not need their own personal email.
- Decide how age-appropriate protections/age assurance will apply. May apply highest child-privacy protections to all profiles rather than collecting birth dates, but under-13 parental-authorisation requirements still need an appropriate lawful basis/age handling.
- Local dev/test demo can remain gated behind admin/test access until production identity is ready. Do **not** add a fake "account" using only localStorage and mistake it for secure cross-device identity.

## Recommended data architecture

### Identity (separate access-control table/service)
`account_id` random identifier, `auth_provider_subject` or hashed login credential, guardian relationship, `created_at`, `security_version`, status. Encrypt at rest, restrict access, use secure HttpOnly cookies or equivalent vetted session management. Never expose privileged bearer secrets in the browser.
Children should have distinct learner IDs and scoped guardianship; family accounts never share learning scores across siblings.

### Learner record
`learner_id` opaque random UUID, `account_id` reference, `display_nickname_optional`, `privacy_profile_version`, `consent_or_lawful_basis_metadata`, `preferred_input`, `preferred_voice`, `pacing_preference`, `last_seen_at`. Store encrypted month/year of birth (YYYY-MM) with restricted guardian access, or a minimally sufficient age-band derivation where possible. No diagnosis required. Do not infer diagnosis, intelligence, personality or neurocognitive traits.

### Spelling attempt (append-only, minimally necessary)
`attempt_id`, `learner_id`, `word_id`, `lesson_version`, `timestamp`, `attempt_index`, `phase` (baseline/retry/delayed), `input_mode`, `independent`, `correct`, `error_category` (reviewed rule or unknown), `assistance_level`, `strategy_id`, `duration_band_optional` (not an ability grade), `word_status_before/after`. Prefer error categories and correct-answer status rather than retaining raw misspellings or audio by default.

### Learner pattern (derived, revisable)
Per pattern `skill_id`, `opportunities`, `unaided_correct`, `delayed_correct`, `last_observed`, `confidence` or uncertainty estimate, `learning_stage`, `next_review_due`. Derived stats are informative, **not** a medical or learning-style diagnosis.

### Teaching effect (experimental or descriptive)
Per strategy `strategy_id`, `word_family`, `sessions`, `independent_retained`, `support_level`, `comparability/assignment_metadata`. Attribute which explanations or activities were offered. Never claim a technique caused better learning based on a few non-randomised trials. Retention at 7/28 days (when available) is preferred to immediate response.

### Word Vault (separate from mastery)
`discovered`, `collected_unconfirmed`, `protected_delayed`, `recovery_quest`, `enduring_mastery`. The narrative never removes a previously earned trophy. If a word is missed later, the learner can go on a recovery quest; scoring still records the true retention outcome.

## Processing boundaries & child protections
- **UK Children's Code:** perform DPIA, use high-privacy defaults, data minimisation, no public rankings, ads targeting, geolocation or unnecessary sharing. ICO guidance normally expects profiling off by default unless a compelling best-interests reason and effective safeguards is demonstrated. Personalised educational adaptation must be assessed explicitly before enabling automatic profiling for children.
- **Lawful basis/guardian permissions:** secure legal assessment before production. For online services relying on consent, under-13 children generally need parental authorisation in the UK. Ensure guardian controls are transparent and child-sensitive.
- **Research separate:** study enrolment, randomised A/B/C comparisons, exports and any sharing with researchers require separate approved ethics/data processing pathways; routine learning data must not silently become research-consented data.
- **Privacy features:** short plain spoken child/parent privacy explanation, guardian dashboard, download/export and delete, retention limits, access review, incident process, processor agreements, rate limits, access auditing.
- **No voice recording storage** by default. Do not process special-category health/disability data without necessity and suitable legal basis.
- **No fixed learner types:** EEF learning-styles review finds insufficient evidence for labelling visual/auditory learners; only adapt from individual observed independent spelling outcomes, uncertain and revisable.
- Avoid relying on IP location or persistent fingerprints to identify learner.

## Account UX concept
1. Parent/guardian chooses "Create a learner" or adult selects own account. Approved privacy notice before account creation.
2. Secure guardian sign-in (email, passkey or passwordless as appropriate; no child email required). Invite child to choose optional avatar and pseudonym.
3. Learner clicks avatar -> one large **Start adventure** control -> spoken lesson, not login jargon.
4. Parent/guardian may view progress, adjust privacy and reminders, export/delete, or authorise optional research separately.
5. Each learner profile owns its own due queue and adaptive spelling feedback, independent of browser.

## Implementation phases and release gates
- Phase 0: design schema, application threat model, lawful basis/DPIA, consent model, account recovery.
- Phase 1: vetted authentication, server-side session/role checks, pseudonymous learner IDs, parent/child isolation, minimal event persistence.
- Phase 2: integrate existing `core/review-scheduler.cjs`, `core/adaptive-word-intake.cjs`, diagnostic feedback and Word Vault with server-side learner-specific data.
- Phase 3: child-safe learning analytics, learner/guardian progress views, controlled reminders.
- Phase 4: optional ethically reviewed method comparison with guardian consent/learner assent and pseudonymous study dataset.

**Security acceptance:** unauthorised users cannot enumerate profiles or read another learner's results; cross-device retrieval requires verified authentication; no publicly discoverable profile URL; revocation and deletion tested. **Teaching acceptance:** baseline, helped, first-try and delayed mastery distinct, and no inference of fixed cognitive style.

## Sources
- ICO Children's Code: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/
- UK GDPR children's consent: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/consent/what-is-valid-consent/
- EEF learning styles: https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/learning-styles/


## Age-respectful appearance and diagnostic placement (updated 12 November 2026)

**Confirmed requirement:** Guardian or adult learner supplies birth month and birth year, without full birthday. This is a purposeful minimum personal datum to guide the *starting assessment* and to age the UI theme gracefully. It is still pseudonymous personal data; month/year alone must not be claimed anonymous. Limit access to birth metadata, prevent exposure in public URLs or analytics, and apply appropriate age-sensitive privacy protections and deletion controls.

**Presentation maturity differs from spelling achievement.** A 12-year-old learning early spelling patterns must see age-respectful graphics and language, while a six-year-old spelling advanced words must not be forced into an older-looking interface. Gradually introduce more mature theme suggestions around age bands, without a sudden birthday restyle. Give guardian/learner an appearance override.

**Initial diagnostic, not a ceiling:** use age to choose an approximate starting point on the England phonics/spelling progression, then rapidly move up/down from independent results. A typical six-year-old begins at **Year 1–2 patterns** rather than Year 4–5 or Year 5–6; more advanced words follow if early examples are clearly known. Year 4–5 and Year 5–6 are possible later samples, not assumptions made on one answer. Exact school year is not reliably inferred from birth month alone because of academic-year boundaries, moving schools, local variation and individual differences. The engine can start with a short, audio-led sample and use observed results to place the learner; ongoing teaching always remains ability-based rather than age-limited.

**Implementation:** [../core/age-sensitive-onboarding.cjs](../core/age-sensitive-onboarding.cjs) and [tests](../core/age-sensitive-onboarding.test.cjs) implement a *headless pilot policy*, not an actual account form or a validated placement test. The current Year 6 staging game remains for developer testing; it must not become the default onboarding lesson for a young learner. Birth month/year cannot uniquely establish exact age in years because no birth day is collected; approximate age is sufficient for visual themes and broad initial placement. Never use inferred age alone as a diagnosis or fixed ability label.

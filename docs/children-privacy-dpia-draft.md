# Spellmaster — Children's data protection impact assessment (DPIA), working draft

**Status:** Open for controller review. Not an approved compliance determination or final privacy notice.
**Scope:** UK voice-led spelling service, primarily for children aged 4–16, with adults and schools in later phases.
**Sources:** ICO Children's Code standards: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/code-standards/ ; ICO special-category guidance: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-are-the-conditions-for-processing/

## Purpose and data
- Account: adult-managed username, salted password hash, hashed recovery code, session hash, creation and consent timestamps.
- Child profile: nickname, optional birth month/year for age-respectful visual presentation; avatar, theme and spelling history. No child email or full date of birth.
- Learning events: chosen curriculum word, independent attempt outcome, pattern support and revision schedule; never academic peer comparisons or ranking.
- Special-category/sensitive fields: voluntarily selected diagnosed/suspected neurodivergent conditions in dedicated restricted tables.
- Optional analytics: aggregated efficacy by condition status only when separately opted in, with disclosure controls. No individual condition information in teaching event payloads or generic reports.
- Audio service: generated speech from a fixed allowed curriculum word list; no learner personal details required in audio requests.

## Baseline data protection
1. High-privacy defaults; no marketing, advertising, peer leaderboards or public learner profiles.
2. Account controls restricted to adult or verified guardian, with child-friendly learner access planned.
3. Consent for individual support and aggregated analysis independently optional; record consent text version and time. Permit straightforward withdrawal and erase selected special-category records.
4. Keep passwords and database connection details server-side; never store them in browser localStorage, GitHub, analytics or logs.
5. Unique identifier per learner; server checks account ownership on every learner read and write.
6. No collection of real child medical or learning data until end-to-end testing, documentation and guardian-authority process are approved.
7. Data export and deletion options; document database-backup retention and right-to-erasure operations before public release.
8. Limit retention and delete expired sessions and obsolete profiles after a published schedule is decided.
9. Document lawful Article 6 basis and additional Article 9 condition for each special-category use before processing; explicit consent must be separate and withdrawable.
10. Apply children's design standards by default to everyone if age confidence is inadequate.

## Risks and mitigations
| Risk | Mitigation | Residual status |
| --- | --- | --- |
| Unauthorised person claims guardianship | Guardian-account declaration alone is not independent verification. Need proportionate parent/guardian assurance or controlled invitation/verification process before registration opens | OPEN |
| Unintended disclosure of diagnoses | Separated database records, account-owner scoped reads, no conditions in teaching events, private opt-ins | Needs penetration and privacy test |
| Child data accessible on shared device | Tab-scoped session, explicit sign-out clears cached learner profile. Avoid persistent long-lived browser credentials | Needs device testing |
| Browser-side token theft or injected scripts | Strict CSP, dependency review, future same-origin HttpOnly secure cookies, XSS audit | OPEN |
| Misleading consent or data-use description | Publish plain-language privacy notices, controller identity, contact details, data-subject rights and withdrawal explanation | OPEN |
| Re-identification via small analytics groups | Minimum group thresholds, suppression, consent-filtered aggregation, privacy review before any reports | OPEN |
| Exposure in backups | Document Render backup, retention and restore/delete procedures | OPEN |
| Lost account credentials | One-time secret recovery code, hashed in database, reset revokes all sessions | Code delivered, not fully end-to-end tested |
| Forgotten learner account | Guardian-facing export, profile deletion and whole-account deletion, subject to backup retention | Code delivered, needs device test |
| Language/age mismatch | Age affects theme/tone only; performance-based assessment sets learning path | In implementation |
| Website goes down or sync conflicts | Revisioned learner state, client failure notice, DB backups and restore test | Needs device test |

## Decision gates
**DO NOT set `ACCOUNT_REGISTRATION_ENABLED=true` until:**
- controller identity, privacy and terms published; DPIA reviewed and approved
- verification of adult/guardian authority for child profiles proportionate to risk
- special-category lawful bases/conditions and explicit consent checked with UK privacy advisor
- account recovery, cross-device progress, sign-out, export, deletion and consent withdrawal tested against dedicated database
- shared-device isolation and rate-limit penetration testing passed
- data retention, backup restoration and breach response documented
- accessibility test with learners, including optional audio instructions
- real payments are separately and transparently introduced if ever enabled

**Current policy:** Public registration OFF; only synthetic transient smoke-test data is permitted before review.

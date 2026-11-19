# Spellmaster secure accounts: controlled rollout

## What is implemented
- Guardian or adult credentials, salted scrypt password hashes, random session token hashes.
- Individual learner profiles and avatar/theme with optional birth month only.
- Separate, consent-controlled condition records (diagnosed/suspected); optional analysis consent tracked distinctly.
- Account-scoped access for all learner reads/writes.
- Initial ten-word assessment events, provisional placement and revisioned learner state.
- Existing adaptive learning player reads/writes signed-in learner state in sessionStorage while guest sessions remain local.
- £10/year personal plan metadata, one-month trial, **no billing, card handling, or automatic charge**.

## Prerequisites before enabling registration
1. Have the owner confirm the correct Render workspace and service, and provision managed PostgreSQL with encrypted backups. Prefer private networking and a UK/appropriate region; document any international transfers.
2. Run `database/001_accounts.sql` against the empty database using a restricted migration credential. Use a different least-privilege runtime role.
3. Set `DATABASE_URL` only in the private backend environment, never in GitHub or browser assets. Configure TLS appropriately; validate the certificate for external connections.
4. Leave `ACCOUNT_REGISTRATION_ENABLED=false` until readiness checks, privacy documents and guardian safeguards have been reviewed.
5. Deploy the backend (Node >=20 with `npm install`) and static frontend from the same repository. The frontend calls the existing speech backend on `spellquest-voice-staging.onrender.com`.
6. Publish age-appropriate privacy information, data-controller identity, retention schedule, contact method, terms, and a clear withdrawal/deletion path. Conduct and document a children's-data DPIA before onboarding real children.
7. Confirm granular special-category processing consent, adult/guardian verification approach, backups, restore test, access logs, incident procedures and cross-device conflict experience.
8. Prefer same-origin auth proxy + Secure HttpOnly SameSite cookies before production release. The current staging code uses short-lived tab-scoped bearer sessions.
9. Verify live /api/account/status returns `{"available":true}` only once registration is approved and DB schema is available, then manually exercise registration -> sign-in -> sign-out -> second device -> assessment -> adaptive game -> persistence -> guardian isolation.
10. Only then set `ACCOUNT_REGISTRATION_ENABLED=true`. No payment activation is included.

## Important limitations still to resolve before collecting real pupil data
- Password recovery, account closure/export and a full withdrawal preferences screen need finishing.
- Actual guardian authority is currently self-declared, not independently verified.
- Consent UI needs final organisation identity and published privacy/terms documents.
- Current browser games have not completed device/browser acceptance tests; protect against simultaneous device use.
- Extra privacy protections and durable audit logs are needed before real pupil/diagnosis data.
- No subscription payment processor is connected, and the £10 plan does not bill automatically.
- Ensure all future analytics use consented, aggregated results; prevent exposing individual health/condition attributes.
- Keep staging behind an invitation-only testing programme until the above is resolved.

## Test process
`npm install`, `npm test`, `node --check server.js`, `node --check account-api.js`, `node --check cloud-learning.js`.
Automated GitHub Action checks are defined in `.github/workflows/check.yml`.
No production migration or infrastructure provisioning should occur without confirming the target deployment workspace.

-- Spellmaster accounts v1. Run against a private managed PostgreSQL instance.
CREATE TABLE IF NOT EXISTS accounts (
 id uuid PRIMARY KEY,
 username varchar(50) NOT NULL UNIQUE,
 password_hash text NOT NULL,
 kind varchar(12) NOT NULL CHECK(kind IN ('adult','guardian')),
 created_at timestamptz NOT NULL DEFAULT now(),
 accepted_terms_at timestamptz NOT NULL DEFAULT now(),
 disabled_at timestamptz
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash char(64) PRIMARY KEY,
 account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_account_idx ON sessions(account_id);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS learners (
 id uuid PRIMARY KEY,
 account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
 alias varchar(32) NOT NULL,
 is_child boolean NOT NULL DEFAULT false,
 birth_month char(7),
 avatar varchar(24) NOT NULL DEFAULT 'fox',
 theme varchar(24) NOT NULL DEFAULT 'auto',
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT birth_month_format CHECK (birth_month IS NULL OR birth_month ~ '^(19|20)[0-9]{2}-(0[1-9]|1[0-2])$')
);
CREATE INDEX IF NOT EXISTS learners_owner_idx ON learners(account_id);
CREATE TABLE IF NOT EXISTS learner_conditions (
 learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
 condition_code varchar(48) NOT NULL,
 report_status varchar(12) NOT NULL CHECK(report_status IN ('diagnosed','suspected')),
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(learner_id,condition_code)
);
CREATE TABLE IF NOT EXISTS learner_preferences (
 learner_id uuid PRIMARY KEY REFERENCES learners(id) ON DELETE CASCADE,
 choice varchar(20) NOT NULL DEFAULT 'not_supplied' CHECK(choice IN ('selected','none','unsure','prefer_not_to_say','not_supplied')),
 support_consent_at timestamptz,
 analysis_consent_at timestamptz,
 consent_text_version varchar(24),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS learner_events (
 id uuid PRIMARY KEY,
 learner_id uuid NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
 event_type varchar(40) NOT NULL CHECK(event_type IN ('assessment','spelling_attempt','review','award','sprint')),
 payload jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK (jsonb_typeof(payload) = 'object')
);
CREATE INDEX IF NOT EXISTS learner_events_by_learner ON learner_events(learner_id,created_at DESC);
CREATE TABLE IF NOT EXISTS learner_state (
 learner_id uuid PRIMARY KEY REFERENCES learners(id) ON DELETE CASCADE,
 state jsonb NOT NULL DEFAULT '{}'::jsonb,
 version bigint NOT NULL DEFAULT 0,
 updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK (jsonb_typeof(state) = 'object')
);
-- All learner reads/writes must be scoped to account_id in application queries.
-- Never add condition data to exported teaching-event payloads.

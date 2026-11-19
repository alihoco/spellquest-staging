-- Optional research consent is separate from diagnosis-related consents and routine learning support.
ALTER TABLE learner_preferences
  ADD COLUMN IF NOT EXISTS grouping_research_consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS grouping_research_consent_version varchar(24);
-- No research consent is inferred for existing learners.

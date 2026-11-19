-- Store only declared age in completed years for invited child learner profiles.
-- No birth date or birth month is necessary for the guardian pilot.
ALTER TABLE learners ADD COLUMN IF NOT EXISTS age_years smallint;
ALTER TABLE learners ADD CONSTRAINT learners_age_years_range CHECK (age_years IS NULL OR age_years BETWEEN 4 AND 17);
ALTER TABLE learners ADD COLUMN IF NOT EXISTS guardian_pilot_consent_at timestamptz;
ALTER TABLE learners ADD COLUMN IF NOT EXISTS guardian_pilot_consent_version varchar(24);
-- Existing adult accounts and children created before this pilot are unchanged.

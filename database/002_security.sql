-- Spellmaster account security v2. Idempotent upgrades to existing dedicated database.
CREATE TABLE IF NOT EXISTS recovery_codes (
 account_id uuid PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
 code_hash char(64) NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 redeemed_at timestamptz
);
CREATE TABLE IF NOT EXISTS account_security_audit (
 id uuid PRIMARY KEY,
 account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
 action varchar(32) NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_account_time ON account_security_audit(account_id,created_at DESC);

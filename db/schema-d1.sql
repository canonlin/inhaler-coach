-- Cloudflare D1 (Serverless SQLite) Schema for inhaler-coach LINE Module
-- Generated for Cloudflare Free Tier (5M reads/day, 100k writes/day, 5GB storage)

-- ── patients & LINE consent ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patients (
  id           TEXT PRIMARY KEY,
  mrn_hash     TEXT NOT NULL UNIQUE,
  mrn_tail     TEXT NOT NULL,
  age_band     TEXT NOT NULL,
  consent_line INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS line_identities (
  id           TEXT PRIMARY KEY,
  patient_id   TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  line_user_id TEXT NOT NULL UNIQUE,
  added_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS line_deliveries (
  id           TEXT PRIMARY KEY,
  patient_id   TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  line_user_id TEXT NOT NULL,
  case_id      TEXT,
  touch        TEXT NOT NULL,
  sent_on      TEXT NOT NULL,
  kind         TEXT NOT NULL CHECK (kind IN ('push', 'reply', 'welcome')),
  channel      TEXT NOT NULL DEFAULT 'recording' CHECK (channel IN ('live', 'recording')),
  payload      TEXT NOT NULL DEFAULT '{}',
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (line_user_id, touch, sent_on)
);

CREATE TABLE IF NOT EXISTS line_events (
  id            TEXT PRIMARY KEY,
  patient_id    TEXT REFERENCES patients(id) ON DELETE SET NULL,
  line_event_id TEXT UNIQUE,
  event_type    TEXT NOT NULL,
  step_code     TEXT,
  payload       TEXT NOT NULL DEFAULT '{}',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS line_medications (
  id          TEXT PRIMARY KEY,
  patient_id  TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('maintenance', 'rescue')),
  drug_id     TEXT NOT NULL,
  drug_name   TEXT NOT NULL,
  device_line TEXT NOT NULL CHECK (device_line IN ('MDI', 'DPI', 'SMI')),
  ics         INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (patient_id, role)
);

CREATE TABLE IF NOT EXISTS admin_config (
  config_key   TEXT PRIMARY KEY,
  config_value TEXT NOT NULL,
  updated_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by   TEXT DEFAULT 'admin'
);

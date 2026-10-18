-- inhaler-coach v2 · unified schema
-- Replaces three incompatible wide-table shapes and three Apps Script endpoints
-- with one normalized store. See docs/superpowers/specs/2026-10-09-v2-unified-platform-design.md

-- ── patients ────────────────────────────────────────────────────────────────
-- The medical record number never leaves the server. mrn_hash is a salted
-- SHA-256 used only for lookup and dedupe; mrn_tail is the last 2 characters
-- and is what screens display.
CREATE TABLE IF NOT EXISTS patients (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mrn_hash     text NOT NULL UNIQUE,
  mrn_tail     text NOT NULL CHECK (char_length(mrn_tail) BETWEEN 1 AND 4),
  study_id     text UNIQUE,
  age_band     text NOT NULL CHECK (age_band IN ('未滿18歲', '18-64歲', '65歲以上')),
  sex          text CHECK (sex IN ('男', '女')),
  diagnosis    text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── cases ───────────────────────────────────────────────────────────────────
-- One row per pharmacy case. step results, knowledge answers and clinical
-- measures live in their own tables so a new device adds steps, not columns.
CREATE TABLE IF NOT EXISTS cases (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  case_date         date NOT NULL,
  timepoint         text NOT NULL CHECK (timepoint IN ('M0', 'M1', 'M3')),
  qcc_stage         text NOT NULL CHECK (qcc_stage IN ('改善前', '改善後')),
  campus            text NOT NULL CHECK (campus IN ('虎尾', '斗六')),
  pharmacist        text NOT NULL,
  device            text NOT NULL CHECK (device IN ('MDI', 'RSP', 'ELP', 'BRZ')),
  drug              text NOT NULL,
  has_ics           boolean NOT NULL DEFAULT false,
  needs_shake       boolean NOT NULL DEFAULT false,
  case_type         text CHECK (case_type IN ('初診衛教', '複診回測')),
  education_minutes integer,
  prior_education   text CHECK (prior_education IN ('有(院內)', '有(院外)', '無')),
  usage_duration    text CHECK (usage_duration IN ('初次使用', '<1個月', '1-6個月', '>6個月')),
  referral_source   text CHECK (referral_source IN ('胸腔科轉介', '櫃台調劑藥師', '其他')),
  context           text CHECK (context IN ('門診', '出院前整合')),
  caregiver_lang    text NOT NULL DEFAULT 'auto'
                      CHECK (caregiver_lang IN ('auto', 'zh', 'tw', 'id', 'vi', 'en')),
  -- Patient factors that change the intervention. Ordered to match FACTORS
  -- in the prototype: hand, cog, vis, care, breath.
  factors           text[] NOT NULL DEFAULT '{}',
  use_qcc           boolean NOT NULL DEFAULT true,
  use_research      boolean NOT NULL DEFAULT false,
  record_id         text UNIQUE,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cases_stage_idx    ON cases (qcc_stage);
CREATE INDEX IF NOT EXISTS cases_date_idx     ON cases (case_date);
CREATE INDEX IF NOT EXISTS cases_patient_idx  ON cases (patient_id, timepoint);
CREATE INDEX IF NOT EXISTS cases_pharmacist_idx ON cases (pharmacist);

-- ── case_steps ──────────────────────────────────────────────────────────────
-- Replaces the 66 步驟_* / 備註_* columns. step_code is the shared spine, e.g.
-- 'MDI_搖'. 'na' means the step does not apply to this drug (no ICS to rinse,
-- solution-type that must not be shaken).
CREATE TABLE IF NOT EXISTS case_steps (
  case_id    uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  step_code  text NOT NULL,
  value      text NOT NULL CHECK (value IN ('正確', '錯誤', 'na')),
  note       text NOT NULL DEFAULT '',
  -- Did the patient actually perform this step in front of the pharmacist?
  -- Hearing it is not the same as being able to do it, and this is the
  -- distinction the whole follow-up design rests on.
  demonstrated boolean NOT NULL DEFAULT false,
  PRIMARY KEY (case_id, step_code)
);

CREATE INDEX IF NOT EXISTS case_steps_code_idx ON case_steps (step_code);

-- ── case_knowledge ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS case_knowledge (
  case_id  uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  q_index  smallint NOT NULL CHECK (q_index BETWEEN 1 AND 10),
  answer   text NOT NULL CHECK (answer IN ('對', '不對')),
  PRIMARY KEY (case_id, q_index)
);

-- ── clinical_measurements ───────────────────────────────────────────────────
-- The numbers a technique score cannot capture: inspiratory flow (In-Check
-- DIAL), CAT, MMRC, ACT, control change, exacerbations, and adherence
-- inferred from the dose counter.
CREATE TABLE IF NOT EXISTS clinical_measurements (
  case_id   uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  kind      text NOT NULL CHECK (kind IN (
              'PIF', 'CAT', 'MMRC', 'ACT',
              '用藥率', '混用警示',
              '上月領藥日', '計數器起始', '計數器今日', '每日噴數',
              '上季急性發作', '上月急診', '上月住院')),
  value     numeric,
  text_value text,
  PRIMARY KEY (case_id, kind)
);

-- ── med_reconciliation ──────────────────────────────────────────────────────
-- Discharge medication reconciliation: 住院前家中使用 vs 出院處方.
CREATE TABLE IF NOT EXISTS med_reconciliation (
  case_id     uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  slot        text NOT NULL CHECK (slot IN ('home', 'discharge')),
  drug        text NOT NULL,
  device      text NOT NULL,
  disposition text CHECK (disposition IN ('繼續用', '新開始', '停止不要再用')),
  PRIMARY KEY (case_id, slot, drug)
);

-- ── physician_queries ───────────────────────────────────────────────────────
-- Drives the 醫師溝通閉環 metrics: 需醫師回應 / 回覆率 / 採納率 / 重複用藥.
CREATE TABLE IF NOT EXISTS physician_queries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  question    text NOT NULL,
  reply       text CHECK (reply IN ('待回覆', '同意並調整', '同意，暫不調整', '不同意')),
  notified_at timestamptz NOT NULL DEFAULT now(),
  replied_at  timestamptz,
  duplicate_flag text
);

CREATE INDEX IF NOT EXISTS physician_queries_case_idx ON physician_queries (case_id);

-- ── sessions / session_stages ───────────────────────────────────────────────
-- AI coaching sessions. This is what the Apps Script `ai_coach_record` call
-- carried: attempts, AI confidence and the pharmacist's own verdict per stage.
CREATE TABLE IF NOT EXISTS sessions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  case_id     uuid REFERENCES cases(id) ON DELETE SET NULL,
  device      text NOT NULL DEFAULT 'MDI' CHECK (device IN ('MDI', 'RSP', 'ELP', 'BRZ')),
  -- Which product the patient practised with. Without it the pharmacist cannot
  -- tell which checklist steps apply, and the camera result is unusable.
  drug        text,
  started_at  timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS sessions_patient_idx ON sessions (patient_id);

CREATE TABLE IF NOT EXISTS session_stages (
  session_id    uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  stage         smallint NOT NULL CHECK (stage BETWEEN 0 AND 4),
  attempts      integer NOT NULL DEFAULT 0,
  ai_confidence numeric NOT NULL DEFAULT 0 CHECK (ai_confidence BETWEEN 0 AND 1),
  pharmacist    text NOT NULL DEFAULT 'not_recorded'
                  CHECK (pharmacist IN ('correct', 'incorrect', 'not_recorded')),
  passed        boolean,
  PRIMARY KEY (session_id, stage)
);

-- ── followups ───────────────────────────────────────────────────────────────
-- Drives the 追蹤清單: tier R/Y/G, due windows, priority P1/P2/P3.
CREATE TABLE IF NOT EXISTS followups (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  case_id     uuid REFERENCES cases(id) ON DELETE SET NULL,
  task        text NOT NULL,
  due_start   date NOT NULL,
  due_end     date NOT NULL,
  priority    text NOT NULL CHECK (priority IN ('P1', 'P2', 'P3')),
  status      text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'done', 'missed')),
  completed_at timestamptz,
  -- Who closed it. A follow-up that nobody can be shown to have actioned is the
  -- same as no follow-up, and that is exactly what the baseline shows.
  completed_by text,
  completed_note text,
  CHECK (due_end >= due_start),
  -- A closed task must say when, and by whom; an open one must not claim to.
  CHECK ((status = 'open') = (completed_at IS NULL))
);

CREATE INDEX IF NOT EXISTS followups_open_idx ON followups (status, due_start);
-- ── LINE ────────────────────────────────────────────────────────────────────
-- Reachability after the encounter. Every table here is written without a LINE
-- account: the recording transport captures the exact payload instead of
-- sending it, so the whole chain is verifiable before launch.

-- Consent lives on the patient, not on the LINE link, so it survives unlinking.
ALTER TABLE patients ADD COLUMN IF NOT EXISTS consent_line boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS line_identities (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  line_user_id text NOT NULL UNIQUE,
  added_at    timestamptz NOT NULL DEFAULT now()
);

-- One row per message the system sent or would have sent. `channel` says which:
-- 'recording' is a dry run, 'live' actually reached a phone.
CREATE TABLE IF NOT EXISTS line_deliveries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- NOT NULL: a message is never delivered to someone we cannot identify.
  patient_id  uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  line_user_id text NOT NULL,
  case_id     uuid REFERENCES cases(id) ON DELETE SET NULL,
  touch       text NOT NULL,
  sent_on     date NOT NULL,
  kind        text NOT NULL CHECK (kind IN ('push', 'reply', 'welcome')),
  channel     text NOT NULL DEFAULT 'recording' CHECK (channel IN ('live', 'recording')),
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- touch is unique per recipient per day, so a retried cron cannot double send.
CREATE UNIQUE INDEX IF NOT EXISTS line_deliveries_once_idx
  ON line_deliveries (line_user_id, touch, sent_on);

-- LINE redelivers webhooks on failure. line_event_id makes the retry a no-op
-- rather than a second counted response.
CREATE TABLE IF NOT EXISTS line_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    uuid REFERENCES patients(id) ON DELETE SET NULL,
  line_event_id text UNIQUE,
  event_type    text NOT NULL,
  step_code     text,
  payload       jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ── line_medications ────────────────────────────────────────────────────
-- What the patient registered in LIFF: maintenance + optional rescue, with the
-- pharmacist's own device classes (MDI/DPI/SMI) and ICS flag. The repo's
-- four-class taxonomy (MDI/ELP/BRZ/RSP) maps per drug, not per class — see
-- src/line/devices.ts — so device_line is stored verbatim and never coerced.
-- Re-registration replaces the list: one patient, one current list.
CREATE TABLE IF NOT EXISTS line_medications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  role        text NOT NULL CHECK (role IN ('maintenance', 'rescue')),
  drug_id     text NOT NULL,
  drug_name   text NOT NULL,
  device_line text NOT NULL CHECK (device_line IN ('MDI', 'DPI', 'SMI')),
  ics         boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (patient_id, role)
);

-- ── admin_config ────────────────────────────────────────────────────────────
-- Dynamic configuration for educational videos, drug photos, and quiz items.
CREATE TABLE IF NOT EXISTS admin_config (
  config_key   text PRIMARY KEY,
  config_value jsonb NOT NULL,
  updated_at   timestamptz NOT NULL DEFAULT now(),
  updated_by   text DEFAULT 'admin'
);

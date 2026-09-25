-- Continuity Ledger / hot memory / research substrate
-- Ledger rows are append-only. chain_heads is mutable coordination state.
CREATE TABLE IF NOT EXISTS integrity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  bot_id TEXT NOT NULL,
  action TEXT NOT NULL,
  input_hash TEXT NOT NULL,
  output_hash TEXT NOT NULL,
  prev_hash TEXT NOT NULL,
  purpose_score REAL,
  city_micro TEXT,
  knowledge_used TEXT,
  tx_hash TEXT,
  metadata_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_integrity_log_bot_ts ON integrity_log(bot_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_integrity_log_city_ts ON integrity_log(city_micro, ts DESC);
CREATE INDEX IF NOT EXISTS idx_integrity_log_action_ts ON integrity_log(action, ts DESC);

CREATE TABLE IF NOT EXISTS ledger_chain_heads (
  chain_id TEXT PRIMARY KEY,
  last_hash TEXT NOT NULL,
  last_id INTEGER,
  updated_ts INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  bot_id TEXT NOT NULL,
  city_micro TEXT,
  purpose TEXT,
  input_text TEXT NOT NULL,
  output_text TEXT,
  created_ts INTEGER NOT NULL,
  expires_ts INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chats_expires ON chats(expires_ts);
CREATE INDEX IF NOT EXISTS idx_chats_bot_created ON chats(bot_id, created_ts DESC);

CREATE TRIGGER IF NOT EXISTS integrity_log_no_update
BEFORE UPDATE ON integrity_log
BEGIN
  SELECT RAISE(ABORT, 'integrity_log is append-only');
END;

CREATE TRIGGER IF NOT EXISTS integrity_log_no_delete
BEFORE DELETE ON integrity_log
BEGIN
  SELECT RAISE(ABORT, 'integrity_log is append-only');
END;

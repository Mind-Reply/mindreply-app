-- Provider delivery evidence. Store provider event identifiers and status, not message bodies or raw recipient PII.
CREATE TABLE IF NOT EXISTS communication_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  received_ts INTEGER NOT NULL,
  provider TEXT NOT NULL,
  channel TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  status TEXT NOT NULL,
  occurred_ts INTEGER,
  recipient_ref TEXT,
  source TEXT NOT NULL DEFAULT 'webhook',
  metadata_json TEXT,
  UNIQUE(provider, provider_event_id)
);

CREATE INDEX IF NOT EXISTS idx_communication_events_channel_ts
  ON communication_events(channel, received_ts DESC);

CREATE INDEX IF NOT EXISTS idx_communication_events_provider_status
  ON communication_events(provider, status, received_ts DESC);

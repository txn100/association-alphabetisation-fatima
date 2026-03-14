-- Donations table: records every payment attempt and result
CREATE TABLE donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  checkout_id TEXT UNIQUE,
  merchant_tx_id TEXT UNIQUE NOT NULL,
  public_id TEXT UNIQUE NOT NULL,            -- safe to expose in URLs
  type TEXT NOT NULL CHECK(type IN ('one-time', 'monthly')),
  amount INTEGER NOT NULL,                   -- amount in cents (MUR × 100)
  currency TEXT NOT NULL DEFAULT 'MUR',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK(status IN ('pending', 'success', 'failed', 'refunded')),

  -- Donor info
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  donor_nic TEXT,                             -- NIC/passport, only if tax receipt requested
  tax_receipt_requested INTEGER NOT NULL DEFAULT 0,

  -- Payment result (filled by webhook or return)
  payment_brand TEXT,
  result_code TEXT,
  result_description TEXT,
  card_last4 TEXT,
  card_expiry TEXT,
  registration_id TEXT,                       -- Peach card token for recurring

  -- Sponsorship tier info (for monthly)
  tier_amount INTEGER,
  tier_label TEXT,

  -- Locale for receipt language
  locale TEXT NOT NULL DEFAULT 'fr',

  -- Timestamps
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  paid_at TEXT,
  webhook_received_at TEXT
);

CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_email ON donations(donor_email);
CREATE INDEX idx_donations_type ON donations(type);
CREATE INDEX idx_donations_public_id ON donations(public_id);

-- Webhook log: raw payloads for audit trail and idempotency
CREATE TABLE webhook_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  checkout_id TEXT,
  event_type TEXT,
  payload TEXT NOT NULL,
  signature_valid INTEGER NOT NULL DEFAULT 0,
  processed INTEGER NOT NULL DEFAULT 0,
  idempotency_key TEXT UNIQUE,               -- webhook_id or checkout_id+status
  received_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_webhook_log_checkout ON webhook_log(checkout_id);
CREATE INDEX idx_webhook_log_idempotency ON webhook_log(idempotency_key);

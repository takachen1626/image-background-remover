-- D1 schema for imagebackgrounderaser.shop
-- Run this in Cloudflare Dashboard → D1 → your database → Console

CREATE TABLE IF NOT EXISTS users (
  id                TEXT PRIMARY KEY,
  google_id         TEXT UNIQUE NOT NULL,
  email             TEXT UNIQUE NOT NULL,
  name              TEXT,
  picture           TEXT,
  plan              TEXT DEFAULT 'free',        -- 'free' | 'pro' | 'business'
  credits_used      INTEGER DEFAULT 0,          -- images used this month (subscription)
  credits_limit     INTEGER DEFAULT 10,         -- monthly limit for current plan
  credits_balance   INTEGER DEFAULT 0,          -- permanent credit pack balance
  credits_reset_at  TEXT,                       -- YYYY-MM when monthly credits last reset
  plan_expires_at   TEXT,                       -- ISO date when subscription expires
  created_at        TEXT,
  last_login        TEXT
);

CREATE TABLE IF NOT EXISTS guest_usage (
  ip    TEXT NOT NULL,
  date  TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  PRIMARY KEY (ip, date)
);

-- Payment orders (PayPal / future gateways)
CREATE TABLE IF NOT EXISTS orders (
  id              TEXT PRIMARY KEY,             -- our internal order id
  user_id         TEXT,                         -- google_id (null for guest)
  gateway         TEXT NOT NULL,                -- 'paypal' | 'stripe' | ...
  gateway_order_id TEXT,                        -- gateway's order/payment id
  type            TEXT NOT NULL,                -- 'subscription' | 'credits'
  plan            TEXT,                         -- 'pro' | 'business' (for subscription)
  credits         INTEGER,                      -- credits granted (for credit packs)
  amount_usd      REAL,                         -- amount charged in USD
  status          TEXT DEFAULT 'pending',       -- 'pending' | 'paid' | 'failed' | 'refunded'
  created_at      TEXT,
  paid_at         TEXT
);

-- Migration: add new columns to existing users table (run if upgrading)
-- ALTER TABLE users ADD COLUMN credits_balance INTEGER DEFAULT 0;
-- ALTER TABLE users ADD COLUMN credits_reset_at TEXT;
-- ALTER TABLE users ADD COLUMN plan_expires_at TEXT;

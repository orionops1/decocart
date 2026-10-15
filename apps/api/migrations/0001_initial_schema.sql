-- DecoCart D1 Schema Migration v001
-- Run: pnpm --filter @decocart/api db:migrate

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ──────────────────────────────────────────────────────────────────────────────
-- PACKAGES
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS packages (
  id             TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  slug           TEXT NOT NULL UNIQUE,
  title          TEXT NOT NULL,
  tagline        TEXT,
  base_price_lkr REAL NOT NULL,
  base_price_usd REAL NOT NULL,
  features       TEXT NOT NULL DEFAULT '[]',   -- JSON array of feature strings
  image_key      TEXT,                          -- R2 key for hero image
  is_active      INTEGER NOT NULL DEFAULT 1,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO packages (slug, title, tagline, base_price_lkr, base_price_usd, features, sort_order) VALUES
  ('spark', 'Spark', 'A sweet, minimal midnight surprise', 16500, 55, '["Bento cake (signature design)","Flower bunch","Handwritten personal card","12:00 AM delivery","Reaction photo"]', 1),
  ('classic-glow', 'Classic Glow', 'The crowd favourite', 28500, 95, '["1kg custom designer cake","Premium floral bouquet","5x helium balloons","Party props pack","Setup & delivery crew","4K reaction photo delivery"]', 2),
  ('signature-luxe', 'Signature Luxe', 'An experience worth remembering', 55000, 185, '["Gourmet cake (2kg)","Imported flowers","Room decoration setup team","Acoustic guitarist / violinist (2 songs)","Premium ribbon & gift wrap","4K Reaction Cam reel edited & delivered"]', 3),
  ('grand-royalty', 'Grand Royalty', 'Go all out', 95000, 315, '["Full theme décor & setup","Catering for 20 guests","Flash mob dance crew OR live saxophonist","Cinematic same-day edited video","Dedicated event manager","Champagne tower"]', 4);

-- ──────────────────────────────────────────────────────────────────────────────
-- ADD-ONS
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS add_ons (
  id             TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  slug           TEXT NOT NULL UNIQUE,
  title          TEXT NOT NULL,
  price_lkr      REAL NOT NULL,
  price_usd      REAL NOT NULL,
  is_active      INTEGER NOT NULL DEFAULT 1
);

INSERT INTO add_ons (slug, title, price_lkr, price_usd) VALUES
  ('extra-balloons', '10x Extra Helium Balloons', 2500, 8),
  ('sparkler-candles', 'Musical Sparkler Candles', 1800, 6),
  ('photo-frame', 'Custom Printed Photo Frame', 3500, 12),
  ('teddy-bear', 'Premium Plush Teddy Bear', 4200, 14),
  ('chocolate-box', 'Imported Luxury Chocolate Box', 6500, 22),
  ('guitarist-extra', 'Guitarist Extra 2 Songs', 8000, 27);

-- ──────────────────────────────────────────────────────────────────────────────
-- BOOKINGS
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  package_id        TEXT NOT NULL REFERENCES packages(id),
  customer_name     TEXT NOT NULL,
  customer_phone    TEXT NOT NULL,
  customer_email    TEXT NOT NULL,
  customer_country  TEXT NOT NULL DEFAULT 'LK',
  recipient_name    TEXT NOT NULL,
  recipient_phone   TEXT NOT NULL,
  delivery_address  TEXT NOT NULL,
  event_datetime    TEXT NOT NULL,
  delivery_slot     TEXT NOT NULL CHECK (delivery_slot IN ('morning', 'afternoon', 'evening', 'midnight')),
  special_message   TEXT,
  add_ons           TEXT NOT NULL DEFAULT '[]',  -- JSON array of add_on slugs
  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft','confirmed','preparing','out_for_delivery','delivered','completed','cancelled')),
  currency          TEXT NOT NULL DEFAULT 'LKR' CHECK (currency IN ('LKR', 'USD')),
  total_amount      REAL,
  notes             TEXT,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings (DATE(event_datetime));
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_date ON bookings (delivery_slot, DATE(event_datetime));

-- ──────────────────────────────────────────────────────────────────────────────
-- MEDIA ASSETS (Reaction videos, setup photos, card artwork)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_assets (
  id           TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  booking_id   TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  r2_key       TEXT NOT NULL UNIQUE,
  media_type   TEXT NOT NULL CHECK (media_type IN ('reaction_video', 'setup_photo', 'card_artwork')),
  is_public    INTEGER NOT NULL DEFAULT 0,    -- 1 = displayed on Reaction Wall
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_media_booking ON media_assets (booking_id);

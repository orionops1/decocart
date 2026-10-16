-- DecoCart D1 Schema Migration v001
-- Run: pnpm --filter @decocart/api db:migrate

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ──────────────────────────────────────────────────────────────────────────────
-- PACKAGES (Aligned with DecoCart Business Plan & 2026 Updated Market Pricing)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS packages (
  id             TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  slug           TEXT NOT NULL UNIQUE,
  title          TEXT NOT NULL,
  badge          TEXT,
  tagline        TEXT,
  base_price_lkr REAL NOT NULL,
  base_price_usd REAL NOT NULL,
  original_2019_price_lkr REAL,
  guests         TEXT,
  cake           TEXT,
  flowers        TEXT,
  decorations    TEXT,
  food_and_beverages TEXT,
  entertainment_and_media TEXT,
  features       TEXT NOT NULL DEFAULT '[]',   -- JSON array of feature strings
  itemized_breakdown TEXT NOT NULL DEFAULT '[]', -- JSON array of itemized objects
  image_key      TEXT,                          -- R2 key for hero image
  is_active      INTEGER NOT NULL DEFAULT 1,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO packages (slug, title, badge, tagline, base_price_lkr, base_price_usd, original_2019_price_lkr, guests, cake, flowers, decorations, food_and_beverages, entertainment_and_media, features, sort_order) VALUES
  ('budget', 'Budget Package', 'Essential', 'The classic midnight or daytime surprise with fresh cake, floral bouquet & birthday balloons.', 18500, 60, 7900, '1 - 5 people', '1 kg Chocolate Cake with custom celebration message', '1 Fresh Flower Bunch (Fresh Red Roses & Daisies)', 'Birthday Balloons styling & creative birthday photo props pack', NULL, 'Personalized celebration soundtrack setup & arrival reaction photo', '["1 kg Handcrafted Chocolate Cake","1 Fresh Flower Bunch (Roses + Daisies)","Themed Birthday Balloons & Ribbon Deco","Birthday Props & Celebration Hats","Stealth Setup & Arrival Coordination","Digital Reaction Photo delivered within 2 hours"]', 1),
  ('silver', 'Silver Package', 'Party Favourite', 'Deluxe celebration with 1.5kg chocolate nugget cake, large floral bouquet & catering for 15 guests.', 32500, 105, 12900, 'Up to 15 guests', '1.5 kg Chocolate Cake topped with chocolate nuggets & rich ganache', 'Large Flower Bunch (Red Roses & Baby''s-breath)', 'Deluxe Birthday Balloons styling, streamers & props', 'Catering for 15 people: 2 varieties of savory short-eats + 2 refreshing beverages', 'Sound system coordination, celebration music & high-res reaction photos', '["1.5 kg Chocolate Cake with crunchy nuggets","Large Red Roses & Baby''s-breath Floral Bouquet","Deluxe Balloons & Room Decoration setup","Birthday Photo Props & Party Hats","Food & Beverages for 15 People (2 short eats + 2 beverages)","Service charge & stealth event coordination included"]', 2),
  ('gold', 'Gold Package', 'Most Popular', 'Brownie cake with fresh strawberries, exotic lilies, catering for 20 & 1-day videography + photo booth.', 58000, 190, 23900, 'Up to 20 guests', '1.5 kg Chocolate Brownie Cake with fresh strawberries & floral cake decor', 'Large Flower Bunch (Red Roses, Lily of the Incas & Baby''s-breath) + Cake floral styling', 'Theme balloon arch, centerpieces, ceiling streamers, table ensemble & photo props', 'Catering for 20 people: 2 varieties of artisan short-eats + 2 varieties of beverages', 'Special 1-Day Videography & Photo Booth setup with 12-hour edited highlight reel', '["1.5 kg Gourmet Brownie Cake with Fresh Strawberries","Fresh Floral Cake Dressing & Topper","Exotic Floral Bouquet (Roses + Lily of the Incas + Baby’s-breath)","Food & Beverages for 20 People (2 short eats + 2 beverages)","Special 1-Day Videography & Photo Booth setup","Edited Highlight Video delivered within 12 hours","Complete Theme Balloons & Birthday Props Package","Dedicated Event Planner & Logistics Support"]', 3),
  ('platinum', 'Platinum Package', 'Ultimate VIP', 'The full DecoCart experience: Brownie cake, soft toy, catering for 20, videography & a 6-person surprise dance flash mob!', 89000, 290, 30900, 'Up to 20+ guests / Large Venue', '1.5 kg Chocolate Brownie Cake with fresh strawberries & luxury floral dressing', 'Luxury Flower Bunch (Red Roses, Lily of the Incas & Baby''s-breath) + Premium Soft Toy', 'Full venue transformation: Mylar balloons, helium bouquets, personalized banner & custom props', 'Catering for 20 people: 2 gourmet short-eats + 2 refreshing beverages', 'Special 1-Day Videography & Photo Booth + Surprise Dance Crew (06 professional dancers)', '["1.5 kg Gourmet Brownie Cake with Fresh Strawberries & Florals","Luxury Flower Bouquet + Premium Cuddly Soft Toy Gift","Surprise Dance Crew (06 Professional Performers / Flash Mob)","Special 1-Day Cinematic Videography & Photo Booth","Same-Day Edited 4K Video Reel (delivered within 12 hours)","Food & Beverages for 20 Guests (2 short eats + 2 beverages)","Full Venue Styling: Helium Balloons, Mylar Accents & Props","Personalized Celebration Banner & Souvenir Keepsake","Senior Operations Manager On-Site Coordination"]', 4);

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
  ('sparkler-candles', 'Musical Sparkler Candles & Ice Fountain', 1800, 6),
  ('photo-frame', 'Custom Printed Souvenir Photo Frame', 3500, 12),
  ('teddy-bear', 'Deluxe Plush Cuddly Teddy Bear (45cm)', 4200, 14),
  ('chocolate-box', 'Imported Luxury Ferrero / Swiss Chocolate Box', 6500, 22),
  ('guitarist-extra', 'Acoustic Guitarist Live Songs (2 songs)', 8000, 27);

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
  add_ons           TEXT NOT NULL DEFAULT '[]',
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
-- MEDIA ASSETS
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_assets (
  id           TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  booking_id   TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  r2_key       TEXT NOT NULL UNIQUE,
  media_type   TEXT NOT NULL CHECK (media_type IN ('reaction_video', 'setup_photo', 'card_artwork')),
  is_public    INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_media_booking ON media_assets (booking_id);

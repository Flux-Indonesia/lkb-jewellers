-- ============================================
-- LKB Jewellers - Supabase Database Migration
-- Run this in Supabase SQL Editor
-- Safe to re-run (uses IF NOT EXISTS / IF EXISTS)
-- ============================================

-- 1. PRODUCTS table (should already exist, but here for reference)
CREATE TABLE IF NOT EXISTS products (
  _id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'luxury-jewellery',
  brand TEXT DEFAULT '',
  price NUMERIC DEFAULT 0,
  image TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  tags TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 0,
  model TEXT DEFAULT '',
  case_size TEXT DEFAULT '',
  case_material TEXT DEFAULT '',
  dial_color TEXT DEFAULT '',
  year_of_production INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CONTACTS table (contact inquiries)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  interest TEXT DEFAULT '',
  message TEXT DEFAULT '',
  preferred_contact_method TEXT DEFAULT 'email',
  product_id TEXT DEFAULT '',
  product_name TEXT DEFAULT '',
  product_price NUMERIC DEFAULT 0,
  product_category TEXT DEFAULT '',
  product_image TEXT DEFAULT '',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'contacted', 'closed')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SELL_SUBMISSIONS table (we-buy form submissions)
CREATE TABLE IF NOT EXISTS sell_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  is_international BOOLEAN DEFAULT false,
  country TEXT DEFAULT 'United Kingdom',
  brand TEXT DEFAULT '',
  model TEXT DEFAULT '',
  reference_number TEXT DEFAULT '',
  year_of_manufacture TEXT DEFAULT '',
  condition TEXT DEFAULT 'Good' CHECK (condition IN ('Excellent', 'Good', 'Fair', 'Poor')),
  has_box BOOLEAN DEFAULT false,
  has_papers BOOLEAN DEFAULT false,
  additional_info TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  visited_others BOOLEAN DEFAULT false,
  best_offer TEXT DEFAULT '',
  jeweller_name TEXT DEFAULT '',
  offer_amount NUMERIC DEFAULT 0,
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'offer-sent', 'accepted', 'completed', 'declined')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ORDERS table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_intent_id TEXT DEFAULT '',
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'gbp',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded')),
  customer_first_name TEXT DEFAULT '',
  customer_last_name TEXT DEFAULT '',
  customer_email TEXT DEFAULT '',
  customer_phone TEXT DEFAULT '',
  address_line1 TEXT DEFAULT '',
  address_line2 TEXT DEFAULT '',
  city TEXT DEFAULT '',
  state TEXT DEFAULT '',
  postal_code TEXT DEFAULT '',
  country TEXT DEFAULT '',
  delivery_type TEXT DEFAULT 'uk',
  delivery_notes TEXT DEFAULT '',
  items JSONB DEFAULT '[]'::jsonb,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. NEWSLETTER table
CREATE TABLE IF NOT EXISTS newsletter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- Row Level Security (RLS)
-- Dashboard uses anon key with cookie auth,
-- so all tables need full anon access.
-- ============================================

-- Disable RLS on all tables (dashboard uses anon key)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE sell_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter DISABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe if they don't exist)
DROP POLICY IF EXISTS "Allow public read products" ON products;
DROP POLICY IF EXISTS "Allow auth full access products" ON products;
DROP POLICY IF EXISTS "Allow public insert contacts" ON contacts;
DROP POLICY IF EXISTS "Allow auth full access contacts" ON contacts;
DROP POLICY IF EXISTS "Allow public insert sell" ON sell_submissions;
DROP POLICY IF EXISTS "Allow auth full access sell" ON sell_submissions;
DROP POLICY IF EXISTS "Allow auth full access orders" ON orders;
DROP POLICY IF EXISTS "Allow public insert newsletter" ON newsletter;
DROP POLICY IF EXISTS "Allow auth full access newsletter" ON newsletter;

-- AtlasVault Supabase Database Migrations
-- This file contains all SQL statements needed to set up the database schema

-- ============================================
-- 1. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  product_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for active categories
CREATE INDEX idx_categories_active ON categories(active);

-- ============================================
-- 2. SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  image_url TEXT,
  rating DECIMAL(3, 1) DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  features JSONB,
  specifications JSONB,
  order_steps JSONB,
  faqs JSONB,
  related_products JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for services
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_active ON services(active);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_created ON services(created_at);

-- ============================================
-- 3. PROMOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS promos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  discount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  applicable_to TEXT NOT NULL CHECK (applicable_to IN ('all', 'product', 'category')),
  target_id UUID,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for promos
CREATE INDEX idx_promos_active ON promos(active);
CREATE INDEX idx_promos_start_date ON promos(start_date);
CREATE INDEX idx_promos_end_date ON promos(end_date);

-- ============================================
-- 4. OFFERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  condition TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_limited BOOLEAN DEFAULT false,
  limited_quantity INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for offers
CREATE INDEX idx_offers_active ON offers(active);
CREATE INDEX idx_offers_expires_at ON offers(expires_at);

-- ============================================
-- 5. USERS TABLE (Linked to Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 6. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- ============================================
-- 7. FAVORITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, service_id)
);

-- Create indexes for favorites
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_service ON favorites(service_id);

-- ============================================
-- 8. CART ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, service_id)
);

-- Create indexes for cart items
CREATE INDEX idx_cart_items_user ON cart_items(user_id);

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can view own orders
CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own favorites
CREATE POLICY "Users can add favorites"
  ON favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete own favorites
CREATE POLICY "Users can delete own favorites"
  ON favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Users can view own cart
CREATE POLICY "Users can view own cart"
  ON cart_items
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can manage own cart
CREATE POLICY "Users can manage own cart"
  ON cart_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update own cart
CREATE POLICY "Users can update own cart"
  ON cart_items
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete own cart
CREATE POLICY "Users can delete own cart"
  ON cart_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- Everyone can view active services
CREATE POLICY "Everyone can view active services"
  ON services
  FOR SELECT
  USING (active = true);

-- Everyone can view active categories
CREATE POLICY "Everyone can view active categories"
  ON categories
  FOR SELECT
  USING (active = true);

-- Everyone can view active promos
CREATE POLICY "Everyone can view active promos"
  ON promos
  FOR SELECT
  USING (active = true AND NOW() >= start_date AND NOW() <= end_date);

-- Everyone can view active offers
CREATE POLICY "Everyone can view active offers"
  ON offers
  FOR SELECT
  USING (active = true AND NOW() <= expires_at);

-- ============================================
-- 10. TRIGGER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for services
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for categories
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for promos
CREATE TRIGGER update_promos_updated_at BEFORE UPDATE ON promos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for offers
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for cart items
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 11. SAMPLE DATA INSERTION (Optional)
-- ============================================

-- Insert sample categories
INSERT INTO categories (name, description, icon, color, active) VALUES
  ('The Vault', 'Streaming & Entertainment Services', '🎬', 'bg-blue-500', true),
  ('Telecom Hub', 'Mobile & Communication Services', '📱', 'bg-green-500', true),
  ('Gaming Corner', 'Gaming Services & Subscriptions', '🎮', 'bg-purple-500', true),
  ('Business Suite', 'Professional & Business Tools', '💼', 'bg-orange-500', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 12. STORAGE BUCKET (Optional)
-- ============================================

-- Create storage bucket for service images (in Supabase UI)
-- Bucket name: service-images
-- Public: true
-- File size limit: 10MB

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all tables were created
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check indexes
-- SELECT * FROM pg_indexes WHERE schemaname = 'public';

-- Check RLS policies
-- SELECT * FROM pg_policies;

-- ============================================
-- END OF MIGRATIONS
-- ============================================

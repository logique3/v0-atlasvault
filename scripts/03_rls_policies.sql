-- Row Level Security (RLS) Policies for AtlasVault

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- CATEGORIES - Public read access
CREATE POLICY "categories_read_public" ON categories
FOR SELECT USING (active = true);

CREATE POLICY "categories_admin" ON categories
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- SERVICES - Public read access (active only)
CREATE POLICY "services_read_public" ON services
FOR SELECT USING (active = true);

CREATE POLICY "services_admin" ON services
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- USERS - Users can read their own profile
CREATE POLICY "users_read_own" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_admin_all" ON users
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ORDERS - Users can read their own orders
CREATE POLICY "orders_read_own" ON orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "orders_create_own" ON orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_own" ON orders
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "orders_admin_all" ON orders
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- FAVORITES - Users can manage their own favorites
CREATE POLICY "favorites_read_own" ON favorites
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_create_own" ON favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_own" ON favorites
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "favorites_admin_all" ON favorites
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- CART_ITEMS - Users can manage their own cart
CREATE POLICY "cart_items_read_own" ON cart_items
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cart_items_create_own" ON cart_items
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_items_update_own" ON cart_items
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "cart_items_delete_own" ON cart_items
FOR DELETE USING (auth.uid() = user_id);

-- PROMOS - Public read access (active only)
CREATE POLICY "promos_read_public" ON promos
FOR SELECT USING (active = true AND end_date > CURRENT_TIMESTAMP);

CREATE POLICY "promos_admin_all" ON promos
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- OFFERS - Public read access (active only)
CREATE POLICY "offers_read_public" ON offers
FOR SELECT USING (active = true AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP));

CREATE POLICY "offers_admin_all" ON offers
FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

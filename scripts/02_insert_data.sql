-- Insert Categories
INSERT INTO categories (name, description, icon, color, active) VALUES
('The Vault', 'Premium streaming and entertainment services', '📺', '#3B82F6', true),
('Telecom Hub', 'Mobile and internet services', '📱', '#10B981', true),
('Gaming Corner', 'Gaming platforms and subscriptions', '🎮', '#F59E0B', true),
('Business Suite', 'Professional and productivity tools', '💼', '#8B5CF6', true)
ON CONFLICT (name) DO NOTHING;

-- Get category IDs for use in services
DO $$
DECLARE
  vault_id UUID;
  telecom_id UUID;
  gaming_id UUID;
  business_id UUID;
BEGIN
  SELECT id INTO vault_id FROM categories WHERE name = 'The Vault';
  SELECT id INTO telecom_id FROM categories WHERE name = 'Telecom Hub';
  SELECT id INTO gaming_id FROM categories WHERE name = 'Gaming Corner';
  SELECT id INTO business_id FROM categories WHERE name = 'Business Suite';

  -- Insert Services - The Vault Category
  INSERT INTO services (slug, name, price, category_id, description, rating, reviews_count, in_stock, features, specifications, order_steps, faqs, active) VALUES
  ('netflix-premium', 'Netflix Premium', 15.99, vault_id, 
   'Unlimited movies, TV shows, and games on 4 screens simultaneously. Stream in 4K Ultra HD with Dolby Atmos sound.',
   4.8, 324, true,
   '["Watch on 4 screens at the same time", "4K + HDR available", "Dolby Atmos surround sound", "Ad-free viewing experience", "Download to watch offline", "Includes ad-free game streaming"]'::jsonb,
   '[{"label": "Screens", "value": "4 simultaneous"}, {"label": "Resolution", "value": "4K Ultra HD"}, {"label": "Audio", "value": "Dolby Atmos"}, {"label": "Offline Download", "value": "Yes"}]'::jsonb,
   '[{"number": 1, "title": "Confirm Order", "description": "Review subscription details"}, {"number": 2, "title": "Payment", "description": "Choose your payment method"}, {"number": 3, "title": "Account Setup", "description": "Receive credentials in minutes"}, {"number": 4, "title": "Start Streaming", "description": "Enjoy unlimited entertainment"}]'::jsonb,
   '[{"question": "How long does activation take?", "answer": "Usually 5-10 minutes after payment"}, {"question": "Can I upgrade my plan?", "answer": "Yes, anytime from settings"}, {"question": "Is this shareable?", "answer": "Yes, up to 4 simultaneous streams"}]'::jsonb,
   true),

  ('disney-plus', 'Disney Plus Bundle', 11.99, vault_id,
   'Disney, Pixar, Marvel, Star Wars, and more. Watch original series, movies, and documentaries in 4K quality.',
   4.9, 456, true,
   '["Access to Disney, Pixar, Marvel content", "Star Wars exclusive series", "Original movies and documentaries", "4K resolution available", "Multiple profiles", "Simultaneous streams on multiple devices"]'::jsonb,
   '[{"label": "Content", "value": "1000+ titles"}, {"label": "Resolution", "value": "4K"}, {"label": "Simultaneous Streams", "value": "4"}]'::jsonb,
   '[{"number": 1, "title": "Choose Plan", "description": "Select bundle option"}, {"number": 2, "title": "Payment", "description": "Secure payment processing"}, {"number": 3, "title": "Activate", "description": "Instant account activation"}, {"number": 4, "title": "Watch", "description": "Enjoy premium content"}]'::jsonb,
   '[{"question": "What is included in bundle?", "answer": "Disney+, Hulu, ESPN+"}, {"question": "Can I download content?", "answer": "Yes on supported devices"}]'::jsonb,
   true),

  ('spotify-premium', 'Spotify Premium', 10.99, vault_id,
   'Ad-free music streaming with millions of songs, podcasts, and audiobooks. Listen offline anywhere.',
   4.7, 289, true,
   '["Ad-free listening", "Offline downloads", "High audio quality", "Unlimited skips", "Access to podcasts", "Audiobook collection"]'::jsonb,
   '[{"label": "Songs", "value": "70+ million"}, {"label": "Audio Quality", "value": "320 kbps"}, {"label": "Offline Songs", "value": "Unlimited"}]'::jsonb,
   '[{"number": 1, "title": "Select Plan", "description": "Choose personal or family"}, {"number": 2, "title": "Sign Up", "description": "Create your account"}, {"number": 3, "title": "Add Payment", "description": "Provide payment method"}, {"number": 4, "title": "Start Listening", "description": "Access all music"}]'::jsonb,
   '[{"question": "Can I share my account?", "answer": "Family plan supports 6 accounts"}, {"question": "Is offline available?", "answer": "Yes on all plans"}]'::jsonb,
   true),

  ('youtube-premium', 'YouTube Premium', 13.99, vault_id,
   'Ad-free YouTube, background play, downloads, and YouTube Music included. Watch your favorites uninterrupted.',
   4.6, 198, true,
   '["Ad-free watching", "Background play", "Download videos", "YouTube Music included", "Early access to features", "Support creators"]'::jsonb,
   '[{"label": "Video Quality", "value": "Up to 4K"}, {"label": "Music Included", "value": "YouTube Music"}, {"label": "Offline Downloads", "value": "Yes"}]'::jsonb,
   '[{"number": 1, "title": "Subscribe", "description": "Choose plan type"}, {"number": 2, "title": "Payment", "description": "Secure checkout"}, {"number": 3, "title": "Activate", "description": "Immediate access"}, {"number": 4, "title": "Watch", "description": "Ad-free experience"}]'::jsonb,
   '[{"question": "What about YouTube Music?", "answer": "Included with Premium"}, {"question": "Can family watch together?", "answer": "Family plan available separately"}]'::jsonb,
   true),

  ('apple-tv-plus', 'Apple TV Plus', 9.99, vault_id,
   'Award-winning original shows and movies. Watch on all your Apple devices with family sharing.',
   4.5, 156, true,
   '["Original content only", "4K HDR quality", "Dolby Atmos audio", "Family sharing", "Watch on multiple devices", "Ad-free streaming"]'::jsonb,
   '[{"label": "Original Content", "value": "100+ titles"}, {"label": "Resolution", "value": "4K HDR"}, {"label": "Simultaneous Streams", "value": "6"}]'::jsonb,
   '[{"number": 1, "title": "Select Plan", "description": "Monthly subscription"}, {"number": 2, "title": "Register", "description": "Create Apple account"}, {"number": 3, "title": "Payment", "description": "Secure transaction"}, {"number": 4, "title": "Stream", "description": "Exclusive content access"}]'::jsonb,
   '[{"question": "Works on Android?", "answer": "Yes via web or supported devices"}, {"question": "Free trial available?", "answer": "Check current promotion"}]'::jsonb,
   true),

  ('hbo-max', 'HBO Max Premium', 19.99, vault_id,
   'HBO series, Warner Bros movies, Max originals, and more. Watch in 4K on up to 4 screens.',
   4.8, 267, true,
   '["HBO series access", "Warner Bros movies", "Max originals", "4K streaming", "Offline downloads", "Multi-profile support"]'::jsonb,
   '[{"label": "Content Library", "value": "15,000+ titles"}, {"label": "Resolution", "value": "4K"}, {"label": "Simultaneous Streams", "value": "4"}]'::jsonb,
   '[{"number": 1, "title": "Subscribe", "description": "Choose your plan"}, {"number": 2, "title": "Account Setup", "description": "Create HBO Max account"}, {"number": 3, "title": "Payment", "description": "Add payment method"}, {"number": 4, "title": "Binge Watch", "description": "Enjoy premium content"}]'::jsonb,
   '[{"question": "Includes HBO channels?", "answer": "Yes, all premium content"}, {"question": "Can download shows?", "answer": "Yes on mobile and tablets"}]'::jsonb,
   true),

  -- Telecom Hub Services
  ('orange-mobile', 'Orange Mobile Plan', 25.00, telecom_id,
   'Orange premium mobile plan with unlimited calls and 50GB data. Full Tunisia coverage.',
   4.7, 178, true,
   '["Unlimited national calls", "50GB high-speed data", "International roaming", "5G ready", "Customer support 24/7", "Family sharing"]'::jsonb,
   '[{"label": "Data", "value": "50GB/month"}, {"label": "Calls", "value": "Unlimited"}, {"label": "SMS", "value": "Unlimited"}, {"label": "Validity", "value": "30 days"}]'::jsonb,
   '[{"number": 1, "title": "Order", "description": "Select plan and delivery"}, {"number": 2, "title": "Payment", "description": "Secure payment"}, {"number": 3, "title": "Activation", "description": "SIM card activation"}, {"number": 4, "title": "Use", "description": "Start enjoying service"}]'::jsonb,
   '[{"question": "International roaming cost?", "answer": "Contact Orange for rates"}, {"question": "Can I switch plans?", "answer": "Yes, anytime"}]'::jsonb,
   true),

  ('tunisie-telecom', 'Tunisie Telecom Premium', 30.00, telecom_id,
   'Unlimited data and calls with Tunisie Telecom. 4G LTE everywhere in Tunisia.',
   4.6, 145, true,
   '["Unlimited 4G data", "Unlimited calls", "International minutes", "Monthly validity", "Excellent coverage", "24/7 support"]'::jsonb,
   '[{"label": "Data", "value": "Unlimited"}, {"label": "Calls", "value": "Unlimited"}, {"label": "Network", "value": "4G LTE"}, {"label": "Coverage", "value": "Nationwide"}]'::jsonb,
   '[{"number": 1, "title": "Choose Plan", "description": "Select from options"}, {"number": 2, "title": "Provide Details", "description": "Personal information"}, {"number": 3, "title": "Pay", "description": "Complete payment"}, {"number": 4, "title": "Activate", "description": "Enjoy service"}]'::jsonb,
   '[{"question": "Coverage everywhere?", "answer": "98% nationwide coverage"}, {"question": "Roaming available?", "answer": "Yes, international roaming available"}]'::jsonb,
   true),

  -- Gaming Corner Services
  ('playstation-plus', 'PlayStation Plus Premium', 119.99, gaming_id,
   'Play online multiplayer games, exclusive deals, and access to classic PlayStation titles.',
   4.9, 512, true,
   '["Online multiplayer", "PlayStation Game Catalog", "Classic PSX games", "Exclusive discounts", "Cloud gaming", "Premium support"]'::jsonb,
   '[{"label": "Games", "value": "500+ titles"}, {"label": "Multiplayer", "value": "Online"}, {"label": "Subscription", "value": "12 months"}]'::jsonb,
   '[{"number": 1, "title": "Create Account", "description": "PlayStation Network"}, {"number": 2, "title": "Subscribe", "description": "Choose plan"}, {"number": 3, "title": "Payment", "description": "Add payment method"}, {"number": 4, "title": "Download Games", "description": "Access game library"}]'::jsonb,
   '[{"question": "Multi-player available?", "answer": "Yes, unlimited multiplayer"}, {"question": "Can I cancel anytime?", "answer": "Yes, flexible cancellation"}]'::jsonb,
   true),

  ('xbox-game-pass', 'Xbox Game Pass Ultimate', 179.99, gaming_id,
   'Access to 100+ games on Xbox, PC, and cloud. Play the latest Game Pass titles day one.',
   4.8, 389, true,
   '["100+ games", "Day one access", "Xbox Cloud Gaming", "PC Game Pass", "EA Play included", "Multiplayer access"]'::jsonb,
   '[{"label": "Games", "value": "100+ titles"}, {"label": "Platforms", "value": "Xbox, PC, Cloud"}, {"label": "EA Play", "value": "Included"}]'::jsonb,
   '[{"number": 1, "title": "Create Account", "description": "Xbox Live account"}, {"number": 2, "title": "Subscribe", "description": "Game Pass Ultimate"}, {"number": 3, "title": "Payment", "description": "Secure checkout"}, {"number": 4, "title": "Play", "description": "100+ games available"}]'::jsonb,
   '[{"question": "Works on PC?", "answer": "Yes, PC Game Pass included"}, {"question": "New games added?", "answer": "Yes, regularly updated"}]'::jsonb,
   true),

  ('nintendo-online', 'Nintendo Switch Online', 49.99, gaming_id,
   'Play online games, access classic NES and SNES titles, and cloud save your progress.',
   4.7, 267, true,
   '["Online multiplayer", "NES & SNES games", "Cloud saves", "Exclusive offers", "Mobile app", "Family plan available"]'::jsonb,
   '[{"label": "Games", "value": "100+ NES/SNES"}, {"label": "Cloud Saves", "value": "Unlimited"}, {"label": "Multiplayer", "value": "Online"}]'::jsonb,
   '[{"number": 1, "title": "Create Nintendo Account", "description": "Registration"}, {"number": 2, "title": "Choose Plan", "description": "Individual or Family"}, {"number": 3, "title": "Payment", "description": "Add payment info"}, {"number": 4, "title": "Download Games", "description": "Access library"}]'::jsonb,
   '[{"question": "Family plan how many?", "answer": "Up to 8 members"}, {"question": "Can use multiple Switch?", "answer": "Yes, all linked consoles"}]'::jsonb,
   true),

  -- Business Suite Services
  ('microsoft-365', 'Microsoft 365 Business', 79.99, business_id,
   'Complete Office suite with Word, Excel, PowerPoint, Teams, and 1TB OneDrive storage.',
   4.9, 456, true,
   '["Office 365 apps", "1TB OneDrive", "Microsoft Teams", "30-minute calls", "Advanced security", "Priority support"]'::jsonb,
   '[{"label": "Users", "value": "1 person"}, {"label": "Storage", "value": "1TB OneDrive"}, {"label": "Devices", "value": "5 simultaneous"}]'::jsonb,
   '[{"number": 1, "title": "Create Account", "description": "Microsoft account"}, {"number": 2, "title": "Subscribe", "description": "Choose plan"}, {"number": 3, "title": "Payment", "description": "Checkout"}, {"number": 4, "title": "Download", "description": "Install Office apps"}]'::jsonb,
   '[{"question": "Can share subscription?", "answer": "Family plan available"}, {"question": "Works on Mac?", "answer": "Yes, all platforms supported"}]'::jsonb,
   true),

  ('adobe-creative', 'Adobe Creative Cloud', 99.99, business_id,
   'Professional creative tools: Photoshop, Illustrator, InDesign, Premiere Pro, and more.',
   4.8, 234, true,
   '["Photoshop", "Illustrator", "InDesign", "Premiere Pro", "After Effects", "100GB cloud storage"]'::jsonb,
   '[{"label": "Apps", "value": "All Creative Cloud"}, {"label": "Cloud Storage", "value": "100GB"}, {"label": "Updates", "value": "Always latest"}]'::jsonb,
   '[{"number": 1, "title": "Create Adobe ID", "description": "Registration"}, {"number": 2, "title": "Select Plan", "description": "Choose apps"}, {"number": 3, "title": "Payment", "description": "Secure transaction"}, {"number": 4, "title": "Download", "description": "Install and create"}]'::jsonb,
   '[{"question": "Student discount?", "answer": "Yes, special student pricing"}, {"question": "Monthly or yearly?", "answer": "Both options available"}]'::jsonb,
   true),

  ('slack-pro', 'Slack Pro Workspace', 59.99, business_id,
   'Team communication platform with unlimited message history, 20GB file storage, and advanced features.',
   4.7, 189, true,
   '["Unlimited messages", "20GB storage per person", "Advanced search", "Workflow builder", "API access", "Priority support"]'::jsonb,
   '[{"label": "Message History", "value": "Unlimited"}, {"label": "File Storage", "value": "20GB per person"}, {"label": "Members", "value": "Unlimited"}]'::jsonb,
   '[{"number": 1, "title": "Create Account", "description": "Workspace setup"}, {"number": 2, "title": "Invite Team", "description": "Add members"}, {"number": 3, "title": "Payment", "description": "Monthly billing"}, {"number": 4, "title": "Collaborate", "description": "Start working together"}]'::jsonb,
   '[{"question": "Free trial available?", "answer": "Yes, 14 days free"}, {"question": "Can I downgrade?", "answer": "Yes, anytime"}]'::jsonb,
   true),

  ('canva-pro', 'Canva Pro Design', 49.99, business_id,
   'Professional design tool with templates, graphics, and video editing. Create stunning visuals in minutes.',
   4.6, 312, true,
   '["Templates", "Millions of graphics", "Video editing", "Cloud storage", "Brand kit", "Scheduled posting"]'::jsonb,
   '[{"label": "Templates", "value": "1M+"}, {"label": "Storage", "value": "Unlimited"}, {"label": "Exports", "value": "Unlimited"}]'::jsonb,
   '[{"number": 1, "title": "Sign Up", "description": "Create Canva account"}, {"number": 2, "title": "Choose Plan", "description": "Pro subscription"}, {"number": 3, "title": "Payment", "description": "Secure checkout"}, {"number": 4, "title": "Design", "description": "Start creating"}]'::jsonb,
   '[{"question": "Works offline?", "answer": "Limited offline functionality"}, {"question": "Unlimited uploads?", "answer": "Yes with Pro"}]'::jsonb,
   true)
  ON CONFLICT (slug) DO NOTHING;

END $$;

-- Insert Users
INSERT INTO users (email, password_hash, full_name, phone, role, active) VALUES
('admin@atlasvault.com', 'admin123', 'Admin User', '+216 95 555 5555', 'admin', true),
('manager@atlasvault.com', 'manager123', 'Manager User', '+216 95 555 5556', 'admin', true),
('john@example.com', 'password123', 'John Doe', '+216 20 123 4567', 'user', true),
('jane@example.com', 'password123', 'Jane Smith', '+216 20 123 4568', 'user', true),
('ahmed@example.com', 'password123', 'Ahmed Ben Ali', '+216 20 123 4569', 'user', true),
('fatima@example.com', 'password123', 'Fatima Zahra', '+216 20 123 4570', 'user', true),
('test@example.com', 'password123', 'Test User', '+216 20 123 4571', 'user', true)
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Promos
INSERT INTO promos (title, discount, discount_type, start_date, end_date, applicable_to, active) VALUES
('Summer Sale 20% Off', 20, 'percentage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', 'all', true),
('Netflix Bundle Deal', 5, 'fixed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '15 days', 'category', true),
('New Year Special', 25, 'percentage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 'all', true)
ON CONFLICT DO NOTHING;

-- Insert Sample Offers
INSERT INTO offers (name, description, condition_text, priority, expires_at, is_limited, limited_quantity, active) VALUES
('Buy 2 Get 1 Free', 'Purchase any 2 services and get 1 free on your next order', 'Valid for new customers only', 'high', CURRENT_TIMESTAMP + INTERVAL '14 days', true, 50, true),
('Refer a Friend Bonus', 'Get 10 TND credit for each friend who signs up using your code', 'Code must be used at checkout', 'medium', CURRENT_TIMESTAMP + INTERVAL '90 days', false, null, true),
('First Order 15% Off', 'New customer exclusive: 15% off your first purchase', 'Use code: FIRST15 at checkout', 'high', CURRENT_TIMESTAMP + INTERVAL '30 days', true, 100, true)
ON CONFLICT DO NOTHING;

-- Update category product counts
UPDATE categories SET product_count = (SELECT COUNT(*) FROM services WHERE services.category_id = categories.id);

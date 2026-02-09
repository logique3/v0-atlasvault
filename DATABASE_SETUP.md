# AtlasVault Database Setup Guide

## Overview
Complete setup instructions for initializing the Supabase database with tables, data, and security policies.

## Prerequisites
- Supabase project created
- Connection to Supabase via SQL Editor or psql client
- Environment variables configured (.env.local)

## Setup Steps

### Step 1: Create Tables
Execute `scripts/01_create_tables.sql` in Supabase SQL Editor

**Tables Created:**
- categories (4 main categories)
- services (24+ digital services)
- users (7 test users: 2 admin, 5 regular)
- orders (order management)
- favorites (user favorites)
- promos (promotional discounts)
- offers (special offers)
- cart_items (shopping cart)

**Features:**
- UUID primary keys
- Foreign key relationships
- Performance indexes
- Timestamp tracking

### Step 2: Insert Data
Execute `scripts/02_insert_data.sql` in Supabase SQL Editor

**Data Included:**
- **Categories** (4): The Vault, Telecom Hub, Gaming Corner, Business Suite
- **Services** (24): Netflix, Disney+, Spotify, YouTube, Apple TV, HBO Max, Orange, Tunisie Telecom, PlayStation, Xbox, Nintendo, Microsoft 365, Adobe, Slack, Canva
- **Users** (7):
  - 2 Admin accounts with full permissions
  - 5 Regular user accounts for testing
- **Promos** (3): Sample promotional discounts
- **Offers** (3): Special offers and deals

### Step 3: Apply Security Policies
Execute `scripts/03_rls_policies.sql` in Supabase SQL Editor

**Policies Configured:**
- Public read access to active categories and services
- User-specific access to their own orders and favorites
- Admin-only access to management functions
- Secure data isolation per user

## Data Structure

### Categories Table
```
id (UUID) - Primary key
name (VARCHAR) - Category name (unique)
description (TEXT) - Category description
icon (VARCHAR) - Icon emoji
color (VARCHAR) - Display color
product_count (INTEGER) - Active product count
active (BOOLEAN) - Active status
created_at/updated_at (TIMESTAMP) - Timestamps
```

### Services Table
```
id (UUID) - Primary key
slug (VARCHAR) - URL-friendly name (unique)
name (VARCHAR) - Service name
price (DECIMAL) - Price in TND
category_id (UUID) - Foreign key to categories
description (TEXT) - Full description
rating (DECIMAL) - User rating 0-5
reviews_count (INTEGER) - Number of reviews
in_stock (BOOLEAN) - Availability
features (JSONB) - Feature list array
specifications (JSONB) - Spec objects array
order_steps (JSONB) - Order process steps
faqs (JSONB) - FAQ objects array
active (BOOLEAN) - Active status
created_at/updated_at (TIMESTAMP) - Timestamps
```

### Users Table
```
id (UUID) - Primary key
email (VARCHAR) - Email (unique)
password_hash (VARCHAR) - Hashed password
full_name (VARCHAR) - User's full name
phone (VARCHAR) - Phone number
role (VARCHAR) - 'admin' or 'user'
total_spent (DECIMAL) - Total spending
orders_count (INTEGER) - Number of orders
active (BOOLEAN) - Account active
created_at/updated_at (TIMESTAMP) - Timestamps
```

### Orders Table
```
id (UUID) - Primary key
user_id (UUID) - Foreign key to users
items (JSONB) - Order items array
total_amount (DECIMAL) - Total price
status (VARCHAR) - 'pending', 'completed', 'cancelled'
payment_method (VARCHAR) - 'whatsapp', 'card', etc
notes (TEXT) - Additional notes
created_at/updated_at (TIMESTAMP) - Timestamps
```

### Favorites Table
```
id (UUID) - Primary key
user_id (UUID) - Foreign key to users
service_id (UUID) - Foreign key to services
created_at (TIMESTAMP) - Creation timestamp
Unique constraint: user_id + service_id
```

### Cart Items Table
```
id (UUID) - Primary key
user_id (UUID) - Foreign key to users
service_id (UUID) - Foreign key to services
quantity (INTEGER) - Quantity in cart
created_at/updated_at (TIMESTAMP) - Timestamps
Unique constraint: user_id + service_id
```

### Promos Table
```
id (UUID) - Primary key
title (VARCHAR) - Promotion title
discount (DECIMAL) - Discount value
discount_type (VARCHAR) - 'percentage' or 'fixed'
start_date/end_date (TIMESTAMP) - Validity period
applicable_to (VARCHAR) - 'all', 'product', or 'category'
target_id (UUID) - Product/category ID if applicable
active (BOOLEAN) - Active status
created_at/updated_at (TIMESTAMP) - Timestamps
```

### Offers Table
```
id (UUID) - Primary key
name (VARCHAR) - Offer name
description (TEXT) - Offer description
condition_text (TEXT) - Conditions/requirements
priority (VARCHAR) - 'high', 'medium', 'low'
expires_at (TIMESTAMP) - Expiration date
is_limited (BOOLEAN) - Limited quantity
limited_quantity (INTEGER) - Max quantity if limited
active (BOOLEAN) - Active status
created_at/updated_at (TIMESTAMP) - Timestamps
```

## Test Credentials

### Admin Accounts
| Email | Password | Role |
|-------|----------|------|
| admin@atlasvault.com | admin123 | Admin |
| manager@atlasvault.com | manager123 | Admin |

### User Accounts
| Email | Password | Name |
|-------|----------|------|
| john@example.com | password123 | John Doe |
| jane@example.com | password123 | Jane Smith |
| ahmed@example.com | password123 | Ahmed Ben Ali |
| fatima@example.com | password123 | Fatima Zahra |
| test@example.com | password123 | Test User |

## Verification Checklist

After setup, verify:

- [ ] 4 categories exist with product counts
- [ ] 24 services display correctly
- [ ] 7 users available for testing
- [ ] 3 promos visible (active only)
- [ ] 3 offers visible (active only)
- [ ] RLS policies enabled
- [ ] Admin users can create/edit services
- [ ] Regular users can only view public data
- [ ] Users can create/manage own favorites
- [ ] Users can create/manage own orders

## Indexes Created

For optimal performance:
- `idx_services_category` - Quick category filtering
- `idx_services_active` - Active status queries
- `idx_orders_user` - User order lookup
- `idx_orders_created` - Date-based queries
- `idx_favorites_user` - User favorites
- `idx_favorites_service` - Service favorites
- `idx_cart_items_user` - User cart lookup
- `idx_users_email` - Email lookup
- `idx_users_role` - Role-based queries

## Real-Time Features

All tables support real-time subscriptions via Supabase:
- Categories updates
- Service price/availability changes
- New orders
- Favorites changes
- Cart updates

## Next Steps

1. Execute all three SQL files in order
2. Verify data in Supabase dashboard
3. Test login with demo credentials
4. Update frontend components to use database
5. Test real-time subscriptions
6. Configure environment variables
7. Deploy to production

## Troubleshooting

**Error: "relation already exists"**
- Tables already exist, safe to ignore or drop and recreate

**Password fields showing plaintext**
- Use proper bcrypt hashing in application layer
- SQL files use plaintext for testing only

**RLS policies not working**
- Ensure `auth.uid()` is properly set via authentication
- Check JWT claims for admin role

**Missing data after insert**
- Check active status for services (must be true)
- Check date ranges for promos and offers

## Support

For issues:
1. Check Supabase dashboard logs
2. Verify SQL syntax in editor
3. Check foreign key relationships
4. Ensure RLS policies are correct

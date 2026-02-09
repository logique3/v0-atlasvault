# Database Migration Guide - Supabase Integration

## Overview
This guide will help you migrate from mock data to a real Supabase PostgreSQL database with real-time synchronization capabilities.

## Prerequisites
- Supabase account and project configured
- All environment variables set (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Access to Supabase SQL editor

## Step 1: Initialize Database Schema

### Option A: Using Supabase SQL Editor (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Click "New Query"
4. Copy and paste the contents of `scripts/init-database.sql`
5. Click "Run" to execute

This will create:
- Categories table
- Services table
- User profiles table
- Orders table
- Order items table
- Favorites table
- User statistics table
- All necessary indexes
- Row Level Security policies
- Automatic triggers

### Option B: Using Supabase CLI
```bash
supabase db push
```

## Step 2: Seed Sample Data

Execute this SQL in the Supabase SQL editor:

```sql
-- Insert sample categories
INSERT INTO categories (name, slug, description, icon, color, active) VALUES
('The Vault', 'vault', 'International streaming subscriptions', '📺', 'blue', true),
('Telecom Hub', 'telecom', 'Internet bundles and mobile top-ups', '📱', 'green', true),
('Gaming Corner', 'gaming', 'Gaming credits and subscriptions', '🎮', 'orange', true),
('Business Suite', 'business', 'Professional productivity tools', '💼', 'purple', true);

-- Insert sample services
INSERT INTO services (name, slug, description, price, category_id, rating, reviews_count, in_stock, active) 
SELECT 
  'Netflix Premium',
  'netflix-premium',
  'Unlimited movies, TV shows, and games on 4 screens',
  15.99,
  c.id,
  4.8,
  324,
  true,
  true
FROM categories c WHERE c.slug = 'vault'
ON CONFLICT (slug) DO NOTHING;

-- Add more services as needed
```

## Step 3: Update Frontend Components

### Update Products Page
The products page needs to use real Supabase data instead of hardcoded mock data:

```typescript
'use client'

import { useSyncServices, useSyncCategories } from '@/lib/hooks/useDataSync'

export default function ProductsPage() {
  const { categories, isLoading: categoriesLoading } = useSyncCategories()
  const { services, isLoading: servicesLoading } = useSyncServices()

  if (categoriesLoading || servicesLoading) return <Spinner />

  return (
    <div>
      {/* Render categories and services from database */}
    </div>
  )
}
```

### Update Dashboard
```typescript
'use client'

import { useSyncUserOrders, useSyncUserFavorites } from '@/lib/hooks/useDataSync'
import { useAuth } from '@/lib/auth-context'

export default function DashboardPage() {
  const { user } = useAuth()
  const { orders } = useSyncUserOrders(user?.id || '')
  const { favorites } = useSyncUserFavorites(user?.id || '')

  return (
    <div>
      {/* Real-time orders and favorites */}
    </div>
  )
}
```

## Step 4: User Authentication Setup

When users sign up or login:

```typescript
import { createUserProfile } from '@/lib/database/users'

// After authentication
await createUserProfile(
  userId,
  email,
  fullName,
  phone,
  'user'
)
```

## Step 5: Order Management

Create orders in the database:

```typescript
import { createOrder } from '@/lib/database/orders'

const order = await createOrder(
  userId,
  totalAmount,
  'whatsapp',
  items,
  notes
)
```

## Real-time Updates

The system automatically subscribes to database changes:

### Categories Real-time
```typescript
const { categories } = useSyncCategories({
  enableRealtimeUpdates: true // Automatic real-time sync
})
```

### Services Real-time
```typescript
const { services } = useSyncServices(categoryId, {
  enableRealtimeUpdates: true
})
```

### Orders Real-time (Users)
```typescript
const { orders } = useSyncUserOrders(userId, {
  enableRealtimeUpdates: true
})
```

### Admin Orders Real-time
```typescript
import { subscribeToOrders } from '@/lib/database/orders'

useEffect(() => {
  const unsubscribe = subscribeToOrders((order) => {
    // New order received in real-time
    setOrders(prev => [order, ...prev])
  })
  
  return unsubscribe
}, [])
```

## Verification Checklist

- [ ] Database schema created successfully
- [ ] Sample data inserted
- [ ] Categories display in products page
- [ ] Services display correctly
- [ ] User can create account (saved to user_profiles)
- [ ] Orders are created in database
- [ ] Order items saved correctly
- [ ] Real-time updates work (add a favorite and watch it update)
- [ ] Admin can see all orders
- [ ] User can see only their orders

## Troubleshooting

### No data showing in frontend
1. Check if tables exist: `SELECT tablename FROM pg_tables WHERE schemaname='public'`
2. Verify RLS policies: `SELECT * FROM pg_policies`
3. Check browser console for [v0] logs
4. Verify environment variables are set

### Real-time updates not working
1. Ensure Realtime is enabled in Supabase project settings
2. Check if subscription functions are called
3. Verify RLS policies allow reading the tables
4. Check browser console for subscription errors

### Authentication issues
1. Verify users are in auth.users table
2. Check if user_profiles rows exist
3. Ensure RLS policies match user IDs
4. Check auth.uid() returns correct user ID

## Data Synchronization Architecture

```
Frontend (React Components)
        ↓
Data Sync Hooks (useDataSync.ts)
        ↓
Database Services (services.ts, orders.ts, users.ts, favorites.ts)
        ↓
Supabase Client (supabase.ts)
        ↓
PostgreSQL Database + Real-time Subscriptions
```

### Flow:
1. Component mounts → calls useSyncServices()
2. Hook fetches data from Supabase
3. Supabase subscribes to table changes
4. Database changes → Real-time event
5. Hook updates component state
6. Component re-renders with fresh data

## Performance Optimization

### Caching
- Data is cached in component state
- Set `cacheExpiry` in sync hooks to auto-refresh
- Manual refresh available via `refetch()`

### Query Optimization
- Queries use `.select()` with specific fields
- Indexes created on frequently filtered columns
- Pagination available with `limit` and `offset`

### Real-time Limits
- Real-time subscriptions limited to 200 connections per project
- Use real-time only for critical data (orders, favorites)
- Disable real-time in background tabs if needed

## Migration Path (Optional)

### Phase 1: Dual Mode
- Keep mock data as fallback
- Use Supabase for new features
- Gradually migrate components

### Phase 2: Full Migration
- Update all components to use Supabase
- Remove mock data files
- Enable RLS completely

### Phase 3: Optimization
- Implement caching strategies
- Optimize queries based on usage
- Add audit logging

## File Structure

```
lib/
  ├── database/
  │   ├── services.ts       # Categories & Services queries
  │   ├── orders.ts         # Order management
  │   ├── users.ts          # User management
  │   └── favorites.ts      # Favorites management
  ├── hooks/
  │   └── useDataSync.ts    # Real-time sync hooks
  └── supabase.ts           # Supabase client

scripts/
  └── init-database.sql     # Database initialization

app/
  ├── products/page.tsx     # Update to use database
  ├── dashboard/page.tsx    # Update to use database
  └── admin/page.tsx        # Update to use database
```

## Support & Debugging

Check console logs with `[v0]` prefix for detailed information:
- Data fetch operations
- Real-time subscription events
- Error messages
- Sync status

Visit `/auth-diagnostics` for system status verification.

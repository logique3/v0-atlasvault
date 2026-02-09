# Supabase Integration - Quick Start (5 Minutes)

## 1. Initialize Database (1 minute)

Go to your Supabase project → SQL Editor → New Query

Paste this (or run `scripts/init-database.sql`):
```sql
-- (Copy entire contents of scripts/init-database.sql and execute)
```

✓ Tables created with RLS policies and triggers

## 2. Seed Sample Data (30 seconds)

Add categories and sample services:
```sql
INSERT INTO categories (name, slug, description, icon, color, active) VALUES
('The Vault', 'vault', 'Streaming subscriptions', '📺', 'blue', true),
('Telecom Hub', 'telecom', 'Internet & top-ups', '📱', 'green', true),
('Gaming Corner', 'gaming', 'Gaming credits', '🎮', 'orange', true);
```

## 3. Update Products Page (2 minutes)

Replace mock data with database queries:

```typescript
'use client'

import { useSyncCategories, useSyncServices } from '@/lib/hooks/useDataSync'

function ProductsContent() {
  const { categories } = useSyncCategories()
  const { services } = useSyncServices()

  if (!categories.length) return <p>Loading...</p>

  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          {services
            .filter(s => s.category_id === category.id)
            .map(service => (
              <ProductCard key={service.id} {...service} />
            ))}
        </div>
      ))}
    </div>
  )
}

export default function ProductsPage() {
  return <ProductsContent />
}
```

## 4. Update Dashboard (1.5 minutes)

```typescript
'use client'

import { useSyncUserOrders, useSyncUserFavorites } from '@/lib/hooks/useDataSync'
import { useAuth } from '@/lib/auth-context'

export default function Dashboard() {
  const { user } = useAuth()
  const { orders } = useSyncUserOrders(user?.id || '')
  const { favorites } = useSyncUserFavorites(user?.id || '')

  return (
    <div>
      <h1>Welcome {user?.fullName}</h1>
      
      <div>
        <h2>Your Orders ({orders.length})</h2>
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      <div>
        <h2>Favorites ({favorites.length})</h2>
        {favorites.map(fav => (
          <ServiceCard key={fav.service_id} {...fav.services} />
        ))}
      </div>
    </div>
  )
}
```

## 5. Test Real-Time Updates (Optional)

Open two browser windows:
1. Window 1: Products page
2. Window 2: Supabase SQL Editor

Add a service:
```sql
INSERT INTO services (name, slug, price, category_id, in_stock, active) VALUES
('New Service', 'new-service', 9.99, (SELECT id FROM categories LIMIT 1), true, true);
```

✓ Window 1 updates instantly with new service

## What's Now Synced with Database

✓ Categories  
✓ Services  
✓ Orders  
✓ Favorites  
✓ User Profiles  
✓ User Statistics  

## Real-Time Features Enabled

✓ New categories appear instantly  
✓ Service changes reflect immediately  
✓ Orders sync across admin dashboard  
✓ Favorites update instantly  
✓ Admin sees new orders in real-time  

## Available Hooks

```typescript
// Categories - real-time synced
const { categories, isLoading, error, refetch } = useSyncCategories()

// Services - filtered by category, real-time
const { services } = useSyncServices(categoryId)

// User Orders - with real-time updates
const { orders } = useSyncUserOrders(userId)

// Favorites - real-time synced
const { favorites } = useSyncUserFavorites(userId)
```

## Available Functions

```typescript
import { getCategories, getServices, getServiceBySlug, searchServices } from '@/lib/database/services'
import { createOrder, getUserOrders, getOrder, updateOrderStatus } from '@/lib/database/orders'
import { getUserProfile, updateUserProfile, createUserProfile } from '@/lib/database/users'
import { addFavorite, removeFavorite, getUserFavorites, isFavorited } from '@/lib/database/favorites'

// Examples:
const categories = await getCategories()
const services = await getServices(categoryId)
const order = await createOrder(userId, totalAmount, paymentMethod, items)
const userFavorites = await getUserFavorites(userId)
```

## Debugging

Check browser console for `[v0]` logs:
```
[v0] Syncing categories from database
[v0] Categories synced successfully
[v0] Real-time category update received
```

## Architecture

```
Components
    ↓
useDataSync Hooks (automatic real-time)
    ↓
Database Services (queries + subscriptions)
    ↓
Supabase Client
    ↓
PostgreSQL + Real-time Replication
```

## Key Points

1. **Real-time enabled by default** - no extra config needed
2. **Type-safe** - all functions have TypeScript types
3. **Error handled** - try-catch in all functions
4. **Logged** - [v0] prefix in console for debugging
5. **Documented** - See SUPABASE_SYNC_IMPLEMENTATION.md for details

## Troubleshooting

**No data showing?**
```
1. Check Supabase SQL Editor - are tables created?
2. Check browser console for [v0] errors
3. Verify NEXT_PUBLIC_SUPABASE_URL is set
```

**Real-time not working?**
```
1. Make sure Realtime is enabled in Supabase
2. Check if subscriptions are starting (console logs)
3. Verify RLS policies allow access
```

**Database connected but no data?**
```
1. Run: SELECT * FROM categories; in SQL Editor
2. If empty, add sample data
3. Check RLS - may be blocking queries
```

## Next: Full Documentation

See `DATABASE_MIGRATION_GUIDE.md` for complete setup instructions.  
See `SUPABASE_SYNC_IMPLEMENTATION.md` for architecture details.

**You're now synced with Supabase! 🎉**

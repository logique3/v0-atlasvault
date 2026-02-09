# Supabase Frontend Synchronization - Implementation Guide

## Phase 1: Database Setup (FOUNDATIONAL)

### Step 1.1: Create Tables in Supabase

**Location:** Supabase Dashboard → SQL Editor

**Actions:**
1. Open Supabase Dashboard for your project
2. Navigate to SQL Editor
3. Copy entire contents of `SUPABASE_MIGRATIONS.sql`
4. Run the SQL script
5. Verify all tables created (see verification queries at bottom)

**Verification:**
```bash
# Check tables in Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;
```

Expected tables:
- ✓ categories
- ✓ services
- ✓ promos
- ✓ offers
- ✓ users
- ✓ orders
- ✓ favorites
- ✓ cart_items

### Step 1.2: Enable Real-Time Replication

**Location:** Supabase Dashboard → Database → Replication

1. Enable publication for each table:
   - services
   - categories
   - promos
   - offers
   - orders
   - favorites
   - cart_items

2. Set replication mode: "INSERT, UPDATE, DELETE"

3. Test real-time by making changes in Supabase UI

### Step 1.3: Configure Row Level Security (RLS)

✓ Already configured in migration script

**Verify RLS is enabled:**
```sql
SELECT * FROM pg_policies;
```

All tables should have policies listed.

### Step 1.4: Create Storage Bucket (for images)

**Location:** Supabase Dashboard → Storage

1. Create new bucket named: `service-images`
2. Make it public: Toggle "Public bucket"
3. Set file size limit: 10 MB
4. Allowed file types: image/*

---

## Phase 2: Supabase Client Setup

### Step 2.1: Create Supabase Client File

**File:** `lib/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Server-side client for API routes
export const supabaseServer = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### Step 2.2: Verify Environment Variables

Check `.env.local` contains:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Phase 3: Service Layer Implementation

### Step 3.1: Services Operations

**File:** `lib/supabase/services.ts`

```typescript
import { supabase } from './client'

// Fetch all active services
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Fetch service by slug
export async function getServiceBySlug(slug: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

// Fetch services by category
export async function getServicesByCategory(categoryId: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('category_id', categoryId)
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Real-time subscription to services
export function subscribeToServices(callback: (data: any) => void) {
  const subscription = supabase
    .from('services')
    .on('*', (payload) => {
      callback(payload)
    })
    .subscribe()

  return subscription
}
```

### Step 3.2: Categories Operations

**File:** `lib/supabase/categories.ts`

```typescript
import { supabase } from './client'

// Fetch all categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Real-time category subscription
export function subscribeToCategories(callback: (data: any) => void) {
  const subscription = supabase
    .from('categories')
    .on('*', (payload) => {
      callback(payload)
    })
    .subscribe()

  return subscription
}
```

### Step 3.3: Orders Operations

**File:** `lib/supabase/orders.ts`

```typescript
import { supabase } from './client'

// Fetch user orders
export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Create order
export async function createOrder(userId: string, order: any) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ user_id: userId, ...order }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Step 3.4: Favorites Operations

**File:** `lib/supabase/favorites.ts`

```typescript
import { supabase } from './client'

// Fetch user favorites
export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .select('service_id, services(*)')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

// Add favorite
export async function addFavorite(userId: string, serviceId: string) {
  const { data, error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, service_id: serviceId }])
    .select()

  if (error) throw error
  return data
}

// Remove favorite
export async function removeFavorite(userId: string, serviceId: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('service_id', serviceId)

  if (error) throw error
}
```

---

## Phase 4: Custom Hooks

### Step 4.1: Real-Time Data Hook

**File:** `hooks/use-supabase-data.ts`

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useSupabaseData(table: string, query?: any) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initial fetch
    async function fetchData() {
      try {
        setLoading(true)
        let q = supabase.from(table).select('*')

        if (query?.eq) {
          Object.entries(query.eq).forEach(([key, value]) => {
            q = q.eq(key, value)
          })
        }

        const { data: result, error: err } = await q

        if (err) throw err
        setData(result || [])
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Subscribe to real-time changes
    const subscription = supabase
      .from(table)
      .on('*', (payload) => {
        if (payload.eventType === 'INSERT') {
          setData((prev) => [payload.new, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setData((prev) =>
            prev.map((item: any) =>
              item.id === payload.new.id ? payload.new : item
            )
          )
        } else if (payload.eventType === 'DELETE') {
          setData((prev) => prev.filter((item: any) => item.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => subscription.unsubscribe()
  }, [table, query])

  return { data, loading, error }
}
```

---

## Phase 5: Context Integration

### Step 5.1: Update Auth Context

Modify `lib/auth-context.tsx` to use Supabase Auth:

```typescript
import { supabase } from '@/lib/supabase/client'

// Use Supabase Auth instead of localStorage
const { data: { user } } = await supabase.auth.getUser()

// Store session in context
const session = await supabase.auth.getSession()
setUser(session.user)
```

### Step 5.2: Update Orders Context

Modify `lib/orders-context.tsx`:

```typescript
import { getUserOrders } from '@/lib/supabase/orders'
import { useSupabaseData } from '@/hooks/use-supabase-data'

// Use real Supabase data
const { data: orders } = useSupabaseData('orders', { eq: { user_id: userId } })
```

---

## Phase 6: Component Migration

### Step 6.1: Update Products Page

Modify `app/products/page.tsx`:

```typescript
import { useSupabaseData } from '@/hooks/use-supabase-data'

function ProductsContent() {
  const { data: services } = useSupabaseData('services')
  const { data: categories } = useSupabaseData('categories')
  
  return (
    // Render services from Supabase
  )
}
```

### Step 6.2: Update Admin Dashboard

Modify `app/admin/page.tsx`:

```typescript
// Fetch live data from Supabase
const { data: allServices } = useSupabaseData('services')
const { data: allCategories } = useSupabaseData('categories')
const { data: allOrders } = useSupabaseData('orders')
const { data: allUsers } = useSupabaseData('users')
```

---

## Phase 7: Data Migration

### Step 7.1: Migrate Mock Data

1. Export mock data from `lib/mock-data.ts` and `lib/services-db.ts`
2. Transform to match Supabase schema
3. Insert via SQL Editor or API

### Step 7.2: Verify Data Integrity

```sql
-- Check service counts
SELECT COUNT(*) FROM services WHERE active = true;

-- Check category counts
SELECT COUNT(*) FROM categories WHERE active = true;

-- Check for duplicates
SELECT name, COUNT(*) FROM services GROUP BY name HAVING COUNT(*) > 1;
```

---

## Phase 8: Testing Checklist

### Real-Time Sync Tests
- [ ] Add service via admin → See on products page immediately
- [ ] Update service → See changes instantly
- [ ] Delete service → See removal immediately
- [ ] Multiple users → See same data simultaneously

### Data Integrity Tests
- [ ] All categories display correctly
- [ ] All services visible with correct prices
- [ ] Promos apply correctly
- [ ] Offers display with proper dates
- [ ] User orders sync across devices

### Performance Tests
- [ ] Products page loads in <1s
- [ ] Real-time updates latency <500ms
- [ ] Search works smoothly
- [ ] Filtering responds instantly

### Error Handling Tests
- [ ] Network error → Show message
- [ ] Invalid data → Validation error
- [ ] Timeout → Retry logic
- [ ] Server down → Fallback behavior

---

## Phase 9: Deployment Checklist

- [ ] All environment variables set
- [ ] RLS policies verified
- [ ] Real-time replication enabled
- [ ] Backup before going live
- [ ] Test in staging environment
- [ ] Monitor error logs
- [ ] Check Supabase dashboard metrics
- [ ] User acceptance testing
- [ ] Remove mock data references
- [ ] Deploy to production

---

## Phase 10: Post-Deployment Monitoring

### Metrics to Monitor
- Query performance
- Real-time latency
- Error rates
- User feedback
- Data consistency
- System uptime

### Tools
- Supabase Dashboard Metrics
- Console error logs
- Sentry/Error tracking
- User feedback channels

---

## Troubleshooting Guide

### Issue: "No rows returned" error
**Solution:** Check RLS policies, ensure user has proper permissions

### Issue: Real-time updates not working
**Solution:** Verify replication enabled, check network connection

### Issue: Slow queries
**Solution:** Check indexes created, use pagination, optimize queries

### Issue: Data inconsistency
**Solution:** Run verification queries, check for duplicate entries

---

## Next Steps After Implementation

1. ✓ Remove mock data from codebase
2. ✓ Archive old localStorage implementation
3. ✓ Set up monitoring and alerts
4. ✓ Create admin documentation
5. ✓ Train team on Supabase management
6. ✓ Implement automated backups
7. ✓ Set up CI/CD for migrations

---

**Version:** 1.0  
**Status:** Ready for Implementation  
**Contact:** Dev Team

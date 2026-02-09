# Supabase Synchronization - Quick Reference Card

## 1. Import Hooks

```typescript
import { 
  useSyncCategories, 
  useSyncServices, 
  useSyncUserOrders,
  useSyncUserFavorites 
} from '@/lib/hooks/useDataSync'
```

## 2. Use Sync Hooks

### Get Categories (Real-time)
```typescript
const { categories, isLoading, error, refetch } = useSyncCategories()
```

### Get Services (Real-time, by Category)
```typescript
const { services, isLoading, error, refetch } = useSyncServices(categoryId)
```

### Get User Orders (Real-time)
```typescript
const { orders, isLoading, error, refetch } = useSyncUserOrders(userId)
```

### Get User Favorites (Real-time)
```typescript
const { favorites, isLoading, error, refetch } = useSyncUserFavorites(userId)
```

## 3. Direct Database Functions

### Services
```typescript
import { 
  getCategories, 
  getServices, 
  getServiceBySlug, 
  searchServices 
} from '@/lib/database/services'

const categories = await getCategories()
const services = await getServices(categoryId)
const service = await getServiceBySlug('netflix-premium')
const results = await searchServices('netflix', categoryId)
```

### Orders
```typescript
import { 
  createOrder, 
  getUserOrders, 
  getOrder, 
  updateOrderStatus 
} from '@/lib/database/orders'

const order = await createOrder(userId, totalAmount, paymentMethod, items)
const userOrders = await getUserOrders(userId, 'completed')
const order = await getOrder(orderId)
await updateOrderStatus(orderId, 'completed')
```

### Favorites
```typescript
import { 
  addFavorite, 
  removeFavorite, 
  getUserFavorites, 
  isFavorited 
} from '@/lib/database/favorites'

await addFavorite(userId, serviceId)
await removeFavorite(userId, serviceId)
const favorites = await getUserFavorites(userId)
const isFav = await isFavorited(userId, serviceId)
```

### Users
```typescript
import { 
  getUserProfile, 
  updateUserProfile, 
  createUserProfile 
} from '@/lib/database/users'

const profile = await getUserProfile(userId)
await updateUserProfile(userId, { full_name: 'John' })
await createUserProfile(userId, email, fullName, phone, 'user')
```

## 4. Common Patterns

### Fetch and Display with Real-Time Updates
```typescript
'use client'

import { useSyncServices } from '@/lib/hooks/useDataSync'

export default function ServicesList({ categoryId }: { categoryId: string }) {
  const { services, isLoading, error } = useSyncServices(categoryId)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div>
      {services.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}
```

### Create Order and Sync
```typescript
'use client'

import { createOrder } from '@/lib/database/orders'
import { useSyncUserOrders } from '@/lib/hooks/useDataSync'

export default function Checkout({ userId }: { userId: string }) {
  const { refetch } = useSyncUserOrders(userId)

  const handleOrder = async (items: OrderItem[]) => {
    const order = await createOrder(userId, total, 'whatsapp', items)
    await refetch() // Refetch orders to include new order
    toast.success('Order created!')
  }

  return <CheckoutForm onSubmit={handleOrder} />
}
```

### Check and Toggle Favorite
```typescript
'use client'

import { addFavorite, removeFavorite, isFavorited } from '@/lib/database/favorites'

export default function FavoriteButton({ userId, serviceId }: Props) {
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    isFavorited(userId, serviceId).then(setIsFav)
  }, [userId, serviceId])

  const handleToggle = async () => {
    if (isFav) {
      await removeFavorite(userId, serviceId)
    } else {
      await addFavorite(userId, serviceId)
    }
    setIsFav(!isFav)
  }

  return <button onClick={handleToggle}>⭐ {isFav ? 'Saved' : 'Save'}</button>
}
```

## 5. Real-Time Subscriptions (Advanced)

### Subscribe to Orders (Admin)
```typescript
import { subscribeToOrders } from '@/lib/database/orders'

useEffect(() => {
  const unsubscribe = subscribeToOrders((order) => {
    console.log('New order:', order)
    // Update admin dashboard
  })

  return unsubscribe
}, [])
```

### Subscribe to Favorites
```typescript
import { subscribeToFavorites } from '@/lib/database/favorites'

useEffect(() => {
  const unsubscribe = subscribeToFavorites(userId, (favorites) => {
    setFavorites(favorites)
  })

  return unsubscribe
}, [userId])
```

## 6. Error Handling

```typescript
const { services, error } = useSyncServices(categoryId)

if (error) {
  console.error('[v0] Error:', error)
  return <ErrorBoundary message={error} />
}
```

All functions throw errors with detailed [v0] console logging.

## 7. Optimization Tips

### Only Fetch When Needed
```typescript
// Only fetch if user is logged in
const { orders } = useSyncUserOrders(userId || '')

// Conditional rendering
{userId && <UserOrders />}
```

### Disable Real-Time if Not Needed
```typescript
const { services } = useSyncServices(categoryId, {
  enableRealtimeUpdates: false // Cheaper on connections
})
```

### Manual Refresh
```typescript
const { refetch } = useSyncServices(categoryId)

// Refresh data manually
<button onClick={refetch}>Refresh</button>
```

## 8. Admin Functions

```typescript
import { getAllOrders, getOrderStats } from '@/lib/database/orders'
import { getAllUsers, getUserStats_Admin } from '@/lib/database/users'

// Get all orders with pagination
const { data, count } = await getAllOrders('completed', 10, 0)

// Get statistics
const stats = await getOrderStats()
const userStats = await getUserStats_Admin()
```

## 9. Console Debugging

All operations log to console with [v0] prefix:

```
[v0] Fetching categories from Supabase
[v0] Categories fetched: 4
[v0] Real-time service update received
[v0] Creating order for user: user-123
[v0] Order created: order-456
```

## 10. Type Definitions

```typescript
interface Service {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category_id: string
  image_url?: string
  rating: number
  reviews_count: number
  in_stock: boolean
  active: boolean
  created_at: string
  updated_at: string
}

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'completed' | 'cancelled'
  payment_method: string
  notes?: string
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  active: boolean
  created_at: string
  updated_at: string
}
```

## Cheatsheet

| Task | Code |
|------|------|
| Get categories | `const { categories } = useSyncCategories()` |
| Get services | `const { services } = useSyncServices(categoryId)` |
| Get orders | `const { orders } = useSyncUserOrders(userId)` |
| Get favorites | `const { favorites } = useSyncUserFavorites(userId)` |
| Create order | `await createOrder(userId, amount, method, items)` |
| Add favorite | `await addFavorite(userId, serviceId)` |
| Search services | `const results = await searchServices('query')` |
| Update user | `await updateUserProfile(userId, { full_name: '' })` |
| Get user profile | `const profile = await getUserProfile(userId)` |
| Subscribe orders | `const unsub = subscribeToOrders(callback)` |

---

**All real-time by default • Type-safe • Error handled • [v0] logged**

# Next.js 16 Async/Client Component Fixes

## Issue: Async Client Components

In Next.js 16, components marked with `'use client'` cannot be async. This is a breaking change from Next.js 15.

### Error Messages
```
"<Component> is an async Client Component. Only Server Components can be async at the moment."
"A component was suspended by an uncached promise. Creating promises inside a Client Component..."
```

---

## Solution 1: Remove 'use client' (Make it a Server Component)

**When:** The component only needs to fetch data, not use React hooks

**Before:**
```typescript
'use client'

export default async function ProductPage() {
  const product = await fetchProduct()
  return <div>{product.name}</div>
}
```

**After:**
```typescript
// Remove 'use client' - this is now a Server Component
export default async function ProductPage() {
  const product = await fetchProduct()
  return <div>{product.name}</div>
}
```

---

## Solution 2: Split into Server + Client Components

**When:** Component needs both async data fetching AND client interactions

**Server Component (Parent):**
```typescript
// app/product/[slug]/page.tsx - Server Component (no 'use client')
import { ProductDetail } from './product-detail'

export default async function Page() {
  const product = await fetchProduct()
  
  return <ProductDetail product={product} />
}
```

**Client Component (Child):**
```typescript
// app/product/[slug]/product-detail.tsx - Client Component
'use client'

import { useState } from 'react'

export function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(1)
  
  return <div>...</div>
}
```

---

## Solution 3: Use useEffect for Async in Client Components

**When:** Absolutely must use 'use client' and need async data

**Pattern:**
```typescript
'use client'

import { useEffect, useState } from 'react'

export default function Page() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const result = await fetch('/api/data')
      const json = await result.json()
      setData(json)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  return <div>{data}</div>
}
```

---

## Solution 4: Use Suspense with Lazy Components

**Pattern:**
```typescript
import { Suspense } from 'react'
import { Spinner } from '@/components/ui/spinner'

async function ProductData({ id }) {
  const product = await fetchProduct(id)
  return <div>{product.name}</div>
}

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <ProductData id="123" />
    </Suspense>
  )
}
```

---

## Fixed Files

### ✅ app/product/[slug]/page.tsx
**Issue:** Was marked `'use client'` with async function
**Fix:** Removed `'use client'` directive → Now a Server Component
**Status:** FIXED

---

## Best Practices for Next.js 16

### 1. Server Components (Default)
- Use for data fetching
- Use for sensitive operations
- Use for accessing databases directly

```typescript
// Server Component (no 'use client')
export default async function Page() {
  const data = await db.query()
  return <View data={data} />
}
```

### 2. Client Components (Only When Needed)
- Use for interactivity (useState, onClick, etc.)
- Use for hooks (useEffect, useContext, etc.)
- Use for browser APIs (localStorage, window, etc.)

```typescript
'use client'

export default function View({ data }) {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### 3. Hybrid Pattern (Recommended)
Separate data fetching (Server) from interaction (Client)

```typescript
// Server Component
async function Page() {
  const data = await fetchData()
  return <ClientComponent data={data} />
}

// Client Component
'use client'
export function ClientComponent({ data }) {
  // Interactive logic here
}
```

---

## Utility Functions

Use `lib/next16-utils.ts` for common patterns:

```typescript
import { 
  resolveParams, 
  resolveSearchParams, 
  getParam,
  formatErrorMessage,
  retryAsync 
} from '@/lib/next16-utils'

// In Server Components:
export async function Page({ params, searchParams }) {
  const resolvedParams = await resolveParams(params)
  const slug = await getParam(params, 'slug')
  const page = getSearchParam(searchParams, 'page')
  
  try {
    const data = await retryAsync(() => fetchData(slug))
    return <View data={data} />
  } catch (error) {
    const message = formatErrorMessage(error)
    return <Error message={message} />
  }
}
```

---

## Common Scenarios

### Dynamic Routes with Database Query

**app/product/[slug]/page.tsx:**
```typescript
// Remove 'use client' - make it async Server Component
import { notFound } from 'next/navigation'
import { ProductDetail } from './product-detail'

export default async function Page({ params }) {
  const { slug } = await params
  
  const product = await db.products.findUnique({ where: { slug } })
  
  if (!product) notFound()
  
  return <ProductDetail product={product} />
}
```

### With Interactive Features

**app/product/[slug]/product-detail.tsx:**
```typescript
'use client'

import { useState } from 'react'

export function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [isFavorited, setIsFavorited] = useState(false)
  
  return (
    <div>
      <h1>{product.name}</h1>
      <button onClick={() => setQuantity(quantity + 1)}>Add</button>
      <button onClick={() => setIsFavorited(!isFavorited)}>
        {isFavorited ? '❤️' : '🤍'}
      </button>
    </div>
  )
}
```

---

## Troubleshooting

### Error: "async Client Component"
**Solution:** Remove `'use client'` or split into Server + Client

### Error: "suspended by uncached promise"  
**Solution:** Use useEffect instead of direct await

### Error: "Cannot use hooks in Server Component"
**Solution:** Move hook usage to Client Component

### Data Not Updating
**Solution:** Use useEffect with proper dependencies in Client Component

---

## Checklist

- ✅ Removed `'use client'` from async page components
- ✅ Split data fetching (Server) from interaction (Client)
- ✅ Use useEffect for async in Client Components
- ✅ Wrap dynamic routes with Suspense
- ✅ Use try/catch for error handling
- ✅ Test all pages load without errors

---

## References

- [Next.js 16 Server/Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Async Components](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Suspense](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#streaming-with-suspense)

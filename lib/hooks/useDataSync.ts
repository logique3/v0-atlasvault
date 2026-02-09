import { useEffect, useState, useCallback } from 'react'
import { getCategories, getServices, subscribeToCategories, subscribeToServices } from '@/lib/database/services'
import { getUserOrders, subscribeToOrders } from '@/lib/database/orders'
import { getUserFavorites, subscribeToFavorites } from '@/lib/database/favorites'

interface DataSyncOptions {
  enableRealtimeUpdates?: boolean
  cacheExpiry?: number // in milliseconds
}

// Hook to sync categories with real-time updates
export function useSyncCategories(options: DataSyncOptions = {}) {
  const { enableRealtimeUpdates = true, cacheExpiry = 5 * 60 * 1000 } = options
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<number>(0)

  const fetchCategories = useCallback(async () => {
    console.log('[v0] Syncing categories from database')
    setIsLoading(true)
    try {
      const data = await getCategories()
      setCategories(data)
      setLastSync(Date.now())
      setError(null)
      console.log('[v0] Categories synced successfully')
    } catch (err) {
      console.error('[v0] Error syncing categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to sync categories')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initial fetch
    fetchCategories()

    // Set up real-time subscription if enabled
    let unsubscribe: (() => void) | null = null

    if (enableRealtimeUpdates) {
      unsubscribe = subscribeToCategories((updatedCategories) => {
        console.log('[v0] Real-time category update received')
        setCategories(updatedCategories)
        setLastSync(Date.now())
      })
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [fetchCategories, enableRealtimeUpdates])

  return { categories, isLoading, error, refetch: fetchCategories, lastSync }
}

// Hook to sync services with real-time updates
export function useSyncServices(
  categoryId?: string,
  options: DataSyncOptions = {}
) {
  const { enableRealtimeUpdates = true, cacheExpiry = 5 * 60 * 1000 } = options
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<number>(0)

  const fetchServices = useCallback(async () => {
    console.log('[v0] Syncing services from database', categoryId ? `for category: ${categoryId}` : '')
    setIsLoading(true)
    try {
      const data = await getServices(categoryId)
      setServices(data)
      setLastSync(Date.now())
      setError(null)
      console.log('[v0] Services synced successfully')
    } catch (err) {
      console.error('[v0] Error syncing services:', err)
      setError(err instanceof Error ? err.message : 'Failed to sync services')
    } finally {
      setIsLoading(false)
    }
  }, [categoryId])

  useEffect(() => {
    // Initial fetch
    fetchServices()

    // Set up real-time subscription if enabled
    let unsubscribe: (() => void) | null = null

    if (enableRealtimeUpdates && categoryId) {
      unsubscribe = subscribeToServices(categoryId, (updatedServices) => {
        console.log('[v0] Real-time service update received')
        setServices(updatedServices)
        setLastSync(Date.now())
      })
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [fetchServices, categoryId, enableRealtimeUpdates])

  return { services, isLoading, error, refetch: fetchServices, lastSync }
}

// Hook to sync user orders with real-time updates
export function useSyncUserOrders(
  userId: string,
  status?: string,
  options: DataSyncOptions = {}
) {
  const { enableRealtimeUpdates = true } = options
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<number>(0)

  const fetchOrders = useCallback(async () => {
    console.log('[v0] Syncing user orders from database:', userId)
    setIsLoading(true)
    try {
      const data = await getUserOrders(userId, status)
      setOrders(data)
      setLastSync(Date.now())
      setError(null)
      console.log('[v0] Orders synced successfully')
    } catch (err) {
      console.error('[v0] Error syncing orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to sync orders')
    } finally {
      setIsLoading(false)
    }
  }, [userId, status])

  useEffect(() => {
    if (!userId) return

    // Initial fetch
    fetchOrders()

    // Set up real-time subscription if enabled
    let unsubscribe: (() => void) | null = null

    if (enableRealtimeUpdates) {
      unsubscribe = subscribeToOrders((order) => {
        if (order.user_id === userId) {
          console.log('[v0] Real-time order update received')
          fetchOrders()
        }
      })
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [userId, fetchOrders, enableRealtimeUpdates])

  return { orders, isLoading, error, refetch: fetchOrders, lastSync }
}

// Hook to sync user favorites with real-time updates
export function useSyncUserFavorites(
  userId: string,
  options: DataSyncOptions = {}
) {
  const { enableRealtimeUpdates = true } = options
  const [favorites, setFavorites] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<number>(0)

  const fetchFavorites = useCallback(async () => {
    console.log('[v0] Syncing user favorites from database:', userId)
    setIsLoading(true)
    try {
      const data = await getUserFavorites(userId)
      setFavorites(data)
      setLastSync(Date.now())
      setError(null)
      console.log('[v0] Favorites synced successfully')
    } catch (err) {
      console.error('[v0] Error syncing favorites:', err)
      setError(err instanceof Error ? err.message : 'Failed to sync favorites')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return

    // Initial fetch
    fetchFavorites()

    // Set up real-time subscription if enabled
    let unsubscribe: (() => void) | null = null

    if (enableRealtimeUpdates) {
      unsubscribe = subscribeToFavorites(userId, (updatedFavorites) => {
        console.log('[v0] Real-time favorite update received')
        setFavorites(updatedFavorites)
        setLastSync(Date.now())
      })
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [userId, fetchFavorites, enableRealtimeUpdates])

  return { favorites, isLoading, error, refetch: fetchFavorites, lastSync }
}

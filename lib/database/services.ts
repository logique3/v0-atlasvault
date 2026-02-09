import { supabase } from '@/lib/supabase'

export interface Service {
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

export interface Category {
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

// Fetch all active categories with real-time updates
export async function getCategories() {
  console.log('[v0] Fetching categories from Supabase')
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[v0] Error fetching categories:', error)
      throw error
    }

    console.log('[v0] Categories fetched:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('[v0] Categories fetch failed:', error)
    return []
  }
}

// Fetch all active services
export async function getServices(categoryId?: string) {
  console.log('[v0] Fetching services from Supabase', categoryId ? `for category: ${categoryId}` : '')
  try {
    let query = supabase
      .from('services')
      .select(`
        *,
        categories!inner(id, name, slug)
      `)
      .eq('active', true)

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching services:', error)
      throw error
    }

    console.log('[v0] Services fetched:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('[v0] Services fetch failed:', error)
    return []
  }
}

// Fetch single service by slug
export async function getServiceBySlug(slug: string) {
  console.log('[v0] Fetching service by slug:', slug)
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        categories(id, name, slug)
      `)
      .eq('slug', slug)
      .eq('active', true)
      .single()

    if (error) {
      console.error('[v0] Error fetching service:', error)
      throw error
    }

    console.log('[v0] Service fetched:', data?.name)
    return data
  } catch (error) {
    console.error('[v0] Service fetch failed:', error)
    return null
  }
}

// Search services
export async function searchServices(query: string, categoryId?: string) {
  console.log('[v0] Searching services:', query)
  try {
    let searchQuery = supabase
      .from('services')
      .select(`
        *,
        categories(id, name, slug)
      `)
      .eq('active', true)

    if (categoryId) {
      searchQuery = searchQuery.eq('category_id', categoryId)
    }

    // Search in name or description
    searchQuery = searchQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    const { data, error } = await searchQuery.order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error searching services:', error)
      throw error
    }

    console.log('[v0] Search results:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('[v0] Search failed:', error)
    return []
  }
}

// Subscribe to category changes (real-time)
export function subscribeToCategories(callback: (categories: Category[]) => void) {
  console.log('[v0] Subscribing to category changes')
  
  const subscription = supabase
    .from('categories')
    .on('*', (payload) => {
      console.log('[v0] Category change detected:', payload.eventType)
      // Fetch fresh data when changes occur
      getCategories().then(callback)
    })
    .subscribe()

  return () => {
    console.log('[v0] Unsubscribing from categories')
    subscription.unsubscribe()
  }
}

// Subscribe to service changes (real-time)
export function subscribeToServices(categoryId: string, callback: (services: Service[]) => void) {
  console.log('[v0] Subscribing to service changes for category:', categoryId)
  
  const subscription = supabase
    .from('services')
    .on('*', (payload) => {
      console.log('[v0] Service change detected:', payload.eventType)
      // Fetch fresh data when changes occur
      getServices(categoryId).then(callback)
    })
    .subscribe()

  return () => {
    console.log('[v0] Unsubscribing from services')
    subscription.unsubscribe()
  }
}

// Get service count by category
export async function getServiceCountByCategory(categoryId: string) {
  console.log('[v0] Fetching service count for category:', categoryId)
  try {
    const { count, error } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId)
      .eq('active', true)

    if (error) {
      console.error('[v0] Error counting services:', error)
      throw error
    }

    console.log('[v0] Service count:', count)
    return count || 0
  } catch (error) {
    console.error('[v0] Count fetch failed:', error)
    return 0
  }
}

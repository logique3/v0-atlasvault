import { supabase } from '@/lib/supabase'

export interface Favorite {
  id: string
  user_id: string
  service_id: string
  created_at: string
}

// Add to favorites
export async function addFavorite(userId: string, serviceId: string) {
  console.log('[v0] Adding to favorites:', userId, serviceId)
  try {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        service_id: serviceId,
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error adding favorite:', error)
      throw error
    }

    console.log('[v0] Favorite added:', serviceId)
    return data
  } catch (error) {
    console.error('[v0] Add favorite failed:', error)
    throw error
  }
}

// Remove from favorites
export async function removeFavorite(userId: string, serviceId: string) {
  console.log('[v0] Removing from favorites:', userId, serviceId)
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('service_id', serviceId)

    if (error) {
      console.error('[v0] Error removing favorite:', error)
      throw error
    }

    console.log('[v0] Favorite removed:', serviceId)
  } catch (error) {
    console.error('[v0] Remove favorite failed:', error)
    throw error
  }
}

// Get user favorites
export async function getUserFavorites(userId: string) {
  console.log('[v0] Fetching favorites for user:', userId)
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        user_id,
        service_id,
        services(
          id,
          name,
          slug,
          price,
          description,
          rating,
          reviews_count,
          image_url,
          category_id
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching favorites:', error)
      throw error
    }

    console.log('[v0] Favorites fetched:', data?.length)
    return data || []
  } catch (error) {
    console.error('[v0] Favorites fetch failed:', error)
    return []
  }
}

// Check if service is favorited
export async function isFavorited(userId: string, serviceId: string) {
  console.log('[v0] Checking if favorited:', userId, serviceId)
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('service_id', serviceId)
      .single()

    const favorited = !error && !!data
    console.log('[v0] Favorited:', favorited)
    return favorited
  } catch (error) {
    console.error('[v0] Check favorite failed:', error)
    return false
  }
}

// Subscribe to favorite changes
export function subscribeToFavorites(userId: string, callback: (favorites: any[]) => void) {
  console.log('[v0] Subscribing to favorite changes for user:', userId)

  const subscription = supabase
    .from('favorites')
    .on('*', (payload) => {
      if (payload.new.user_id === userId || payload.old?.user_id === userId) {
        console.log('[v0] Favorite change detected:', payload.eventType)
        getUserFavorites(userId).then(callback)
      }
    })
    .subscribe()

  return () => {
    console.log('[v0] Unsubscribing from favorites')
    subscription.unsubscribe()
  }
}

// Get favorite count for user
export async function getFavoriteCount(userId: string) {
  console.log('[v0] Fetching favorite count for user:', userId)
  try {
    const { count, error } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (error) {
      console.error('[v0] Error counting favorites:', error)
      throw error
    }

    console.log('[v0] Favorite count:', count)
    return count || 0
  } catch (error) {
    console.error('[v0] Count fetch failed:', error)
    return 0
  }
}

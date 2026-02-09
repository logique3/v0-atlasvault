import { supabase } from '@/lib/supabase'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string
  role: 'user' | 'admin'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserStats {
  id: string
  user_id: string
  total_orders: number
  total_spent: number
  last_order_date?: string
  created_at: string
}

// Get user profile
export async function getUserProfile(userId: string) {
  console.log('[v0] Fetching user profile:', userId)
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('[v0] Error fetching user profile:', error)
      throw error
    }

    console.log('[v0] User profile fetched:', data?.email)
    return data
  } catch (error) {
    console.error('[v0] Profile fetch failed:', error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
) {
  console.log('[v0] Updating user profile:', userId)
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating profile:', error)
      throw error
    }

    console.log('[v0] Profile updated:', userId)
    return data
  } catch (error) {
    console.error('[v0] Profile update failed:', error)
    throw error
  }
}

// Create user profile
export async function createUserProfile(
  userId: string,
  email: string,
  fullName: string,
  phone?: string,
  role: 'user' | 'admin' = 'user'
) {
  console.log('[v0] Creating user profile:', email)
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email,
        full_name: fullName,
        phone: phone || null,
        role,
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error creating profile:', error)
      throw error
    }

    console.log('[v0] Profile created:', email)
    return data
  } catch (error) {
    console.error('[v0] Profile creation failed:', error)
    throw error
  }
}

// Get all users (admin)
export async function getAllUsers(role?: string) {
  console.log('[v0] Fetching all users')
  try {
    let query = supabase.from('user_profiles').select(`
      *,
      user_stats(total_orders, total_spent, last_order_date)
    `)

    if (role) {
      query = query.eq('role', role)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching users:', error)
      throw error
    }

    console.log('[v0] Users fetched:', data?.length)
    return data || []
  } catch (error) {
    console.error('[v0] Users fetch failed:', error)
    return []
  }
}

// Get user statistics
export async function getUserStats(userId: string) {
  console.log('[v0] Fetching stats for user:', userId)
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('[v0] Error fetching stats:', error)
      throw error
    }

    console.log('[v0] User stats fetched:', data)
    return data || null
  } catch (error) {
    console.error('[v0] Stats fetch failed:', error)
    return null
  }
}

// Subscribe to user changes (admin real-time)
export function subscribeToUserChanges(callback: (user: UserProfile) => void) {
  console.log('[v0] Subscribing to user changes')

  const subscription = supabase
    .from('user_profiles')
    .on('*', (payload) => {
      console.log('[v0] User change detected:', payload.eventType)
      callback(payload.new)
    })
    .subscribe()

  return () => {
    console.log('[v0] Unsubscribing from user changes')
    subscription.unsubscribe()
  }
}

// Delete user (admin)
export async function deleteUser(userId: string) {
  console.log('[v0] Deleting user:', userId)
  try {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId)

    if (error) {
      console.error('[v0] Error deleting user:', error)
      throw error
    }

    console.log('[v0] User deleted:', userId)
  } catch (error) {
    console.error('[v0] User deletion failed:', error)
    throw error
  }
}

// Get user count statistics
export async function getUserStats_Admin() {
  console.log('[v0] Fetching admin user statistics')
  try {
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    const { count: adminUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin')

    const { count: regularUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'user')

    const stats = {
      totalUsers: totalUsers || 0,
      adminUsers: adminUsers || 0,
      regularUsers: regularUsers || 0,
    }

    console.log('[v0] User stats:', stats)
    return stats
  } catch (error) {
    console.error('[v0] Stats fetch failed:', error)
    return {
      totalUsers: 0,
      adminUsers: 0,
      regularUsers: 0,
    }
  }
}

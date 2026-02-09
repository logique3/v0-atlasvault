import { supabase } from '@/lib/supabase'

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'completed' | 'cancelled'
  payment_method: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  service_id: string
  quantity: number
  unit_price: number
  created_at: string
}

// Create new order
export async function createOrder(
  userId: string,
  totalAmount: number,
  paymentMethod: string,
  items: Array<{ serviceId: string; quantity: number; unitPrice: number }>,
  notes?: string
) {
  console.log('[v0] Creating order for user:', userId)
  try {
    // Start transaction by creating order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        status: 'pending',
        notes: notes || null,
      })
      .select()
      .single()

    if (orderError) {
      console.error('[v0] Error creating order:', orderError)
      throw orderError
    }

    console.log('[v0] Order created:', orderData.id)

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: orderData.id,
      service_id: item.serviceId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    }))

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select()

    if (itemsError) {
      console.error('[v0] Error creating order items:', itemsError)
      throw itemsError
    }

    console.log('[v0] Order items created:', itemsData?.length)
    return orderData
  } catch (error) {
    console.error('[v0] Order creation failed:', error)
    throw error
  }
}

// Get user orders
export async function getUserOrders(userId: string, status?: string) {
  console.log('[v0] Fetching orders for user:', userId)
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items(
          id,
          service_id,
          quantity,
          unit_price,
          services(name, slug)
        )
      `)
      .eq('user_id', userId)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching orders:', error)
      throw error
    }

    console.log('[v0] Orders fetched:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('[v0] Orders fetch failed:', error)
    return []
  }
}

// Get single order
export async function getOrder(orderId: string) {
  console.log('[v0] Fetching order:', orderId)
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          id,
          service_id,
          quantity,
          unit_price,
          services(name, slug, price)
        )
      `)
      .eq('id', orderId)
      .single()

    if (error) {
      console.error('[v0] Error fetching order:', error)
      throw error
    }

    console.log('[v0] Order fetched:', orderId)
    return data
  } catch (error) {
    console.error('[v0] Order fetch failed:', error)
    return null
  }
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'completed' | 'cancelled'
) {
  console.log('[v0] Updating order status:', orderId, '->', status)
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating order:', error)
      throw error
    }

    console.log('[v0] Order updated:', orderId)
    return data
  } catch (error) {
    console.error('[v0] Order update failed:', error)
    throw error
  }
}

// Subscribe to order changes for admin
export function subscribeToOrders(callback: (order: Order) => void) {
  console.log('[v0] Subscribing to order changes')

  const subscription = supabase
    .from('orders')
    .on('*', (payload) => {
      console.log('[v0] Order change detected:', payload.eventType, payload.new)
      callback(payload.new)
    })
    .subscribe()

  return () => {
    console.log('[v0] Unsubscribing from orders')
    subscription.unsubscribe()
  }
}

// Get all orders (admin)
export async function getAllOrders(status?: string, limit?: number, offset?: number) {
  console.log('[v0] Fetching all orders')
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        user_profiles(full_name, email, phone),
        order_items(
          id,
          service_id,
          quantity,
          unit_price,
          services(name, slug)
        )
      `)

    if (status) {
      query = query.eq('status', status)
    }

    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1)
    } else if (limit) {
      query = query.limit(limit)
    }

    const { data, error, count } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Error fetching orders:', error)
      throw error
    }

    console.log('[v0] All orders fetched:', data?.length)
    return { data: data || [], count }
  } catch (error) {
    console.error('[v0] Orders fetch failed:', error)
    return { data: [], count: 0 }
  }
}

// Get order statistics
export async function getOrderStats() {
  console.log('[v0] Fetching order statistics')
  try {
    // Get total revenue
    const { data: totalRevenue } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'completed')

    const revenue = totalRevenue?.reduce((sum, order) => sum + order.total_amount, 0) || 0

    // Get order counts by status
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    const { count: completedOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    const stats = {
      totalRevenue: revenue,
      totalOrders: totalOrders || 0,
      completedOrders: completedOrders || 0,
      pendingOrders: pendingOrders || 0,
    }

    console.log('[v0] Order stats:', stats)
    return stats
  } catch (error) {
    console.error('[v0] Stats fetch failed:', error)
    return {
      totalRevenue: 0,
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
    }
  }
}

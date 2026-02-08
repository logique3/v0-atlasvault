'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-context'

export interface OrderItem {
  id: string
  serviceId: string
  serviceName: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'completed' | 'cancelled'
  paymentMethod: 'whatsapp' | 'card' | 'dinarpay'
  notes?: string
  createdAt: string
  updatedAt: string
}

interface OrdersContextType {
  orders: Order[]
  createOrder: (items: OrderItem[], paymentMethod: string, notes?: string) => Promise<string>
  getOrderById: (orderId: string) => Order | null
  getUserOrders: (userId: string) => Order[]
  updateOrderStatus: (orderId: string, status: Order['status']) => void
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  // Load orders from localStorage on mount
  useEffect(() => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem('atlasVaultOrders') || '[]')
    setOrders(allOrders)
  }, [])

  const createOrder = useCallback(
    async (items: OrderItem[], paymentMethod: string, notes?: string): Promise<string> => {
      if (!user) throw new Error('User not authenticated')

      const orderId = `order_${Date.now()}`
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      const newOrder: Order = {
        id: orderId,
        userId: user.id,
        items,
        totalAmount,
        status: 'pending',
        paymentMethod: paymentMethod as any,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const allOrders = JSON.parse(localStorage.getItem('atlasVaultOrders') || '[]')
      allOrders.push(newOrder)
      localStorage.setItem('atlasVaultOrders', JSON.stringify(allOrders))

      // Also save to user's orders list
      const userOrdersKey = `orders_${user.id}`
      const userOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]')
      userOrders.push({
        id: newOrder.id,
        serviceId: items[0]?.serviceId,
        serviceName: items.map((i) => i.serviceName).join(', '),
        price: totalAmount,
        quantity: items.length,
        status: 'pending',
        createdAt: newOrder.createdAt,
      })
      localStorage.setItem(userOrdersKey, JSON.stringify(userOrders))

      setOrders((prev) => [...prev, newOrder])
      return orderId
    },
    [user]
  )

  const getOrderById = useCallback(
    (orderId: string): Order | null => {
      return orders.find((order) => order.id === orderId) || null
    },
    [orders]
  )

  const getUserOrders = useCallback(
    (userId: string): Order[] => {
      return orders.filter((order) => order.userId === userId)
    },
    [orders]
  )

  const updateOrderStatus = useCallback(
    (orderId: string, status: Order['status']) => {
      const allOrders = JSON.parse(localStorage.getItem('atlasVaultOrders') || '[]')
      const updatedOrders = allOrders.map((order: Order) =>
        order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
      )
      localStorage.setItem('atlasVaultOrders', JSON.stringify(updatedOrders))
      setOrders(updatedOrders)
    },
    []
  )

  const value: OrdersContextType = {
    orders,
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
  }

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}

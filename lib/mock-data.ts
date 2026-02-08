'use client'

/**
 * Mock Data Initialization for AtlasVault
 * This file initializes test data for development and testing purposes
 */

export interface MockUser {
  id: string
  email: string
  password: string
  fullName: string
  phone: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface MockOrder {
  id: string
  userId: string
  userName: string
  userEmail: string
  items: Array<{
    id: string
    serviceName: string
    price: number
    quantity: number
  }>
  totalAmount: number
  status: 'pending' | 'completed' | 'cancelled'
  paymentMethod: 'whatsapp' | 'card' | 'dinarpay'
  notes?: string
  createdAt: string
  updatedAt: string
}

// Mock Admin Users
export const MOCK_ADMINS: MockUser[] = [
  {
    id: 'admin_001',
    email: 'admin@atlasvault.com',
    password: 'admin123',
    fullName: 'Admin User',
    phone: '+216 95 555 5555',
    role: 'admin',
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'admin_002',
    email: 'manager@atlasvault.com',
    password: 'manager123',
    fullName: 'Manager User',
    phone: '+216 95 555 5556',
    role: 'admin',
    createdAt: new Date('2024-01-15').toISOString(),
  },
]

// Mock Regular Users
export const MOCK_USERS: MockUser[] = [
  {
    id: 'user_001',
    email: 'john@example.com',
    password: 'password123',
    fullName: 'John Doe',
    phone: '+216 20 123 4567',
    role: 'user',
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'user_002',
    email: 'jane@example.com',
    password: 'password123',
    fullName: 'Jane Smith',
    phone: '+216 20 123 4568',
    role: 'user',
    createdAt: new Date('2024-02-05').toISOString(),
  },
  {
    id: 'user_003',
    email: 'ahmed@example.com',
    password: 'password123',
    fullName: 'Ahmed Ben Ali',
    phone: '+216 20 123 4569',
    role: 'user',
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: 'user_004',
    email: 'fatima@example.com',
    password: 'password123',
    fullName: 'Fatima Zahra',
    phone: '+216 20 123 4570',
    role: 'user',
    createdAt: new Date('2024-02-15').toISOString(),
  },
  {
    id: 'user_005',
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User',
    phone: '+216 20 123 4571',
    role: 'user',
    createdAt: new Date('2024-02-20').toISOString(),
  },
]

// Mock Orders
export const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'order_001',
    userId: 'user_001',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    items: [
      { id: 'item_1', serviceName: 'Netflix Premium', price: 12.99, quantity: 1 },
      { id: 'item_2', serviceName: 'Spotify Premium', price: 9.99, quantity: 1 },
    ],
    totalAmount: 22.98,
    status: 'completed',
    paymentMethod: 'whatsapp',
    notes: 'For personal use',
    createdAt: new Date('2024-03-01').toISOString(),
    updatedAt: new Date('2024-03-02').toISOString(),
  },
  {
    id: 'order_002',
    userId: 'user_002',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    items: [
      { id: 'item_3', serviceName: 'Microsoft 365', price: 69.99, quantity: 1 },
      { id: 'item_4', serviceName: 'Adobe Creative Cloud', price: 49.99, quantity: 1 },
    ],
    totalAmount: 119.98,
    status: 'pending',
    paymentMethod: 'whatsapp',
    notes: 'Business subscription',
    createdAt: new Date('2024-03-05').toISOString(),
    updatedAt: new Date('2024-03-05').toISOString(),
  },
  {
    id: 'order_003',
    userId: 'user_003',
    userName: 'Ahmed Ben Ali',
    userEmail: 'ahmed@example.com',
    items: [
      { id: 'item_5', serviceName: 'PlayStation Plus', price: 59.99, quantity: 1 },
    ],
    totalAmount: 59.99,
    status: 'completed',
    paymentMethod: 'card',
    createdAt: new Date('2024-03-08').toISOString(),
    updatedAt: new Date('2024-03-09').toISOString(),
  },
  {
    id: 'order_004',
    userId: 'user_001',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    items: [
      { id: 'item_6', serviceName: 'Hulu Streaming', price: 7.99, quantity: 1 },
    ],
    totalAmount: 7.99,
    status: 'pending',
    paymentMethod: 'whatsapp',
    createdAt: new Date('2024-03-10').toISOString(),
    updatedAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: 'order_005',
    userId: 'user_004',
    userName: 'Fatima Zahra',
    userEmail: 'fatima@example.com',
    items: [
      { id: 'item_7', serviceName: 'Canva Pro', price: 119.99, quantity: 1 },
    ],
    totalAmount: 119.99,
    status: 'completed',
    paymentMethod: 'dinarpay',
    createdAt: new Date('2024-03-12').toISOString(),
    updatedAt: new Date('2024-03-13').toISOString(),
  },
]

/**
 * Initialize mock data in localStorage if not already present
 * This function should be called once during app initialization
 */
export function initializeMockData() {
  // Initialize users if not already present
  const existingUsers = localStorage.getItem('atlasVaultUsers')
  if (!existingUsers) {
    const allUsers = [...MOCK_ADMINS, ...MOCK_USERS]
    localStorage.setItem('atlasVaultUsers', JSON.stringify(allUsers))
  }

  // Initialize orders if not already present
  const existingOrders = localStorage.getItem('atlasVaultOrders')
  if (!existingOrders) {
    localStorage.setItem('atlasVaultOrders', JSON.stringify(MOCK_ORDERS))
  }

  // Initialize user-specific orders
  MOCK_ORDERS.forEach((order) => {
    const userOrdersKey = `orders_${order.userId}`
    const existingUserOrders = localStorage.getItem(userOrdersKey)
    if (!existingUserOrders) {
      const userOrders = [
        {
          id: order.id,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt,
          items: order.items,
        },
      ]
      localStorage.setItem(userOrdersKey, JSON.stringify(userOrders))
    }
  })
}

/**
 * Reset all mock data to defaults
 * Useful for testing
 */
export function resetMockData() {
  localStorage.removeItem('atlasVaultUsers')
  localStorage.removeItem('atlasVaultOrders')
  localStorage.removeItem('atlasVaultUser')
  localStorage.removeItem('atlasVaultFavorites')

  // Clear user-specific orders
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('orders_')) {
      localStorage.removeItem(key)
    }
  })

  // Reinitialize
  initializeMockData()
}

/**
 * Get all users (admin + regular users)
 */
export function getAllMockUsers(): MockUser[] {
  const stored = localStorage.getItem('atlasVaultUsers')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return [...MOCK_ADMINS, ...MOCK_USERS]
}

/**
 * Get mock statistics
 */
export function getMockStatistics() {
  const users = getAllMockUsers()
  const stored = localStorage.getItem('atlasVaultOrders')
  const orders = stored ? JSON.parse(stored) : MOCK_ORDERS

  const totalUsers = users.length
  const adminUsers = users.filter((u) => u.role === 'admin').length
  const regularUsers = totalUsers - adminUsers

  const totalOrders = orders.length
  const completedOrders = orders.filter((o: any) => o.status === 'completed').length
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length
  const totalRevenue = orders
    .filter((o: any) => o.status === 'completed')
    .reduce((sum: number, o: any) => sum + o.totalAmount, 0)

  return {
    totalUsers,
    adminUsers,
    regularUsers,
    totalOrders,
    completedOrders,
    pendingOrders,
    totalRevenue,
  }
}

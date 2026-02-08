'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { initializeMockData } from './mock-data'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  phone: string
  role: 'admin' | 'user'
  createdAt: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string, phone: string) => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData()

    const storedUser = localStorage.getItem('atlasVaultUser')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Failed to parse stored user')
        localStorage.removeItem('atlasVaultUser')
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simple validation
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      // Check stored users
      const storedUsers = JSON.parse(localStorage.getItem('atlasVaultUsers') || '[]')
      const foundUser = storedUsers.find(
        (u: any) => u.email === email && u.password === password
      )

      if (!foundUser) {
        throw new Error('Invalid email or password')
      }

      const authUser: AuthUser = {
        id: foundUser.id,
        email: foundUser.email,
        fullName: foundUser.fullName,
        phone: foundUser.phone,
        role: foundUser.role,
        createdAt: foundUser.createdAt,
      }

      setUser(authUser)
      localStorage.setItem('atlasVaultUser', JSON.stringify(authUser))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (email: string, password: string, fullName: string, phone: string) => {
    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Validation
      if (!email || !password || !fullName || !phone) {
        throw new Error('All fields are required')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      const storedUsers = JSON.parse(localStorage.getItem('atlasVaultUsers') || '[]')

      // Check if user already exists
      if (storedUsers.some((u: any) => u.email === email)) {
        throw new Error('User already exists with this email')
      }

      const newUser = {
        id: `user_${Date.now()}`,
        email,
        password, // In production, use bcrypt or similar
        fullName,
        phone,
        role: 'user' as const,
        createdAt: new Date().toISOString(),
      }

      storedUsers.push(newUser)
      localStorage.setItem('atlasVaultUsers', JSON.stringify(storedUsers))

      const authUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.createdAt,
      }

      setUser(authUser)
      localStorage.setItem('atlasVaultUser', JSON.stringify(authUser))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setUser(null)
      localStorage.removeItem('atlasVaultUser')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin' ?? false,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-context'

export interface FavoriteService {
  id: string
  slug: string
  name: string
  price: number
  category: string
}

interface FavoritesContextType {
  favorites: FavoriteService[]
  addFavorite: (service: FavoriteService) => void
  removeFavorite: (id: string) => void
  isFavorited: (id: string) => boolean
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteService[]>([])

  // Load favorites from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storageKey = `favorites_${user.id}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        try {
          setFavorites(JSON.parse(stored))
        } catch {
          setFavorites([])
        }
      }
    } else {
      setFavorites([])
    }
  }, [user])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (user) {
      const storageKey = `favorites_${user.id}`
      localStorage.setItem(storageKey, JSON.stringify(favorites))
    }
  }, [favorites, user])

  const addFavorite = useCallback((service: FavoriteService) => {
    setFavorites((prev) => {
      // Check if already exists
      if (prev.some((fav) => fav.id === service.id)) {
        return prev
      }
      return [...prev, service]
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id))
  }, [])

  const isFavorited = useCallback((id: string) => {
    return favorites.some((fav) => fav.id === id)
  }, [favorites])

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  const value: FavoritesContextType = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorited,
    clearFavorites,
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

// FavoritesContext: owns the list of favorite recipe ids on this device.
// Saved in localStorage; a `storage` listener keeps other open tabs in sync.
// RecipesProvider calls prune() after loading so deleted recipes drop out.
import { createContext, useCallback, useContext, useEffect, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const STORAGE_KEY = 'recipebook:favorites:v1'

type FavoritesValue = {
  favorites: string[]
  isFavorite: (id: string) => boolean
  toggle: (id: string) => void
  prune: (existingIds: string[]) => void
}

const FavoritesContext = createContext<FavoritesValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage<string[]>(STORAGE_KEY, [])

  // Another tab changed favorites: adopt its value.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return
      try {
        setFavorites(e.newValue ? (JSON.parse(e.newValue) as string[]) : [])
      } catch {
        // Ignore malformed values from other tabs.
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [setFavorites])

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])

  const toggle = useCallback(
    (id: string) => setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    [setFavorites],
  )

  const prune = useCallback(
    (existingIds: string[]) => {
      const existing = new Set(existingIds)
      setFavorites((prev) => {
        const kept = prev.filter((id) => existing.has(id))
        return kept.length === prev.length ? prev : kept
      })
    },
    [setFavorites],
  )

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggle, prune }}>{children}</FavoritesContext.Provider>
  )
}

export function useFavorites(): FavoritesValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used inside <FavoritesProvider>.')
  return ctx
}

// useState that is saved to localStorage under `key`.
// Reads once on mount (bad or missing JSON falls back to `initial`) and writes on every change.
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

export function useLocalStorage<T>(key: string, initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const fallback = initial instanceof Function ? initial() : initial
    try {
      const stored = window.localStorage.getItem(key)
      return stored === null ? fallback : (JSON.parse(stored) as T)
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or blocked (private mode): keep working in memory.
    }
  }, [key, value])

  return [value, setValue]
}

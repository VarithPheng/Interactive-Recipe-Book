// Returns `value` only after it has stopped changing for `ms` milliseconds.
// Used to wait until the user pauses typing before filtering by search text.
import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, ms = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(timer)
  }, [value, ms])

  return debounced
}

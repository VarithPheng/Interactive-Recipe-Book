// Recipes favorited on this device (milestone 6).
import { useEffect } from 'react'

export function FavoritesPage() {
  useEffect(() => {
    document.title = 'Favorites | Recipe Book'
  }, [])

  return (
    <section>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Favorites</h1>
      <p className="mt-2 text-muted-foreground">Recipes you save on this device show up here.</p>
    </section>
  )
}

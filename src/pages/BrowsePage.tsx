// Browse all recipes. Grid, search, filters and sort arrive in milestone 3.
import { useEffect } from 'react'

export function BrowsePage() {
  useEffect(() => {
    document.title = 'Recipes | Recipe Book'
  }, [])

  return (
    <section>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Recipes</h1>
      <p className="mt-2 text-muted-foreground">Find something to cook.</p>
    </section>
  )
}

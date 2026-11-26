// Browse all recipes. Grid, search, filters and sort arrive in milestone 3.
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRecipes } from '@/context/RecipesContext'

export function BrowsePage() {
  const { items, status, error, reload } = useRecipes()

  useEffect(() => {
    document.title = 'Recipes | Recipe Book'
  }, [])

  return (
    <section>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Recipes</h1>
      {status === 'loading' && <p className="mt-2 text-muted-foreground">Loading recipes…</p>}
      {status === 'error' && (
        <div className="mt-4">
          <p className="text-destructive">Recipes could not be loaded: {error}</p>
          <Button variant="outline" className="mt-3" onClick={reload}>Try again</Button>
        </div>
      )}
      {status === 'success' && (
        <ul className="mt-4 list-disc pl-5">
          {items.map((r) => <li key={r.id}>{r.title}</li>)}
        </ul>
      )}
    </section>
  )
}

// Recipes favorited on this device, newest first.
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { HeartIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadError } from '@/components/recipe/LoadError'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'
import { RecipeGridSkeleton } from '@/components/recipe/Skeletons'
import { useFavorites } from '@/context/FavoritesContext'
import { useRecipes } from '@/context/RecipesContext'

export function FavoritesPage() {
  const { items, status, error, reload } = useRecipes()
  const { favorites } = useFavorites()

  useEffect(() => {
    document.title = 'Favorites | Recipe Book'
  }, [])

  const saved = useMemo(() => items.filter((r) => favorites.includes(r.id)), [items, favorites])

  return (
    <section>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Favorites</h1>
      <p className="mt-2 text-muted-foreground">Saved on this device.</p>

      <div className="mt-8">
        {status === 'loading' && <RecipeGridSkeleton count={4} />}
        {status === 'error' && <LoadError error={error} onRetry={reload} />}
        {status === 'success' &&
          (saved.length > 0 ? (
            <RecipeGrid recipes={saved} />
          ) : (
            <div className="rounded-lg border border-dashed border-border p-10 text-center">
              <HeartIcon className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
              <h2 className="mt-3 font-medium">No favorites yet</h2>
              <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any recipe to keep it here.</p>
              <Button asChild className="mt-4">
                <Link to="/">Browse recipes</Link>
              </Button>
            </div>
          ))}
      </div>
    </section>
  )
}

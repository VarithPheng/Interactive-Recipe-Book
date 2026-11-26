// Browse all recipes. Filter state lives here (useState); the visible list is derived with useMemo.
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FilterBar } from '@/components/recipe/FilterBar'
import { LoadError } from '@/components/recipe/LoadError'
import { RecipeGrid, RecipeGridSkeleton } from '@/components/recipe/RecipeGrid'
import { useRecipes } from '@/context/RecipesContext'
import { useDebounce } from '@/hooks/useDebounce'
import { filterAndSort, type IngredientChip, type SortKey } from '@/lib/filters'
import type { Category } from '@/lib/types'

export function BrowsePage() {
  const { items, status, error, reload } = useRecipes()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'All'>('All')
  const [chips, setChips] = useState<IngredientChip[]>([])
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('newest')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    document.title = 'Recipes | Recipe Book'
  }, [])

  const visible = useMemo(
    () => filterAndSort(items, { query: debouncedQuery, category, chips, featuredOnly, sort }),
    [items, debouncedQuery, category, chips, featuredOnly, sort],
  )

  // Every distinct ingredient across all recipes, for the ingredient picker.
  const ingredientOptions = useMemo(
    () => [...new Set(items.flatMap((r) => r.ingredientNames))].sort(),
    [items],
  )

  const filtersActive = query !== '' || category !== 'All' || chips.length > 0 || featuredOnly

  function clearFilters() {
    setQuery('')
    setCategory('All')
    setChips([])
    setFeaturedOnly(false)
  }

  return (
    <section>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Recipes</h1>

      <div className="mt-6">
        <FilterBar
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
          featuredOnly={featuredOnly}
          onFeaturedOnlyChange={setFeaturedOnly}
          ingredientOptions={ingredientOptions}
          chips={chips}
          onChipsChange={setChips}
        />
      </div>

      <div className="mt-8">
        {status === 'loading' && <RecipeGridSkeleton />}
        {status === 'error' && <LoadError error={error} onRetry={reload} />}
        {status === 'success' && (
          <>
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {visible.length} {visible.length === 1 ? 'recipe' : 'recipes'}
              </p>
              {filtersActive && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>Clear filters</Button>
              )}
            </div>
            {visible.length > 0 ? (
              <RecipeGrid recipes={visible} />
            ) : (
              <div className="rounded-lg border border-dashed border-border p-10 text-center">
                <h2 className="font-medium">No recipes match</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {items.length === 0 ? 'Nobody has added a recipe yet.' : 'Try a different search or remove a filter.'}
                </p>
                {filtersActive && (
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear filters</Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

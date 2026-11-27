// Browse all recipes. Filters live in the URL (?q=&category=&ing=&staff=1&sort=), so Back from a recipe,
// a refresh or a shared link keeps them. The visible list is derived from them with useMemo.
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FilterBar } from '@/components/recipe/FilterBar'
import { LoadError } from '@/components/recipe/LoadError'
import { RecipeGrid } from '@/components/recipe/RecipeGrid'
import { RecipeGridSkeleton } from '@/components/recipe/Skeletons'
import { Skeleton } from '@/components/ui/skeleton'
import { useRecipes } from '@/context/RecipesContext'
import { useDebounce } from '@/hooks/useDebounce'
import { filterAndSort, SORT_OPTIONS, type SortKey } from '@/lib/filters'
import { loadDetailPage } from '@/lib/pages'
import { CATEGORIES, type Category } from '@/lib/types'

function parseCategory(v: string | null): Category | 'All' {
  return CATEGORIES.find((c) => c === v) ?? 'All'
}

function parseSort(v: string | null): SortKey {
  return SORT_OPTIONS.find((o) => o.value === v)?.value ?? 'newest'
}

export function BrowsePage() {
  const { items, status, error, reload } = useRecipes()

  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const category = parseCategory(params.get('category'))
  const ingredients = params.getAll('ing')
  const ingredientsKey = ingredients.join('|') // stable value for useMemo, since getAll returns a new array
  const featuredOnly = params.get('staff') === '1'
  const sort = parseSort(params.get('sort'))
  const debouncedQuery = useDebounce(query, 300)

  // Write one filter to the URL; default values are left out to keep the URL short.
  // replace: true, so Back leaves the page instead of undoing filters one by one.
  function setParam(key: string, value: string | string[] | null) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete(key)
        for (const v of Array.isArray(value) ? value : value ? [value] : []) next.append(key, v)
        return next
      },
      { replace: true },
    )
  }

  useEffect(() => {
    document.title = 'Recipes | Recipe Book'
  }, [])

  // Once the grid is on screen, fetch the recipe page's code so opening a recipe is instant.
  useEffect(() => {
    if (status === 'success') void loadDetailPage()
  }, [status])

  const visible = useMemo(
    () =>
      filterAndSort(items, {
        query: debouncedQuery,
        category,
        ingredients: ingredientsKey ? ingredientsKey.split('|') : [],
        featuredOnly,
        sort,
      }),
    [items, debouncedQuery, category, ingredientsKey, featuredOnly, sort],
  )

  // Every distinct ingredient across all recipes, for the ingredient picker.
  const ingredientOptions = useMemo(() => [...new Set(items.flatMap((r) => r.ingredientNames))].sort(), [items])

  const filtersActive = query !== '' || category !== 'All' || ingredients.length > 0 || featuredOnly

  function clearFilters() {
    // Keeps the sort order; it isn't a filter.
    setParams((prev) => (prev.get('sort') ? new URLSearchParams({ sort: prev.get('sort')! }) : {}), { replace: true })
  }

  return (
    <section>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Recipes</h1>

      <div className="mt-6">
        <FilterBar
          query={query}
          onQueryChange={(q) => setParam('q', q)}
          category={category}
          onCategoryChange={(c) => setParam('category', c === 'All' ? null : c)}
          sort={sort}
          onSortChange={(v) => setParam('sort', v === 'newest' ? null : v)}
          featuredOnly={featuredOnly}
          onFeaturedOnlyChange={(on) => setParam('staff', on ? '1' : null)}
          ingredientOptions={ingredientOptions}
          ingredients={ingredients}
          onIngredientsChange={(names) => setParam('ing', names)}
        />
      </div>

      <div className="mt-8">
        {status === 'loading' && (
          <>
            {/* Same height as the results row below, so the grid doesn't move when data arrives. */}
            <div className="mb-4 flex min-h-7 items-center">
              <Skeleton className="h-5 w-20" />
            </div>
            <RecipeGridSkeleton />
          </>
        )}
        {status === 'error' && <LoadError error={error} onRetry={reload} />}
        {status === 'success' && (
          <>
            <div className="mb-4 flex min-h-7 items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {visible.length} {visible.length === 1 ? 'recipe' : 'recipes'}
              </p>
              {filtersActive && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
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
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

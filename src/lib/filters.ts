// Pure filter and sort rules for the Browse page (called from a useMemo there).
import type { Category, Recipe } from '@/lib/types'

export type IngredientMode = 'include' | 'exclude'
export type IngredientChip = { name: string; mode: IngredientMode }
export type SortKey = 'newest' | 'quickest' | 'top'

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'quickest', label: 'Quickest' },
  { value: 'top', label: 'Top rated' },
]

export type RecipeFilters = {
  query: string
  category: Category | 'All'
  chips: IngredientChip[]
  featuredOnly: boolean
  sort: SortKey
}

function hasIngredient(recipe: Recipe, name: string) {
  return recipe.ingredientNames.some((n) => n.includes(name))
}

export function filterAndSort(recipes: Recipe[], f: RecipeFilters): Recipe[] {
  const q = f.query.trim().toLowerCase()
  const includes = f.chips.filter((c) => c.mode === 'include').map((c) => c.name)
  const excludes = f.chips.filter((c) => c.mode === 'exclude').map((c) => c.name)

  const result = recipes.filter(
    (r) =>
      (!q || r.title.toLowerCase().includes(q)) &&
      (f.category === 'All' || r.category === f.category) &&
      (!f.featuredOnly || r.isFeatured) &&
      includes.every((name) => hasIngredient(r, name)) &&
      !excludes.some((name) => hasIngredient(r, name)),
  )

  return result.sort((a, b) => {
    if (f.sort === 'quickest') {
      return (a.prepMinutes ?? Infinity) - (b.prepMinutes ?? Infinity)
    }
    if (f.sort === 'top') {
      return b.avgRating - a.avgRating || b.ratingCount - a.ratingCount
    }
    return Date.parse(b.createdAt) - Date.parse(a.createdAt)
  })
}

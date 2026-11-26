// Shared domain types for recipes. Keep stable: used by api, contexts and pages.
export const CATEGORIES = ['Breakfast', 'Main', 'Soup', 'Salad', 'Dessert', 'Snack', 'Drink'] as const
export type Category = (typeof CATEGORIES)[number]
export const UNITS = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'piece', 'pinch'] as const
export type Unit = (typeof UNITS)[number]

export type Ingredient = { name: string; qty: number; unit: Unit }

export type Recipe = {
  id: string
  title: string
  description: string | null
  category: Category
  ingredients: Ingredient[]
  ingredientNames: string[] // lowercase, trimmed; derived from ingredients on write
  steps: string[]
  prepMinutes: number | null
  servings: number | null
  photoUrl: string | null
  canDelete: boolean
  isFeatured: boolean
  createdAt: string
  avgRating: number // 0 when no ratings
  ratingCount: number
}

export type RecipeInput = Omit<
  Recipe,
  'id' | 'ingredientNames' | 'canDelete' | 'isFeatured' | 'createdAt' | 'avgRating' | 'ratingCount'
>

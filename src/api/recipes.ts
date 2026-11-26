// Recipe reads and writes. Reads use the recipes_with_rating view; writes go to the recipes table.
import { supabase } from '@/lib/supabase'
import type { Category, Ingredient, Recipe, RecipeInput } from '@/lib/types'

type RecipeRow = {
  id: string
  title: string
  description: string | null
  category: Category
  ingredients: Ingredient[]
  ingredient_names: string[]
  steps: string[]
  prep_minutes: number | null
  servings: number | null
  photo_url: string | null
  can_delete: boolean
  is_featured: boolean
  created_at: string
  avg_rating: number | string
  rating_count: number
}

const VIEW = 'recipes_with_rating'
const TABLE = 'recipes'

function mapRow(row: RecipeRow): Recipe {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    ingredients: row.ingredients,
    ingredientNames: row.ingredient_names,
    steps: row.steps,
    prepMinutes: row.prep_minutes,
    servings: row.servings,
    photoUrl: row.photo_url,
    canDelete: row.can_delete,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    avgRating: Number(row.avg_rating),
    ratingCount: row.rating_count,
  }
}

function toRow(input: RecipeInput) {
  return {
    title: input.title.trim(),
    description: input.description?.trim() || null,
    category: input.category,
    ingredients: input.ingredients,
    ingredient_names: input.ingredients.map((i) => i.name.trim().toLowerCase()),
    steps: input.steps,
    prep_minutes: input.prepMinutes,
    servings: input.servings,
    photo_url: input.photoUrl,
  }
}

async function fetchRecipe(id: string): Promise<Recipe> {
  const { data, error } = await supabase.from(VIEW).select('*').eq('id', id).single<RecipeRow>()
  if (error) throw new Error(error.message)
  return mapRow(data)
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from(VIEW)
    .select('*')
    .order('created_at', { ascending: false })
    .returns<RecipeRow[]>()
  if (error) throw new Error(error.message)
  return data.map(mapRow)
}

export async function createRecipe(input: RecipeInput): Promise<Recipe> {
  const { data, error } = await supabase.from(TABLE).insert(toRow(input)).select('id').single<{ id: string }>()
  if (error) throw new Error(error.message)
  return fetchRecipe(data.id)
}

export async function updateRecipe(id: string, input: RecipeInput): Promise<Recipe> {
  const { data, error } = await supabase.from(TABLE).update(toRow(input)).eq('id', id).select('id')
  if (error) throw new Error(error.message)
  if (data.length === 0) throw new Error('This recipe is protected and cannot be edited.')
  return fetchRecipe(id)
}

export async function deleteRecipe(id: string): Promise<void> {
  const { data, error } = await supabase.from(TABLE).delete().eq('id', id).select('id')
  if (error) throw new Error(error.message)
  if (data.length === 0) throw new Error('This recipe is protected and cannot be deleted.')
}

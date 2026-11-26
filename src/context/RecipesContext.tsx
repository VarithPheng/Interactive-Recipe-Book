// RecipesContext: owns the recipe list loaded from Supabase, plus its loading/error status.
// A useReducer holds { items, status, error }; an effect fetches on mount and on reload().
// create/update wait for the server; remove is optimistic and rolls back on failure.
// Ratings (rate) are added in milestone 6.
import { createContext, useCallback, useContext, useEffect, useReducer, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { createRecipe, deleteRecipe, fetchRecipes, updateRecipe } from '@/api/recipes'
import { useFavorites } from '@/context/FavoritesContext'
import type { Recipe, RecipeInput } from '@/lib/types'

type Status = 'loading' | 'success' | 'error'

type State = {
  items: Recipe[]
  status: Status
  error: string | null
}

type Action =
  | { type: 'loading' }
  | { type: 'loaded'; items: Recipe[] }
  | { type: 'failed'; error: string }
  | { type: 'added'; recipe: Recipe }
  | { type: 'updated'; recipe: Recipe }
  | { type: 'removed'; id: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loading':
      return { ...state, status: 'loading', error: null }
    case 'loaded':
      return { items: action.items, status: 'success', error: null }
    case 'failed':
      return { ...state, status: 'error', error: action.error }
    case 'added':
      return { ...state, items: [action.recipe, ...state.items.filter((r) => r.id !== action.recipe.id)] }
    case 'updated':
      return { ...state, items: state.items.map((r) => (r.id === action.recipe.id ? action.recipe : r)) }
    case 'removed':
      return { ...state, items: state.items.filter((r) => r.id !== action.id) }
  }
}

type RecipesValue = State & {
  reload: () => void
  getRecipe: (id: string) => Recipe | undefined
  create: (input: RecipeInput) => Promise<Recipe | null>
  update: (id: string, input: RecipeInput) => Promise<Recipe | null>
  remove: (id: string) => Promise<boolean>
}

const RecipesContext = createContext<RecipesValue | null>(null)

function message(err: unknown): string {
  return err instanceof Error ? err.message : 'Something went wrong.'
}

export function RecipesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], status: 'loading', error: null })
  const [reloadKey, setReloadKey] = useState(0)
  const { prune } = useFavorites()

  // Fetch all recipes on mount and whenever reload() bumps reloadKey.
  useEffect(() => {
    let ignore = false
    fetchRecipes()
      .then((items) => {
        if (ignore) return
        dispatch({ type: 'loaded', items })
        prune(items.map((r) => r.id))
      })
      .catch((err: unknown) => {
        if (!ignore) dispatch({ type: 'failed', error: message(err) })
      })
    return () => {
      ignore = true
    }
  }, [reloadKey, prune])

  const reload = useCallback(() => {
    dispatch({ type: 'loading' })
    setReloadKey((k) => k + 1)
  }, [])

  const getRecipe = useCallback((id: string) => state.items.find((r) => r.id === id), [state.items])

  const create = useCallback(async (input: RecipeInput) => {
    try {
      const recipe = await createRecipe(input)
      dispatch({ type: 'added', recipe })
      toast.success('Recipe added')
      return recipe
    } catch (err) {
      toast.error(`Could not add the recipe. ${message(err)}`)
      return null
    }
  }, [])

  const update = useCallback(async (id: string, input: RecipeInput) => {
    try {
      const recipe = await updateRecipe(id, input)
      dispatch({ type: 'updated', recipe })
      toast.success('Recipe saved')
      return recipe
    } catch (err) {
      toast.error(`Could not save the recipe. ${message(err)}`)
      return null
    }
  }, [])

  const remove = useCallback(
    async (id: string) => {
      const previous = state.items.find((r) => r.id === id)
      dispatch({ type: 'removed', id })
      try {
        await deleteRecipe(id)
        toast.success('Recipe deleted')
        return true
      } catch (err) {
        if (previous) dispatch({ type: 'added', recipe: previous })
        toast.error(`Could not delete the recipe. ${message(err)}`)
        return false
      }
    },
    [state.items],
  )

  return (
    <RecipesContext.Provider value={{ ...state, reload, getRecipe, create, update, remove }}>
      {children}
    </RecipesContext.Provider>
  )
}

export function useRecipes(): RecipesValue {
  const ctx = useContext(RecipesContext)
  if (!ctx) throw new Error('useRecipes must be used inside <RecipesProvider>.')
  return ctx
}

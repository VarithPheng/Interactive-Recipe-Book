// ShoppingListContext: owns this device's shopping list, saved in localStorage (useLocalStorage).
// Adding a recipe merges its ingredients into the list: the same name and unit add up into one line.
// It is global because the Detail page adds to it and the Shopping list page reads and edits it.
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { roundQty } from '@/lib/format'
import type { Ingredient, Unit } from '@/lib/types'

export type ShoppingItem = {
  id: string // lowercase name + unit, so the same ingredient in the same unit merges
  name: string
  qty: number
  unit: Unit
  checked: boolean
  recipes: string[] // titles of the recipes this line came from
}

type ShoppingListValue = {
  items: ShoppingItem[]
  addRecipe: (title: string, ingredients: Ingredient[], factor: number) => void
  toggle: (id: string) => void
  remove: (id: string) => void
  clearChecked: () => void
  clearAll: () => void
  restore: (items: ShoppingItem[]) => void
}

const ShoppingListContext = createContext<ShoppingListValue | null>(null)

const itemId = (name: string, unit: Unit) => `${name.trim().toLowerCase()}|${unit}`

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<ShoppingItem[]>('recipebook:shopping-list:v1', [])

  const addRecipe = useCallback(
    (title: string, ingredients: Ingredient[], factor: number) => {
      setItems((prev) => {
        const next = [...prev]
        for (const ing of ingredients) {
          const id = itemId(ing.name, ing.unit)
          const qty = roundQty(ing.qty * factor)
          const i = next.findIndex((x) => x.id === id)
          if (i === -1) {
            next.push({ id, name: ing.name.trim(), qty, unit: ing.unit, checked: false, recipes: [title] })
          } else {
            const old = next[i]
            next[i] = {
              ...old,
              qty: roundQty(old.qty + qty),
              checked: false, // more is needed now, so it is back on the list
              recipes: old.recipes.includes(title) ? old.recipes : [...old.recipes, title],
            }
          }
        }
        return next
      })
    },
    [setItems],
  )

  const toggle = useCallback(
    (id: string) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, checked: !x.checked } : x))),
    [setItems],
  )
  const remove = useCallback((id: string) => setItems((prev) => prev.filter((x) => x.id !== id)), [setItems])
  const clearChecked = useCallback(() => setItems((prev) => prev.filter((x) => !x.checked)), [setItems])
  const clearAll = useCallback(() => setItems([]), [setItems])
  const restore = useCallback((saved: ShoppingItem[]) => setItems(saved), [setItems])

  const value = useMemo(
    () => ({ items, addRecipe, toggle, remove, clearChecked, clearAll, restore }),
    [items, addRecipe, toggle, remove, clearChecked, clearAll, restore],
  )

  return <ShoppingListContext.Provider value={value}>{children}</ShoppingListContext.Provider>
}

export function useShoppingList(): ShoppingListValue {
  const ctx = useContext(ShoppingListContext)
  if (!ctx) throw new Error('useShoppingList must be used inside <ShoppingListProvider>.')
  return ctx
}

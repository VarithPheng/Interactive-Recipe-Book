// Adds a recipe's ingredients, scaled to the chosen servings, to the shopping list.
import { useNavigate } from 'react-router-dom'
import { ShoppingCartIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useShoppingList } from '@/context/ShoppingListContext'
import { loadShoppingListPage } from '@/lib/pages'
import type { Recipe } from '@/lib/types'

type Props = { recipe: Recipe; servings: number; factor: number }

export function AddToListButton({ recipe, servings, factor }: Props) {
  const { addRecipe } = useShoppingList()
  const navigate = useNavigate()

  function add() {
    addRecipe(recipe.title, recipe.ingredients, factor)
    void loadShoppingListPage()
    const n = recipe.ingredients.length
    toast.success(`Added ${n} ${n === 1 ? 'ingredient' : 'ingredients'} for ${servings} servings`, {
      action: { label: 'View list', onClick: () => navigate('/shopping-list') },
    })
  }

  return (
    <Button variant="outline" onClick={add}>
      <ShoppingCartIcon aria-hidden="true" />
      Add to shopping list
    </Button>
  )
}

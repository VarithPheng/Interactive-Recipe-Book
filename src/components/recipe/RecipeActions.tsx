// Edit and delete buttons for recipes created in the app. Delete asks for confirmation first.
import { Link, useNavigate } from 'react-router-dom'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useRecipes } from '@/context/RecipesContext'
import type { Recipe } from '@/lib/types'

export function RecipeActions({ recipe }: { recipe: Recipe }) {
  const navigate = useNavigate()
  const { remove } = useRecipes()

  function handleDelete() {
    // Removal is optimistic, so leave the page first; a failed delete puts the recipe back and shows a toast.
    navigate('/', { replace: true })
    void remove(recipe.id)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant="outline">
        <Link to={`/recipes/${recipe.id}/edit`}>
          <PencilIcon aria-hidden="true" />
          Edit
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash2Icon aria-hidden="true" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{recipe.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the recipe for everyone and can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep recipe</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Delete recipe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

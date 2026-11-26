// One recipe: photo, ingredients with servings scaler, steps, rating and actions (milestone 3+).
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export function RecipeDetailPage() {
  const { id } = useParams()

  useEffect(() => {
    document.title = 'Recipe | Recipe Book'
  }, [])

  return (
    <article>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Recipe</h1>
      <p className="mt-2 text-muted-foreground">Recipe {id} will load here.</p>
    </article>
  )
}

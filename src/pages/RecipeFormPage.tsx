// Create and edit form in one component; edit mode when the route has an :id (milestone 4).
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export function RecipeFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const heading = isEdit ? 'Edit recipe' : 'Add a recipe'

  useEffect(() => {
    document.title = `${heading} | Recipe Book`
  }, [heading])

  return (
    <section>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">{heading}</h1>
    </section>
  )
}

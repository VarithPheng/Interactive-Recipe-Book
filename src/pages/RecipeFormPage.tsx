// Create and edit in one page: /recipes/new creates, /recipes/:id/edit edits (own recipes only).
import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon, LockIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadError } from '@/components/recipe/LoadError'
import { RecipeForm } from '@/components/recipe/RecipeForm'
import { FormSkeleton } from '@/components/recipe/Skeletons'
import { useRecipes } from '@/context/RecipesContext'
import { loadDetailPage } from '@/lib/pages'
import type { RecipeInput } from '@/lib/types'

export function RecipeFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { status, error, reload, getRecipe, create, update } = useRecipes()
  const recipe = id ? getRecipe(id) : undefined
  const heading = isEdit ? 'Edit recipe' : 'Add a recipe'

  useEffect(() => {
    document.title = `${heading} | Recipe Book`
  }, [heading])

  // Fetch the detail page's code now, so the redirect after saving is instant.
  useEffect(() => {
    void loadDetailPage()
  }, [])

  async function handleCreate(input: RecipeInput) {
    const saved = await create(input)
    if (saved) navigate(`/recipes/${saved.id}`)
  }

  async function handleUpdate(input: RecipeInput) {
    if (!id) return
    const saved = await update(id, input)
    if (saved) navigate(`/recipes/${saved.id}`)
  }

  const back = (
    <Link
      to={isEdit && id ? `/recipes/${id}` : '/'}
      className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeftIcon className="size-4" aria-hidden="true" />
      {isEdit ? 'Back to recipe' : 'All recipes'}
    </Link>
  )

  if (!isEdit) {
    return (
      <section>
        {back}
        <h1 className="mt-4 mb-8 font-heading text-3xl font-semibold tracking-tight">{heading}</h1>
        <RecipeForm submitLabel="Add recipe" onSubmit={handleCreate} />
      </section>
    )
  }

  if (status === 'loading') return <FormSkeleton title={heading} />
  if (status === 'error') return <LoadError error={error} onRetry={reload} />

  if (!recipe) {
    return (
      <section className="py-16">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Recipe not found</h1>
        <p className="mt-2 text-muted-foreground">It may have been deleted, or the link is wrong.</p>
        <Button asChild className="mt-6">
          <Link to="/">Browse recipes</Link>
        </Button>
      </section>
    )
  }

  if (!recipe.canDelete) {
    return (
      <section className="py-16">
        <h1 className="inline-flex items-center gap-2 font-heading text-3xl font-semibold tracking-tight">
          <LockIcon className="size-6" aria-hidden="true" />
          This recipe is protected
        </h1>
        <p className="mt-2 text-muted-foreground">
          Starter recipes can't be edited. You can add your own recipe instead.
        </p>
        <div className="mt-6 flex gap-2">
          <Button asChild>
            <Link to="/recipes/new">Add a recipe</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={`/recipes/${recipe.id}`}>Back to recipe</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section>
      {back}
      <h1 className="mt-4 mb-8 font-heading text-3xl font-semibold tracking-tight">{heading}</h1>
      {/* key remounts the form with fresh defaults if the recipe changes */}
      <RecipeForm key={recipe.id} initial={recipe} submitLabel="Save changes" onSubmit={handleUpdate} />
    </section>
  )
}

// One recipe: photo, ingredients scaled by servings (and added to the shopping list), steps, favorite and share.
// Own recipes get edit/delete; protected ones show only the lock badge. Anyone can rate once per device.
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, ClockIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddToListButton } from '@/components/recipe/AddToListButton'
import { FavoriteButton } from '@/components/recipe/FavoriteButton'
import { LoadError } from '@/components/recipe/LoadError'
import { RatingSummary } from '@/components/recipe/RatingSummary'
import { RecipeActions } from '@/components/recipe/RecipeActions'
import { RecipeBadges } from '@/components/recipe/RecipeBadges'
import { RecipePhoto } from '@/components/recipe/RecipePhoto'
import { ServingsScaler } from '@/components/recipe/ServingsScaler'
import { ShareButton } from '@/components/recipe/ShareButton'
import { DetailSkeleton } from '@/components/recipe/Skeletons'
import { StarRating } from '@/components/recipe/StarRating'
import { useRecipes } from '@/context/RecipesContext'
import { formatAmount, formatMinutes } from '@/lib/format'
import type { Recipe } from '@/lib/types'

export function RecipeDetailPage() {
  const { id = '' } = useParams()
  const { status, error, reload, getRecipe } = useRecipes()
  const recipe = getRecipe(id)

  useEffect(() => {
    document.title = `${recipe?.title ?? 'Recipe'} | Recipe Book`
  }, [recipe?.title])

  if (status === 'loading') return <DetailSkeleton />
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

  // key resets the servings state when moving to a different recipe.
  return <RecipeDetail key={recipe.id} recipe={recipe} />
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const { rate, myRating } = useRecipes()
  const baseServings = recipe.servings ?? 1
  const [servings, setServings] = useState(baseServings)
  const [rateError, setRateError] = useState<string | null>(null)
  const factor = servings / baseServings
  const time = formatMinutes(recipe.prepMinutes)

  return (
    <article>
      <Link to="/" className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon className="size-4" aria-hidden="true" />
        All recipes
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[3fr_2fr]">
        <RecipePhoto src={recipe.photoUrl} alt={recipe.title} eager className="aspect-[4/3] w-full rounded-lg" />

        <div className="flex flex-col gap-4">
          <RecipeBadges recipe={recipe} />
          <h1 className="font-heading text-4xl leading-tight font-semibold tracking-tight text-balance wrap-anywhere">
            {recipe.title}
          </h1>
          {recipe.description && <p className="text-lg wrap-anywhere text-muted-foreground">{recipe.description}</p>}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {time && (
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                {time}
              </span>
            )}
            <RatingSummary avg={recipe.avgRating} count={recipe.ratingCount} />
          </div>
          <div className="flex flex-wrap gap-2">
            <FavoriteButton id={recipe.id} title={recipe.title} withLabel />
            <ShareButton />
          </div>
          {recipe.canDelete && <RecipeActions recipe={recipe} />}
          <section aria-labelledby="rate-heading" className="border-t border-border pt-4">
            <h2 id="rate-heading" className="text-sm font-medium">
              Rate this recipe
            </h2>
            <StarRating
              value={myRating(recipe.id)}
              error={rateError}
              onRate={async (score) =>
                setRateError((await rate(recipe.id, score)) ? null : 'Your rating could not be saved. Try again.')
              }
            />
          </section>
          <section aria-labelledby="list-heading" className="border-t border-border pt-4">
            <h2 id="list-heading" className="text-sm font-medium">
              Shopping list
            </h2>
            <p className="mt-1 mb-3 text-sm text-muted-foreground">
              Adds the ingredients for {servings} {servings === 1 ? 'serving' : 'servings'}.
            </p>
            <AddToListButton recipe={recipe} servings={servings} factor={factor} />
          </section>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_3fr]">
        <section aria-labelledby="ingredients-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="ingredients-heading" className="font-heading text-2xl font-semibold">
              Ingredients
            </h2>
            <ServingsScaler value={servings} onChange={setServings} />
          </div>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {recipe.ingredients.map((ing) => (
              <li key={ing.name} className="flex gap-4 py-2.5">
                <span className="w-24 shrink-0 font-medium tabular-nums">{formatAmount(ing, factor)}</span>
                <span className="min-w-0 wrap-anywhere">{ing.name}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="font-heading text-2xl font-semibold">
            Steps
          </h2>
          <ol className="mt-4 space-y-5">
            {recipe.steps.map((step, i) => (
              <li key={`${i}-${step}`} className="flex gap-4">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <p className="max-w-prose min-w-0 pt-0.5 leading-relaxed wrap-anywhere">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  )
}

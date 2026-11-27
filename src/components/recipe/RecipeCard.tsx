// Grid card: photo, title, badges, prep time, rating and favorite heart. The whole card links to the detail page.
import { Link } from 'react-router-dom'
import { ClockIcon } from 'lucide-react'
import { FavoriteButton } from './FavoriteButton'
import { RatingSummary } from './RatingSummary'
import { RecipeBadges } from './RecipeBadges'
import { RecipePhoto } from './RecipePhoto'
import { formatMinutes } from '@/lib/format'
import type { Recipe } from '@/lib/types'

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const time = formatMinutes(recipe.prepMinutes)

  return (
    <article className="relative flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card focus-within:ring-3 focus-within:ring-ring/50">
      <RecipePhoto src={recipe.photoUrl} alt="" className="aspect-[4/3] w-full" />
      <FavoriteButton id={recipe.id} title={recipe.title} className="absolute top-2 right-2 z-10" />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="font-heading text-lg leading-snug font-semibold wrap-anywhere">
          <Link to={`/recipes/${recipe.id}`} className="outline-none after:absolute after:inset-0 hover:underline">
            {recipe.title}
          </Link>
        </h2>
        <RecipeBadges recipe={recipe} />
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          {time ? (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <ClockIcon className="size-4" aria-hidden="true" />
              {time}
            </span>
          ) : (
            <span />
          )}
          <RatingSummary avg={recipe.avgRating} count={recipe.ratingCount} />
        </div>
      </div>
    </article>
  )
}

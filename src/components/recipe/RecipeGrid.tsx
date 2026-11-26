// Responsive grid of recipe cards (1/2/3/4 columns), plus its loading skeleton.
import { Skeleton } from '@/components/ui/skeleton'
import { RecipeCard } from './RecipeCard'
import type { Recipe } from '@/lib/types'

const GRID = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

export function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  return (
    <ul className={GRID}>
      {recipes.map((r) => (
        <li key={r.id} className="flex">
          <RecipeCard recipe={r} />
        </li>
      ))}
    </ul>
  )
}

export function RecipeGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={GRID} aria-busy="true" aria-label="Loading recipes">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-border">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Responsive grid of recipe cards (1/2/3/4 columns).
import { RecipeCard } from './RecipeCard'
import { GRID_CLASSES } from './Skeletons'
import type { Recipe } from '@/lib/types'

export function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  return (
    <ul className={GRID_CLASSES}>
      {recipes.map((r) => (
        <li key={r.id} className="flex">
          <RecipeCard recipe={r} />
        </li>
      ))}
    </ul>
  )
}

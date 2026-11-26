// Category, Staff pick and protected (lock) badges for a recipe.
import { LockIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Recipe } from '@/lib/types'

export function RecipeBadges({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge variant="secondary">{recipe.category}</Badge>
      {recipe.isFeatured && <Badge>Staff pick</Badge>}
      {!recipe.canDelete && (
        <Badge variant="outline" title="Starter recipe: can't be edited or deleted">
          <LockIcon aria-hidden="true" />
          Protected
        </Badge>
      )}
    </div>
  )
}

// Heart toggle for one recipe, backed by FavoritesContext.
import { HeartIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/context/FavoritesContext'
import { cn } from '@/lib/utils'

type Props = { id: string; title: string; className?: string; withLabel?: boolean }

export function FavoriteButton({ id, title, className, withLabel = false }: Props) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(id)

  return (
    <Button
      type="button"
      variant={withLabel ? 'outline' : 'secondary'}
      size={withLabel ? 'default' : 'icon'}
      aria-pressed={active}
      aria-label={withLabel ? undefined : active ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
      onClick={() => toggle(id)}
      className={className}
    >
      <HeartIcon aria-hidden="true" className={cn(active && 'fill-red-600 text-red-600')} />
      {withLabel && (active ? 'Saved' : 'Save')}
    </Button>
  )
}

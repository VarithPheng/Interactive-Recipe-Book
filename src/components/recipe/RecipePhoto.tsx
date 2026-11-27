// Recipe image with a neutral placeholder when there is no photo or it fails to load.
import { useState } from 'react'
import { UtensilsIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = { src: string | null; alt: string; className?: string; eager?: boolean }

export function RecipePhoto({ src, alt, className, eager = false }: Props) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={cn('flex items-center justify-center bg-muted text-muted-foreground', className)}>
        <UtensilsIcon className="size-8" aria-hidden="true" />
        <span className="sr-only">No photo</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      // React 18 only passes the lowercase attribute through to the DOM.
      {...(eager ? { fetchpriority: 'high' } : {})}
      onError={() => setFailed(true)}
      className={cn('bg-muted object-cover', className)}
    />
  )
}

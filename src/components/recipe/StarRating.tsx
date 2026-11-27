// Five clickable stars for rating a recipe. Shows this device's score; hovering previews a new one.
import { useState } from 'react'
import { StarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  value: number | undefined
  error?: string | null
  onRate: (score: number) => void
}

const LABELS = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent']

export function StarRating({ value, error, onRate }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? value ?? 0

  return (
    <div>
      <div role="group" aria-label="Your rating" className="inline-flex" onMouseLeave={() => setHover(null)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={value === n}
            aria-label={`${n} ${n === 1 ? 'star' : 'stars'}, ${LABELS[n - 1]}`}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(null)}
            onClick={() => onRate(n)}
            className="rounded-md p-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <StarIcon
              aria-hidden="true"
              className={cn('size-7', n <= shown ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/50')}
            />
          </button>
        ))}
      </div>
      <p className={cn('mt-1 h-5 text-sm', error ? 'text-destructive' : 'text-muted-foreground')} aria-live="polite">
        {hover ? LABELS[hover - 1] : error ? error : value ? `You rated this ${value} out of 5` : 'Tap a star to rate'}
      </p>
    </div>
  )
}

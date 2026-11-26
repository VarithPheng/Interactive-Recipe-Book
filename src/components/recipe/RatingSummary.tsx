// Average rating and count, e.g. "4.5 (12)", or "No ratings yet".
import { StarIcon } from 'lucide-react'

export function RatingSummary({ avg, count }: { avg: number; count: number }) {
  if (count === 0) return <span className="text-muted-foreground">No ratings yet</span>

  return (
    <span className="inline-flex items-center gap-1">
      <StarIcon className="size-4 fill-amber-500 text-amber-500" aria-hidden="true" />
      <span>
        {avg.toFixed(1)}
        <span className="text-muted-foreground"> ({count})</span>
      </span>
      <span className="sr-only">
        Rated {avg.toFixed(1)} out of 5 from {count} {count === 1 ? 'rating' : 'ratings'}
      </span>
    </span>
  )
}

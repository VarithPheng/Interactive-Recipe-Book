// Loading placeholders that copy each page's real layout, so nothing shifts when content arrives.
// Used both while a page's code downloads (Suspense) and while its data loads.
import { Skeleton } from '@/components/ui/skeleton'

export const GRID_CLASSES = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

const heading = 'font-heading text-3xl font-semibold tracking-tight'

function CardSkeleton() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-border">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <div className="mt-auto flex justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
  )
}

export function RecipeGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={GRID_CLASSES} aria-busy="true" aria-label="Loading recipes">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

// Favorites page: the heading is static, so render it for real and skeleton only the grid.
export function FavoritesSkeleton() {
  return (
    <section>
      <h1 className={heading}>Favorites</h1>
      <p className="mt-2 text-muted-foreground">Saved on this device.</p>
      <div className="mt-8">
        <RecipeGridSkeleton count={4} />
      </div>
    </section>
  )
}

export function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading recipe">
      <Skeleton className="h-5 w-24" />

      <div className="mt-4 grid gap-8 lg:grid-cols-[3fr_2fr]">
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-11 w-3/4" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-5 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div className="space-y-2 border-t border-border pt-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-9 w-44" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_3fr]">
        <div>
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-9 w-40" />
          </div>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex gap-4 py-2.5">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-8 w-24" />
          <div className="mt-4 space-y-5">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="size-7 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2 pt-0.5">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FieldSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div>
      <Skeleton className="mb-1 h-5 w-24" />
      <Skeleton className={tall ? 'h-16 w-full' : 'h-8 w-full'} />
    </div>
  )
}

export function FormSkeleton({ title }: { title?: string }) {
  return (
    <section aria-busy="true" aria-label="Loading form">
      <Skeleton className="h-5 w-24" />
      {title ? <h1 className={`mt-4 mb-8 ${heading}`}>{title}</h1> : <Skeleton className="mt-4 mb-8 h-9 w-48" />}
      <div className="max-w-3xl space-y-10">
        <div className="space-y-5">
          <FieldSkeleton />
          <FieldSkeleton tall />
          <div>
            <Skeleton className="mb-1 h-5 w-28" />
            <Skeleton className="aspect-[4/3] w-full rounded-lg sm:max-w-xs" />
            <Skeleton className="mt-1 h-4 w-64" />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-36" />
        </div>
      </div>
    </section>
  )
}

export function AboutSkeleton() {
  return (
    <section className="max-w-prose">
      <h1 className={heading}>About</h1>
      <Skeleton className="mt-3 h-6 w-full" />
      <Skeleton className="mt-2 h-6 w-2/3" />
    </section>
  )
}

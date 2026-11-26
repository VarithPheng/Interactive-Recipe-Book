// Error panel with a retry button, shown when recipes fail to load.
import { Button } from '@/components/ui/button'

export function LoadError({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-border p-6">
      <h2 className="font-medium">Recipes couldn't be loaded</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {error ?? 'The server did not respond.'} Check your connection and try again.
      </p>
      <Button variant="outline" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}

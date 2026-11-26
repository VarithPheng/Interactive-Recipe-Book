// Shown for any unknown route.
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page not found | Recipe Book'
  }, [])

  return (
    <section className="py-16">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-muted-foreground">This address doesn't match any page in the recipe book.</p>
      <Button asChild className="mt-6">
        <Link to="/">Browse recipes</Link>
      </Button>
    </section>
  )
}

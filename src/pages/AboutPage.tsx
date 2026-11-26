// Project info: what the app is, who built it, where the code lives.
import { useEffect } from 'react'

export function AboutPage() {
  useEffect(() => {
    document.title = 'About | Recipe Book'
  }, [])

  return (
    <section className="max-w-prose">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">About</h1>
      <p className="mt-3 text-muted-foreground">
        A public recipe book built with React for a university frontend course. Anyone can browse, add and rate recipes.
        Favorites are saved in this browser.
      </p>
      {/* TODO(user): team names and repository link */}
    </section>
  )
}

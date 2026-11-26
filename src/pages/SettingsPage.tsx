// Theme setting and project info.
import { useEffect } from 'react'

export function SettingsPage() {
  useEffect(() => {
    document.title = 'Settings | Recipe Book'
  }, [])

  return (
    <section className="max-w-prose">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Settings</h1>

      <h2 className="mt-8 text-lg font-medium">Appearance</h2>
      <p className="mt-1 text-muted-foreground">The light and dark theme switch is added in milestone 2.</p>

      <h2 className="mt-8 text-lg font-medium">About</h2>
      <p className="mt-1 text-muted-foreground">
        A public recipe book built with React for a university frontend course.
      </p>
      {/* TODO(user): team names and repository link */}
    </section>
  )
}

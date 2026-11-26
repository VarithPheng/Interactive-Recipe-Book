// App shell: navbar on top, the current page below, and the toast container.
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring/50"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        {/* Safety net only: each lazy route has its own layout-matched skeleton in App.tsx. */}
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      <Toaster theme="light" position="bottom-center" />
    </div>
  )
}

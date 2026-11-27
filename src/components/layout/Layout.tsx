// App shell: navbar on top, the current page below, and the toast container.
// On a new page (link or redirect, not Back/Forward) it scrolls to the top and moves focus to the page,
// so keyboard and screen-reader users start at the new content instead of where the old page was.
import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Navbar } from './Navbar'

export function Layout() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()
  const mainRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (navigationType === 'POP') return // the browser restores the old scroll position
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname, navigationType])

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring/50"
      >
        Skip to content
      </a>
      <Navbar />
      <main ref={mainRef} id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-8 outline-none sm:px-6">
        {/* Safety net only: each lazy route has its own layout-matched skeleton in App.tsx. */}
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      <Toaster theme="light" position="bottom-center" />
    </div>
  )
}

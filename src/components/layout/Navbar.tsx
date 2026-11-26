// Top navigation with page links and a collapsible menu on small screens.
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { MenuIcon, PlusIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const LINKS = [
  { to: '/', label: 'Recipes', end: true },
  { to: '/favorites', label: 'Favorites', end: false },
  { to: '/settings', label: 'Settings', end: false },
]

function linkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
    isActive ? 'font-medium text-foreground' : 'text-muted-foreground',
  )
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="border-b border-border">
      <nav aria-label="Main" className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link to="/" className="mr-auto font-heading text-xl font-semibold tracking-tight">
          Recipe Book
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          {/* TODO(milestone 2): theme toggle wired to SettingsContext */}
          <Button asChild className="ml-2">
            <Link to="/recipes/new">
              <PlusIcon aria-hidden="true" />
              Add recipe
            </Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </Button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-border px-4 py-3 sm:hidden">
          <div className="flex flex-col">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={closeMenu}>
                {l.label}
              </NavLink>
            ))}
            <Button asChild className="mt-2">
              <Link to="/recipes/new" onClick={closeMenu}>
                <PlusIcon aria-hidden="true" />
                Add recipe
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

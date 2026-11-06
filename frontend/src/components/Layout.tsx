import { Link, NavLink, Outlet } from 'react-router'
import { primaryButtonClass } from './ui'

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'font-medium text-accent' : 'text-muted hover:text-text'
}

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
          <Link to="/" className="text-xl font-semibold text-accent">
            My Bookshelf
          </Link>
          <nav className="flex gap-4 text-sm">
            <NavLink to="/" end className={navClass}>
              Library
            </NavLink>
            <NavLink to="/wishlist" className={navClass}>
              Wish list
            </NavLink>
          </nav>
          <Link to="/books/new" className={`ml-auto ${primaryButtonClass}`}>
            Add book
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}

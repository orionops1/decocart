import { Outlet, NavLink } from 'react-router-dom'
import { ShoppingBag, Search, Menu, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-brand-bg/80 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <span className="gold-gradient">DecoCart</span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-muted">
            <NavLink to="/packages" className={({ isActive }) => cn('hover:text-brand-text transition-colors', isActive && 'text-brand-gold')}>
              Packages
            </NavLink>
            <NavLink to="/track" className={({ isActive }) => cn('hover:text-brand-text transition-colors', isActive && 'text-brand-gold')}>
              Track
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <NavLink to="/packages" className="btn-primary text-sm py-2 px-4 hidden md:inline-flex">
              Book a Surprise
            </NavLink>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-brand-card transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-brand-border bg-brand-bg px-4 py-4 flex flex-col gap-4">
            <NavLink to="/packages" onClick={() => setMobileOpen(false)} className="text-brand-muted hover:text-brand-text transition-colors">Packages</NavLink>
            <NavLink to="/track" onClick={() => setMobileOpen(false)} className="text-brand-muted hover:text-brand-text transition-colors">Track Order</NavLink>
            <NavLink to="/packages" onClick={() => setMobileOpen(false)} className="btn-primary text-sm justify-center">Book a Surprise</NavLink>
          </div>
        )}
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-brand-border py-10 text-brand-muted text-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display text-base font-semibold text-brand-text">
            <Sparkles className="w-4 h-4 text-brand-gold" />
            DecoCart
          </div>
          <p>© {new Date().getFullYear()} DecoCart. All rights reserved.</p>
          <p>Made with 🎉 in Sri Lanka</p>
        </div>
      </footer>
    </div>
  )
}

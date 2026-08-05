import { Menu, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

import { useAppShellStore } from '../../app/store/useAppShellStore';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Browse', to: '/browse' },
  { label: 'My List', to: '/my-list' },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary/15 text-foreground'
      : 'text-muted hover:bg-surface hover:text-foreground',
  ].join(' ');
}

export function Navbar() {
  const { closeMobileNav, isMobileNavOpen, toggleMobileNav } =
    useAppShellStore();

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink
          aria-label="Anivue home"
          className="text-lg font-semibold tracking-wide text-foreground"
          onClick={closeMobileNav}
          to="/"
        >
          Anivue
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink className={navLinkClass} key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors hover:border-primary/60 hover:text-foreground"
            type="button"
          >
            <Search aria-hidden="true" size={18} />
          </button>
          <button
            aria-expanded={isMobileNavOpen}
            aria-label="Toggle navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors hover:border-primary/60 hover:text-foreground md:hidden"
            onClick={toggleMobileNav}
            type="button"
          >
            {isMobileNavOpen ? (
              <X aria-hidden="true" size={18} />
            ) : (
              <Menu aria-hidden="true" size={18} />
            )}
          </button>
        </div>
      </nav>

      {isMobileNavOpen ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border bg-background px-4 py-3 md:hidden"
          initial={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                className={navLinkClass}
                key={item.to}
                onClick={closeMobileNav}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}

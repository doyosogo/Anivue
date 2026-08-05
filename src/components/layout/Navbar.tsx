import { Menu, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { useEffect, useRef, useState, type FormEvent } from 'react';

import { useAppShellStore } from '../../app/store/useAppShellStore';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_QUERY_LENGTH } from '../../features/search/config/searchFilters';
import { useMyListStore } from '../../features/my-list/store/useMyListStore';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Browse', to: '/search' },
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
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '');
  const myListCount = useMyListStore((state) => Object.keys(state.items).length);
  const debouncedSearchValue = useDebouncedValue(
    searchValue,
    SEARCH_DEBOUNCE_MS,
  );

  useEffect(() => {
    setSearchValue(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const trimmedValue = debouncedSearchValue.trim();
    if (!isSearchOpen || trimmedValue.length < SEARCH_MIN_QUERY_LENGTH) {
      return;
    }

    const currentQuery = searchParams.get('q') ?? '';
    if (location.pathname === '/search' && currentQuery === trimmedValue) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmedValue)}`, { replace: true });
    closeMobileNav();
  }, [
    closeMobileNav,
    debouncedSearchValue,
    isSearchOpen,
    location.pathname,
    navigate,
    searchParams,
  ]);

  function submitSearch(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const trimmedValue = searchValue.trim();
    if (trimmedValue.length < SEARCH_MIN_QUERY_LENGTH) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmedValue)}`);
    closeMobileNav();
  }

  function clearSearch() {
    setSearchValue('');
    inputRef.current?.focus();
    if (location.pathname === '/search') {
      navigate('/search');
    }
  }

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
            <NavLink
              aria-label={
                item.to === '/my-list' && myListCount > 0
                  ? `My List, ${myListCount} saved`
                  : undefined
              }
              className={navLinkClass}
              key={item.to}
              to={item.to}
            >
              <span>{item.label}</span>
              {item.to === '/my-list' && myListCount > 0 ? (
                <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-foreground">
                  {myListCount}
                </span>
              ) : null}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <motion.form
            animate={{ width: isSearchOpen ? 260 : 40 }}
            className="relative hidden items-center md:flex"
            onSubmit={submitSearch}
            role="search"
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {isSearchOpen ? (
              <>
                <label className="sr-only" htmlFor="navbar-search">
                  Search anime
                </label>
                <input
                  className="h-10 w-full rounded-md border border-border bg-surface py-2 pl-10 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/40"
                  id="navbar-search"
                  onChange={(event) => setSearchValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setIsSearchOpen(false);
                    }
                  }}
                  placeholder="Search anime"
                  ref={inputRef}
                  value={searchValue}
                />
                <Search
                  aria-hidden="true"
                  className="absolute left-3 text-muted"
                  size={17}
                />
                {searchValue.length > 0 ? (
                  <button
                    aria-label="Clear search"
                    className="absolute right-2 inline-flex h-6 w-6 items-center justify-center rounded text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={clearSearch}
                    type="button"
                  >
                    <X aria-hidden="true" size={15} />
                  </button>
                ) : null}
              </>
            ) : (
              <button
                aria-label="Open search"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => setIsSearchOpen(true)}
                type="button"
              >
                <Search aria-hidden="true" size={18} />
              </button>
            )}
          </motion.form>

          <button
            aria-label="Open mobile search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
            onClick={() => setIsSearchOpen((value) => !value)}
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

      {isSearchOpen ? (
        <motion.form
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-border bg-background px-4 py-3 md:hidden"
          initial={{ opacity: 0, y: -8 }}
          onSubmit={submitSearch}
          role="search"
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          <div className="relative mx-auto max-w-6xl">
            <label className="sr-only" htmlFor="mobile-navbar-search">
              Search anime mobile
            </label>
            <input
              className="h-11 w-full rounded-md border border-border bg-surface py-2 pl-10 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/40"
              id="mobile-navbar-search"
              onChange={(event) => setSearchValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setIsSearchOpen(false);
                }
              }}
              placeholder="Search anime"
              ref={inputRef}
              value={searchValue}
            />
            <Search
              aria-hidden="true"
              className="absolute left-3 top-3 text-muted"
              size={17}
            />
            {searchValue.length > 0 ? (
              <button
                aria-label="Clear search"
                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={clearSearch}
                type="button"
              >
                <X aria-hidden="true" size={15} />
              </button>
            ) : null}
          </div>
        </motion.form>
      ) : null}

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

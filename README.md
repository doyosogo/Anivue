# Anivue

Anivue is a production-minded React foundation for a modern anime discovery and
tracking experience. This initial version intentionally focuses on application
architecture, tooling, styling, routing, and test infrastructure. It does not
integrate AniList or include anime-specific product features yet.

## Tech Stack

- React + TypeScript
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- TanStack Query
- Zustand
- Lucide React
- ESLint + Prettier
- Vitest + React Testing Library

## Folder Structure

```text
src/
  app/
    providers/        App-level providers such as TanStack Query
    store/            App shell state powered by Zustand
    App.tsx           Root application composition
    router.tsx        Route configuration
  components/
    layout/           Reusable shell components
  features/
    browse/           Browse route boundary
    home/             Home route boundary
    my-list/          My List route boundary
    not-found/        404 route boundary
  styles/
    globals.css       Tailwind entrypoint and CSS design tokens
```

## Development Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run format
```

## Design System

Anivue uses dark CSS variables as design tokens, with deep navy application
surfaces and purple-blue accents. Tailwind maps these tokens into semantic color
utilities so components can stay consistent as the product grows.

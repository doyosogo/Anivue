# Anivue

Anivue is a production-minded React application foundation for a modern anime
discovery and tracking experience. The current homepage includes a cinematic
featured hero sourced from AniList trending metadata, plus reusable catalogue
sections for trending, popular, and current-season anime. Anime cards and the
featured hero link to a dedicated details page at `/anime/:id`.

Anivue does not host anime episodes. Future playback experiences are expected to
use a membership-lock concept that points users toward appropriate licensed
access rather than storing or serving video content directly.

The current `Watch Now` action intentionally opens a prototype
`Membership Required` modal. It demonstrates product direction without adding
authentication, pricing, payments, or playback.

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
- AniList GraphQL API for public catalogue metadata

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
  services/
    anilist/          Typed GraphQL client, operations, errors, and utilities
  styles/
    globals.css       Tailwind entrypoint and CSS design tokens
```

## API Architecture

AniList catalogue metadata is accessed from the public GraphQL endpoint at
`https://graphql.anilist.co` with the browser Fetch API and TanStack Query. Public
anime metadata does not require user authentication, API credentials, or
environment variables.

The AniList service layer is intentionally small:

- `client.ts` sends typed GraphQL POST requests and normalizes HTTP, GraphQL,
  network, parse, and rate-limit failures.
- `queries.ts` stores reusable catalogue operations and a shared media fragment.
- `types.ts` defines the AniList response shapes used by the app.
- `season.ts` calculates the current AniList season and season year.
- `media.ts` contains small media utilities such as preferred-title fallback.

AniList data and images remain owned or managed by their respective sources.
Anivue uses AniList as a catalogue source and does not claim endorsement by
AniList.

Planned trailer support should use official trailer metadata where available,
without treating trailers as hosted Anivue playback content.

The featured hero can open official YouTube trailer embeds when AniList provides
trailer metadata. If no trailer exists, the trailer action is disabled
gracefully.

## Current Progress

- Homepage: cinematic featured hero and three independent catalogue carousels.
- Details page: banner hero, poster, metadata, expandable sanitized description,
  characters, recommendations, relations, staff, and studios.
- Search: URL-driven catalogue discovery at `/search` with debounced title
  queries, filters, sorting, pagination, and result cards that route to details.
- Prototype actions: `Watch Now` opens the membership-required modal, trailers
  open in an embed modal when available, and `Add to My List` is visual only.

## Search

Search state is stored in URL query parameters so pages can be refreshed,
shared, and navigated with browser back/forward. Supported parameters include
`q`, `genre`, `format`, `status`, `season`, `year`, `sort`, and `page`.

Supported filters:

- Genre: a curated AniList-compatible anime genre list
- Format: `TV`, `TV_SHORT`, `MOVIE`, `SPECIAL`, `OVA`, `ONA`, `MUSIC`
- Status: `FINISHED`, `RELEASING`, `NOT_YET_RELEASED`, `CANCELLED`, `HIATUS`
- Season: `WINTER`, `SPRING`, `SUMMER`, `FALL`
- Year: validated numeric range
- Sort: relevance for title searches, plus popularity, trending, score, start
  date, and romaji title sorting

Navbar and search-page text input is debounced before updating `/search`, while
pressing Enter submits immediately. Search uses TanStack Query and the existing
AniList Fetch client, passes cancellation signals through requests, and uses
standard Previous/Next pagination through the `page` URL parameter.

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

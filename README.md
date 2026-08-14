# Anivue

**A polished anime discovery portfolio prototype built with React, TypeScript,
AniList GraphQL, TanStack Query, Zustand, Tailwind CSS, and Framer Motion.**

Anivue presents public anime catalogue metadata through a premium
streaming-platform interface. It demonstrates production-minded frontend
architecture: typed API access, resilient async states, URL-driven search,
accessible modals, reusable UI components, local personalization, and static
deployment readiness.

Anivue does not host anime episodes. `Watch Now` intentionally opens a
membership-lock prototype explaining that playback, accounts, payments, and
registration are not implemented.

## Live Demo

Deployment is not published yet.

When deployed, add the portfolio URL here:

```text
Live demo: pending deployment
```

## Screenshots

Screenshots are not committed yet. Store real captures in
[`docs/screenshots/`](./docs/screenshots/).

Suggested captures:

- Homepage desktop
- Homepage mobile
- Search results with active filters
- Anime details page
- Membership-required modal
- Official trailer modal when a supported trailer is available
- My List
- Viewing History

## Demo Guide

For a concise recruiter walkthrough, see [DEMO.md](./DEMO.md).

## Feature Overview

- Cinematic homepage with featured anime sourced from AniList trending metadata
- Independent catalogue rows for Trending, Popular, and Current Season anime
- URL-driven search with query, genre, format, status, season, year, sort, and
  pagination
- Dedicated anime details pages at `/anime/:id`
- Browser-only My List with Zustand persistence
- Browser-only Recently Viewed history at `/history`
- Lightweight `Because You Viewed` recommendations from AniList recommendation
  metadata
- Reusable membership-lock modal for unavailable playback
- Safe official YouTube trailer modal with provider and ID validation
- Responsive application shell, navbar search, mobile navigation, loading
  skeletons, empty states, and error states

## Project Status

Anivue is ready for portfolio presentation and static deployment.

Implemented and tested:

- Homepage, search, anime details, My List, Viewing History, and 404 routes
- Public AniList GraphQL catalogue integration
- Local browser persistence for My List and Recently Viewed
- Accessible Modal, Button, AnimeCard, AnimeImage, and HorizontalCarousel
  primitives
- Production build, lint, and deterministic test suite
- SPA route fallback config for Vercel and Netlify

Intentional prototype boundaries:

- No episode playback
- No accounts, authentication, backend, or database
- No payments, checkout, pricing, or membership activation
- No hosted, downloaded, proxied, or streamed anime episodes
- My List and Recently Viewed are stored only in the current browser

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
- AniList GraphQL API

## Architecture Overview

```text
src/
  app/
    providers/        App-level providers, including TanStack Query
    store/            App shell UI state
    router.tsx        Route configuration
  components/
    anime/            AnimeCard, AnimeImage, FeaturedHero, skeletons
    common/           Button, Modal, Carousel, states, section headers
    layout/           Navbar, main layout, footer
  features/
    anime/            Details route and detail query hook
    home/             Homepage sections and catalogue hooks
    membership/       Membership-lock modal and prototype disclosure
    my-list/          Browser-persisted saved titles
    recently-viewed/  Browser-persisted history and recommendations
    search/           URL state, filters, search hook, search page
    trailer/          Trailer modal and safe embed utilities
    watch/            Shared Watch Now and Watch Trailer controls
  services/
    anilist/          Typed GraphQL client, queries, errors, snapshots
  styles/
    globals.css       Tailwind entrypoint and CSS design tokens
```

### Data Access

AniList catalogue metadata is accessed from `https://graphql.anilist.co` with
the browser Fetch API and TanStack Query. Public anime metadata does not require
user authentication, API credentials, or environment variables.

The AniList service layer includes:

- Typed GraphQL request helpers
- Shared media fragments
- HTTP, GraphQL, parse, network, and rate-limit error handling
- Response shape parsing before data reaches UI code
- Current-season calculation
- Compact media snapshots for local persistence

### Local Personalization

My List and Recently Viewed are separate Zustand persisted stores.

- `anivue-my-list` stores saved-title snapshots plus `dateAdded`
- `anivue-recently-viewed` stores opened-details snapshots plus `viewedAt`
- Recently Viewed is capped at 30 titles
- Neither store sends data to an account, backend, or external service

## Local Development

Prerequisites:

- Node.js 20+ recommended
- npm

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Testing and Validation

```bash
npm run lint
npm run test
npm run build
```

The automated test suite mocks AniList requests and does not make live network
calls to AniList.

## Deployment

Anivue is a Vite single-page application. Build output is emitted to `dist/`.

### Deployment Checklist

Before publishing:

- Run `npm run build`
- Run `npm run lint`
- Run `npm run test`
- Preview the production build with `npm run preview` when local port binding is
  available
- Verify direct route refreshes for `/`, `/search`, `/my-list`, `/history`,
  `/anime/1`, and an unknown route
- Confirm My List and Recently Viewed persist after refresh in the same browser
- Confirm visible copy does not imply real streaming, accounts, payments, or
  hosted anime episodes
- Add the deployed URL to the Live Demo section after deployment
- Capture real screenshots into `docs/screenshots/`

Vercel:

- Build command: `npm run build`
- Output directory: `dist`
- `vercel.json` rewrites all routes to `/` so direct navigation and refreshes
  work for `/search`, `/my-list`, `/history`, and `/anime/:id`

Netlify:

- Build command: `npm run build`
- Publish directory: `dist`
- `public/_redirects` is copied into `dist/` and rewrites all routes to
  `/index.html`

Other static hosts need the same SPA fallback rule: serve `index.html` for
unknown routes while leaving built assets untouched.

## Privacy and Prototype Limits

Anivue is a non-commercial portfolio prototype.

- It displays public anime metadata and official promotional trailer embeds.
- It does not provide anime episode streaming.
- It does not create user accounts or process payments.
- My List and Recently Viewed are stored only in the current browser.
- Clearing browser storage removes local saved titles and viewing history.

## Attribution

Anime metadata, images, and trailer metadata are provided by AniList and remain
owned or managed by their respective sources. Anivue uses AniList as a public
catalogue source and does not claim endorsement by AniList.

## Suggested GitHub Repository Description

Production-quality anime discovery portfolio prototype built with React,
TypeScript, Vite, TanStack Query, Zustand, Tailwind CSS, Framer Motion, and the
AniList GraphQL API.

## Suggested Topics

```text
react typescript vite tailwindcss tanstack-query zustand framer-motion anilist graphql anime portfolio frontend accessibility
```

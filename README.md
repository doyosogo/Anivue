# Anivue

Anivue is a production-quality anime discovery portfolio prototype. It presents
public AniList catalogue metadata through a polished streaming-platform
interface built with React, TypeScript, TanStack Query, Zustand, Framer Motion,
and Tailwind CSS.

The app includes a cinematic homepage, search and discovery filters, dedicated
anime details pages, browser-only My List, Recently Viewed, lightweight
personalised recommendations, membership-lock messaging, and safe official
YouTube trailer embeds.

Anivue does not host anime episodes. `Watch Now` intentionally opens a reusable
membership-lock modal that explains playback, accounts, payments, and
registration are not implemented in this non-commercial portfolio prototype.

## Project Status

Anivue is ready for portfolio presentation and static deployment. The core user
flows are implemented and tested:

- Browse/search public anime metadata.
- Open details pages directly at `/anime/:id`.
- Save titles to My List in the current browser.
- Review browser-only Viewing History at `/history`.
- See AniList-powered personalised recommendations after opening details pages.
- Open supported official YouTube trailers without hosting or proxying media.

Known intentional limits:

- No episode playback, accounts, payments, backend, or hosted anime video.
- My List and Recently Viewed are local to the current browser.
- AniList data, images, and trailer metadata remain owned or managed by their
  respective sources.

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
    membership/       Reusable membership-lock modal and prototype disclosure
    my-list/          My List route boundary
    not-found/        404 route boundary
    recently-viewed/  Browser-only viewing history and recommendations
    trailer/          Official trailer modal, provider validation, and embed utils
    watch/            Shared Watch Now and Watch Trailer controls
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
- `snapshot.ts` maps AniList media into compact browser-persisted snapshots.

AniList data and images remain owned or managed by their respective sources.
Anivue uses AniList as a catalogue source and does not claim endorsement by
AniList.

Official trailer support uses AniList trailer metadata where available, without
treating trailers as hosted Anivue playback content. Anivue currently supports
validated YouTube trailer IDs only, renders privacy-conscious
`youtube-nocookie.com` embeds, and rejects unsupported providers, malformed IDs,
or arbitrary URLs.

## Current Progress

- Homepage: cinematic featured hero, catalogue carousels, Recently Viewed, and
  Because You Viewed recommendations.
- Details page: banner hero, poster, metadata, expandable sanitized description,
  characters, recommendations, relations, staff, and studios.
- Search: URL-driven catalogue discovery at `/search` with debounced title
  queries, filters, sorting, pagination, and result cards that route to details.
- My List: browser-only saved titles with local persistence, card controls,
  details/hero integration, sorting, and clear confirmation.
- Recently Viewed: browser-only history of opened details pages, surfaced on the
  homepage and managed at `/history`.
- Because You Viewed: a lightweight homepage row powered by AniList
  recommendations for the most recently viewed title.
- Prototype actions: `Watch Now` opens the shared membership-required modal,
  trailers open in the shared official-trailer modal when supported, and `Add to
  My List` persists locally.

## Membership and Trailers

The membership lock is a non-commercial prototype experience. It explains that
episode playback and membership registration are intentionally unavailable and
that Anivue does not host copyrighted anime episodes. No real purchase,
checkout, account creation, or payment flow exists.

Shared watch controls live in `features/watch` and are used by both the
homepage featured hero and anime details page. The controls open
`MembershipRequiredModal` for locked playback and `TrailerModal` for supported
official promotional trailers.

Trailer embeds are created only after provider and ID validation. Supported
trailer metadata may render in an accessible modal iframe; missing, unsupported,
or malformed trailer metadata leaves the trailer action disabled.

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

## My List

My List does not require an account and does not use a backend. Saved titles are
stored only in the current browser with Zustand persist under the
`anivue-my-list` localStorage key. Clearing browser data removes the saved list.

The persisted data is a compact catalogue snapshot rather than the full AniList
details response. It stores stable rendering fields such as id, title, cover and
banner images, score, episode count, status, format, season/year, genres, trailer
summary, and date added. This lets `/my-list` render without issuing one AniList
request per saved title.

Persistence includes a version and a safe migration fallback so malformed or
older local data does not crash the app.

## Recently Viewed

Recently Viewed is separate from My List. It records a title only after a valid
anime details page loads at `/anime/:id`; rendering or hovering an AnimeCard does
not add anything to history. This is not episode progress, not Continue
Watching, and not playback tracking.

Viewing history is stored only in the current browser with Zustand persist under
the `anivue-recently-viewed` localStorage key. No history is sent to an Anivue
account or backend. Clearing browser storage removes it.

The persisted history stores compact AniList catalogue snapshots plus `viewedAt`
timestamps, capped at 30 titles. Recording the same title later updates
`viewedAt` and moves it to the front; rapid duplicate records are ignored to keep
development Strict Mode stable.

The homepage shows a Recently Viewed row only when browser history exists, using
stored snapshots without refetching each title. `/history` provides a dedicated
Viewing History page with count, sorting, individual removal, and clear-all
confirmation.

The personalised `Because You Viewed [Anime Title]` row uses the most recently
viewed AniList ID to request a focused recommendation set from AniList. Results
exclude adult entries, the seed title, duplicates, and invalid recommendation
items.

## Development Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run format
```

## Deployment

Anivue is a Vite single-page application. Build output is emitted to `dist/`.

Vercel:

```bash
npm run build
```

Use the default Vite/static settings. `vercel.json` rewrites all routes to `/`
so direct navigation and refreshes work for `/search`, `/my-list`, `/history`,
and `/anime/:id`.

Netlify:

```bash
npm run build
```

Publish `dist/`. The `public/_redirects` file is copied into the build and
rewrites all routes to `/index.html` for SPA refresh safety.

Other static hosts need the same fallback rule: serve `index.html` for unknown
paths while leaving built assets untouched.

## Design System

Anivue uses dark CSS variables as design tokens, with deep navy application
surfaces and purple-blue accents. Tailwind maps these tokens into semantic color
utilities so components can stay consistent as the product grows.

## Production Readiness Notes

The current polish pass focuses on keyboard and assistive-technology behaviour
across shared primitives and route surfaces. Modal focus setup is cleaned up on
unmount, carousel controls target the actual scroll region, navbar search
restores focus when dismissed with Escape, and viewing-history states keep a
stable page heading across loading, empty, and populated states.

Image components reserve aspect ratio, lazy load, decode asynchronously, recover
when a failed source is replaced, and keep transient loading labels hidden from
screen readers. Search pagination cleans up deferred scroll work on unmount and
respects reduced-motion preferences where practical.

TanStack Query remains the only remote-data cache. Persisted Zustand stores keep
browser-only My List and Recently Viewed data isolated, with test-safe resets and
hydration-aware rendering where persisted history affects homepage
personalisation.

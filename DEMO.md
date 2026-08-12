# Anivue Demo Guide

## 60-Second Recruiter Script

Anivue is a production-quality anime discovery portfolio prototype. It uses
React, TypeScript, Vite, TanStack Query, Zustand, Tailwind CSS, Framer Motion,
and the public AniList GraphQL API.

The goal is to demonstrate how I structure a real frontend product: typed data
access, reusable UI primitives, route-driven search, accessible modals,
browser-only personalization, and resilient loading, empty, and error states.

This is not a streaming service. Anivue does not host anime episodes and does
not implement accounts, payments, or playback. The membership lock is a product
prototype pattern, and supported official trailers are embedded safely from
YouTube metadata supplied by AniList.

## Suggested Live Demo Flow

1. Start on `/` and show the featured hero plus independent catalogue rows.
2. Open `Watch Now` to show the membership-required modal and prototype limits.
3. Open an official trailer when available, then close the modal.
4. Search from the navbar, then show `/search` filters, sorting, and pagination.
5. Open an anime details page and point out metadata, recommendations, relations,
   characters, studios, My List, and Viewing History recording.
6. Add a title to My List, refresh or revisit `/my-list`, and show local
   persistence.
7. Visit `/history`, remove one item or open clear confirmation, and explain
   browser-only history.
8. Return home to show Recently Viewed and Because You Viewed sections after
   history exists.
9. Navigate to `/not-a-real-route` to show the 404 route.

## Technical Talking Points

- Typed AniList GraphQL service using Fetch API, not Apollo or Axios.
- TanStack Query handles catalogue, search, details, and recommendation caching.
- Query keys include all variables that affect results.
- Zustand persist stores My List and Recently Viewed separately in localStorage.
- Search state is URL-driven for refresh, sharing, and browser navigation.
- Trailer embeds validate provider and ID before rendering an iframe.
- Modal behavior includes Escape close, backdrop close, focus trap, and focus
  restoration.
- Responsive UI uses reusable cards, carousels, buttons, modals, skeletons,
  empty states, and error states.
- Static deployment supports SPA route refreshes through Vercel and Netlify
  rewrite configuration.

## Intentional Prototype Limits

- No episode playback.
- No accounts, authentication, backend, or database.
- No payments, checkout, pricing, or membership activation.
- No hosted, downloaded, proxied, or streamed anime episodes.
- My List and Recently Viewed are stored only in the current browser.
- AniList data, images, and trailer metadata remain owned or managed by their
  respective sources.

## Suggested GitHub Description

Production-quality anime discovery portfolio prototype built with React,
TypeScript, Vite, TanStack Query, Zustand, Tailwind CSS, Framer Motion, and the
AniList GraphQL API.

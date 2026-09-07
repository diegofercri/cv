# Architecture

Technical design of the project: how the pieces fit together and why. For
commands and working conventions, see `AGENTS.md`; for commit format, see
`CONTRIBUTING.md`.

## Overview

This is a **static, per-locale** app: no backend, no database, no API of its
own. CV content lives in two JSON files (`es`/`en`), rendered by Next.js
server components. The only "dynamic" runtime code is a proxy (middleware)
that decides which language to redirect the root `/` to.

```
Accept-Language ──▶ src/proxy.ts ──▶ /{lang}
                                        │
                              src/app/[lang]/layout.tsx  (metadata, fonts, <html lang>)
                                        │
                              src/app/[lang]/page.tsx     (orchestrates sections)
                                        │
        ┌───────────────┬───────────────┼───────────────┬───────────────┐
     Header          Summary      WorkExperience     Education   Skills / Projects
        │               │               │                │             │
        └───────────────┴───────────────┴────────────────┴─────────────┘
                                        │
                         resume: ResumeData ◀── src/data/{es,en}.json
                         dict:   Dictionary ◀── src/lib/i18n.ts (hardcoded)
```

## Routing and i18n

- `src/proxy.ts` (Next middleware) intercepts any route without a locale
  prefix, parses `Accept-Language`, and issues a **308 redirect** to
  `/{lang}`. It's 308 (permanent) on purpose, to consolidate SEO signals on
  the locale URL instead of splitting them between `/` and `/es`.
- `src/app/[lang]/` is the only real route segment; `[lang]` is validated
  with `isLocale()` (`src/lib/i18n.ts`) and calls `notFound()` if it isn't
  `es`/`en`.
- `generateStaticParams()` in `layout.tsx` pre-generates both locales at
  build time: there's no language lookup at runtime beyond the initial
  proxy hop.
- Two text sources, deliberately kept separate:
  - **CV content** → `src/data/{es,en}.json`, typed by `ResumeData`
    (`src/lib/types.ts`). This is what an end user edits to personalize
    their own résumé.
  - **UI copy** (labels, aria-labels, command menu strings) → `Dictionary`
    in `src/lib/i18n.ts`, embedded in code, not in JSON.

## Components

- `src/app/components/`: **page** components, one per CV section (`header`,
  `summary`, `work-experience`, `education`, `skills`, `projects`). They
  receive `resume`/`dict` (or the slice they need) as props from
  `page.tsx`; they don't read data on their own.
- `src/components/`: shared and reusable outside the CV page (`avatar`,
  `command-menu`, `language-switcher`, `error-boundary`, `icons/`).
- `src/components/ui/`: **shadcn/ui** primitives (button, card, badge,
  dialog, command...) on top of Radix UI. Generate/update them with the
  shadcn CLI (`components.json` fixes config and aliases) rather than
  hand-writing them.
- `CommandMenu` (`cmdk`) is the only significant interactive piece: a
  command palette with the CV's contact/social links and quick actions
  (print, switch language).

## Data → types → UI

`src/lib/types.ts` defines `ResumeData` and is the source of truth for the
shape: both `es.json` and `en.json` must conform to it (`satisfies
Record<Locale, ResumeData>` in `i18n.ts` enforces this at compile time). Any
CV field change starts at the type, then both JSON files, then the
consuming component.

`getResumeData(locale)` and `getDictionary(locale)` are the only two access
points for data/copy; components don't import the JSON files directly.

## SEO and metadata

- `layout.tsx` builds per-locale `Metadata` (title, OpenGraph, Twitter card,
  `alternates.languages` with `x-default`) from `resume` + `SITE_URL`.
- `structured-data.ts` generates JSON-LD (schema.org `Person`) injected as a
  `<script type="application/ld+json">` in `page.tsx` — the only audited
  exception to `dangerouslySetInnerHTML` (flagged with `biome-ignore`; safe
  because the content is `JSON.stringify` of first-party data).
- `opengraph-image.tsx` generates the OG image per locale; `sitemap.ts`
  exposes URLs for both languages.

## Styling

Tailwind CSS following shadcn/ui conventions (`components.json`: `gray`
base color, CSS variables, no prefix). `globals.css` defines light/dark
theming via CSS variables; components use `cn()` (`src/lib/utils.ts`,
`clsx` + `tailwind-merge`) to compose classes conditionally. Several
components carry explicit `print:` styles: the printable layout is a
product requirement, not an afterthought.

## Robustness details

- `escapeDateDetection()` (`src/lib/utils.ts`) inserts an invisible
  word-joiner (U+2060) into date ranges to stop WebKit's phone-number
  detector from auto-linking them as `tel:` before React hydrates, which
  would break hydration. It's a targeted workaround for a Safari/iOS
  behavior, not a general formatting utility.
- `ErrorBoundary` wraps the layout's `children` so one component's error
  doesn't take down the whole page.
- `resolveAvatarUrl()` normalizes avatar URLs: `http(s)` ones are kept as-is
  (a remote photo, e.g. a GitHub avatar), everything else is served from
  `/public`.

## Build and deployment

- `next.config.js` uses `output: 'standalone'` (a minimal, self-contained
  bundle) and sets security/caching headers at the app level.
- `Dockerfile` is multi-stage (`deps` → `build` → `runner`) on
  `node:22-slim` with pnpm via Corepack; the final image only copies the
  standalone output + `public/` + static assets and runs as a non-root
  user. Changing the `output` mode in `next.config.js` means revisiting
  this Dockerfile.
- `@vercel/analytics` is mounted in the layout; it needs no backend of its
  own, just a Vercel-connected project if deployed there.

## Decisions that aren't obvious from a single file

- **Why two text sources (data vs. dict)**: it separates "what a template
  user personalizes" (JSON) from "what's a fixed part of the UI" (dict in
  code), so cloning the repo and editing only the JSON files is enough to
  get your own CV without touching components.
- **Why a 308 redirect and not 307**: it's a permanent URL-architecture
  decision (one URL, one canonical locale via `Accept-Language`), not a
  temporary redirect — it matters for SEO.
- **Why `es` is the default**: it reflects the original content's author;
  changing it is as simple as editing `DEFAULT_LOCALE`, but it isn't an
  accidental detail of the code.

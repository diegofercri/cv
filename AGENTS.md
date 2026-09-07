# AGENTS.md

Guidance for AI agents (Claude Code, Codex, Copilot, etc.) working in this
repo. Humans should start with `README.md`; technical design lives in
`ARCHITECTURE.md`; commit format lives in `CONTRIBUTING.md`.

## What this is

A minimalist, print-friendly CV web app (Next.js App Router) with `es`/`en`
i18n and all content stored in two JSON files. No backend, no database: it's
a static, per-locale app.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- Biome (lint + format, replaces ESLint/Prettier)
- pnpm as the package manager (there's a `pnpm-lock.yaml`; don't use
  npm/yarn)
- Docker (standalone build) for production

## Essential commands

```bash
pnpm install        # install dependencies
pnpm dev            # dev server (http://localhost:3000)
pnpm build          # production build
pnpm check          # lint + format (check only)
pnpm check:fix      # lint + format (autofix) — run before finishing a task
```

`pnpm lint`/`pnpm format` exist separately if you only need one of the two.
The linter only covers `src/**/*` (see `biome.json`).

Before considering any task that touches `src/` done, run `pnpm check:fix`
and `pnpm build`; the build fails if TypeScript doesn't compile.

## Layout (summary, details in ARCHITECTURE.md)

```
src/
├── app/[lang]/       # per-locale routes: layout, page, metadata
├── app/components/   # page section components (header, skills...)
├── components/       # shared components; components/ui/ is shadcn
├── data/{es,en}.json # all CV content, one file per language
├── lib/types.ts      # ResumeData — source of truth for the JSON shape
├── lib/i18n.ts       # locales, UI copy (Dictionary), data resolution
└── proxy.ts          # redirects "/" to the preferred locale (Accept-Language)
```

## Code conventions

- Biome is the source of truth: double quotes, always semicolons, 2-space
  indent, `lineWidth` 80. Don't fight its formatting — run `pnpm format:fix`.
- Filenames must be `kebab-case` (or `PascalCase` for an exceptional case);
  Biome enforces this and fails otherwise.
- Import types with `import type` (`useImportType` rule); don't mix type and
  value imports.
- Avoid `any`, non-null assertions (`!`), and `dangerouslySetInnerHTML`
  except for already-justified cases with a `biome-ignore` comment (see the
  JSON-LD in `page.tsx`).
- Components under `components/ui/` are shadcn/ui primitives: if you need a
  new one, generate it with the shadcn CLI (config/aliases in
  `components.json`) instead of hand-writing it, to keep style consistent.
- Import alias is `@/*` → `src/*` (see `tsconfig.json`).

## CV content (i18n)

- All visible CV text lives in `src/data/es.json` and `src/data/en.json`,
  both shaped by `ResumeData` (`src/lib/types.ts`). If you add a field to
  the type, update **both** JSON files or the build/types will fail.
- UI copy (not CV content) lives in `Dictionary` (`src/lib/i18n.ts`), not in
  the data JSON files.
- `es` is the default locale (`DEFAULT_LOCALE`); `proxy.ts` picks the
  initial language from `Accept-Language`, with no cookies or client JS.
- Don't hardcode text in components: it must come from `resume` (data) or
  `dict` (UI) passed in as props.

## Sensitive spots

- `escapeDateDetection` (`src/lib/utils.ts`) inserts an invisible `⁠`
  character into date ranges to stop Safari/WebKit from detecting them as
  phone numbers and causing a hydration mismatch. Don't remove or "clean up"
  that character if you see it in a diff — it's intentional and documented
  right there.
- `SITE_URL` (`src/lib/i18n.ts`) is used for metadata, sitemap, and JSON-LD;
  change it via `NEXT_PUBLIC_SITE_URL`, don't hardcode it elsewhere.
- `next.config.js` uses `output: 'standalone'`: don't change it without also
  updating the `Dockerfile`, which depends on that output mode.
- `public/img/diegoPicture.webp` is a real photo of the CV's subject: don't
  replace or delete it unless explicitly asked to.
- The `LICENSE` (MIT) keeps the original copyright from Bartosz Jarocki
  (the project's base template) alongside Diego Fernández Criado's: don't
  drop it when touching licensing or headers.

## Commits

This repo follows Conventional Commits and uses `release-please` to version
from commit messages — the exact format, the `type` table, and their
versioning effects are in `CONTRIBUTING.md`. Key points:

- Subject line in English, lowercase, imperative, ≤ 72 chars:
  `type(scope): description`.
- Breaking change: `!` after type/scope + a `BREAKING CHANGE: ...` footer.
- Don't mix different `type`s in one commit; if a diff mixes concerns, split
  it with `git add -p`.
- Commits are signed (`commit.gpgsign = true`, SSH). Don't add
  `--no-gpg-sign` to "fix" a signing failure; if the SSH agent refuses the
  operation, that's an authorization issue, not a config one.

## What to avoid

- Don't introduce ESLint/Prettier or new lint/format config: everything goes
  through Biome.
- Don't swap npm/yarn in for pnpm: the project is pnpm-only.
- Don't add a backend, API routes, or a database "for the CV": content is
  served from static JSON by design.
- Don't commit `.next/` contents or other build artifacts.

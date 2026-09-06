# Minimalist CV

Simple web app that renders a minimalist CV with print-friendly layout.

## Getting started

```bash
git clone https://github.com/diegofercri/cv.git
cd cv
pnpm install
pnpm dev
# open http://localhost:3000 (redirects to /es or /en based on browser language)
# edit src/data/es.json and src/data/en.json to customize
```

## Scripts

```bash
pnpm dev          # start development server
pnpm build        # build for production
pnpm start        # start production server
pnpm lint         # run biome linting checks
pnpm lint:fix     # run biome linting with auto-fix
pnpm format       # check code formatting with biome
pnpm format:fix   # format code with biome
pnpm check        # run both linting and formatting checks
pnpm check:fix    # run both linting and formatting with auto-fix
```

## Project structure

```
src/
├── app/                    # next.js app router
│   ├── [lang]/             # localized routes (es default, en)
│   │   ├── layout.tsx      # root layout with metadata
│   │   ├── page.tsx        # main resume page
│   │   ├── loading.tsx
│   │   └── opengraph-image.tsx
│   ├── components/         # page-level components
│   │   ├── education.tsx
│   │   ├── header.tsx
│   │   ├── projects.tsx
│   │   ├── skills.tsx
│   │   ├── summary.tsx
│   │   └── work-experience.tsx
│   ├── globals.css
│   └── sitemap.ts
├── components/             # shared components
│   ├── icons/              # social icon components
│   ├── ui/                 # shadcn/ui components
│   ├── avatar.tsx
│   ├── command-menu.tsx
│   ├── error-boundary.tsx
│   └── language-switcher.tsx
├── data/                   # resume content, one file per locale
│   ├── en.json
│   └── es.json
├── lib/                    # utilities, types and i18n config
│   ├── i18n.ts
│   ├── structured-data.ts
│   ├── types.ts
│   └── utils.ts
└── proxy.ts                # redirects "/" to the preferred locale
```

## Customization

all resume content lives in two locale files, one per language, matching the `ResumeData` type in `src/lib/types.ts`:

```jsonc
// src/data/en.json (and src/data/es.json)
{
  "name": "Your Name",
  "initials": "YN",
  "location": "Your City, Country",
  "about": "Brief description",
  "summary": "Professional summary",
  "avatarUrl": "img/your-photo.webp",
  "contact": { "email": "you@example.com", "social": [/* ... */] },
  "education": [/* ... */],
  "work": [/* ... */],
  "skills": [/* ... */],
  "projects": [/* ... */]
  // ... see src/lib/types.ts for the full shape
}
```

supported locales and the default one are configured in `src/lib/i18n.ts` (`LOCALES`, `DEFAULT_LOCALE`); `src/proxy.ts` redirects locale-less urls based on the browser's `Accept-Language` header.

styling uses tailwind css — customize colors in `tailwind.config.js` and global styles in `src/app/globals.css`.

## Docker

```bash
docker compose build     # build the container
docker compose up -d     # run the container
docker compose down      # stop the container
```

## License

MIT

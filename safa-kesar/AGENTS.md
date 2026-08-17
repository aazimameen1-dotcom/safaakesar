# Project: Safa Kesar (Kashmiri Saffron & Dry Fruits E-Commerce)

## 📌 Tech Stack
- **Framework:** Next.js 16.3.1 (App Router, Turbopack, Server Actions)
- **UI & Styling:** React 19.2.8, Tailwind CSS v4 (`src/app/globals.css` with `@theme` design tokens)
- **Database:** SQLite via native `node:sqlite` (`DatabaseSync` in `src/lib/db.ts`)
- **Typography:** Fraunces (Headings/Display), Work Sans (Body/UI), Material Symbols Outlined (Icons)
- **Assets:** Google Maps verified photography (`public/google-maps/`) + Concept Screens (`public/screens/`)

## 🛠️ Development & Build Commands
- **Dev Server:** `npm run dev`
- **Production Build:** `npm run build`
- **Dependency Audit:** `npm audit`

## 🎨 Design System & Color Palette
- **Primary / Saffron:** `#A84300` / `#C85300` (Warm Kashmiri Saffron)
- **Accent / Saffron Gold:** `#E5A93C` / `#FFC107`
- **Surface / Background:** `#FFFBF5` / `#F8F2E6` (Warm Parchment / Papyrus)
- **Text / Contrast:** `#2A2118` (Walnut Ink), `#6E6259` (Muted On-Surface)
- **Terracotta & Container:** `#FFDBC8` / `#5C2000`

## 🗄️ Database & Query Patterns
- SQLite connection singleton is located in `src/lib/db.ts`.
- Always normalize rows using `plain<T>()` or `plainOne<T>()` in `src/lib/queries.ts` to strip `null` prototype objects across Server/Client Component boundaries.
- All SQL statements MUST use parameterized placeholders (`?`).
- Prices are stored in **paise** (integers) in the DB and formatted in INR (₹) on the frontend.
- Line totals and order pricing are always calculated on the server side in `createOrder()`.

## 🛡️ Security & Boundary Rules
- **Headers:** HTTP Security Headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options) are configured in `next.config.ts`.
- **Admin Auth:** Signed HMAC tokens stored in `httpOnly`, `sameSite: "lax"`, `secure` cookies with timing-safe comparison (`timingSafeEqual`) and rate-limiting brute-force lockouts.
- **Uploads:** Admin image uploads are restricted to allowlisted MIME types (`image/jpeg`, `png`, `webp`, `avif`, `gif`) and capped at 10MB.
- **Hydration:** Root layout includes `suppressHydrationWarning` on `<html>` and `<body>` to prevent browser extension attribute injection mismatches.

## 📂 Key File Map
- `src/app/(store)/page.tsx` — Homepage featuring `HeroSlider`, Provenance story, and Google Maps photo reels.
- `src/app/(store)/visit/page.tsx` — Physical store locator (NH 44, Pampore) with interactive Google Maps gallery.
- `src/app/(store)/education/page.tsx` — Saffron grading, purity testing guide, and Kashmiri Kahwa brewing.
- `src/components/HeroSlider.tsx` — Crossfade & Ken Burns slow-motion slideshow for high-res hero images.
- `src/components/StorePhotoGallery.tsx` — Filterable store lightbox gallery linked to Google Maps listing.
- `src/lib/queries.ts` — Data access layer for products, variants, orders, and site settings.
- `src/lib/auth.ts` — Admin session token generation, verification, and login rate limiting.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

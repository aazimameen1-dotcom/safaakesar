# Safa Kesar (सफ़ा केसर) 🌾
> Authentic Kashmiri Saffron & Heritage Dry Fruits E-Commerce Storefront

A modern e-commerce web application built for **Safa Kesar**, located on National Highway 44, Lethipora, Pampore, Jammu & Kashmir.

---

## 🌟 Highlights & Features
- **Authentic Google Maps Assets:** High-resolution verified photography directly from the Pampore showroom and saffron harvest fields.
- **Hero Image Transitions:** Smooth auto-advancing slideshow with crossfades and location badges.
- **Dynamic Saffron Catalog:** Pure Kashmiri Mongra saffron, walnuts, almonds, mamra badam, shilajit, and saffron honey.
- **Interactive Lightbox Gallery:** Categorized store tour and harvest reels.
- **SQLite Database Architecture:** Native `node:sqlite` DatabaseSync with seed migrations and server-calculated order pricing.
- **Security Hardened:** Global CSP security headers, brute-force rate-limited admin authentication, timing-safe cryptographic comparisons, and strict file upload validation.
- **SEO & Performance:** Next.js 16 App Router with Turbopack and React 19.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (recommended Node 22+)
- npm

### Installation & Run

```bash
# Navigate to the app directory
cd safa-kesar

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 16.3.1 (App Router, Turbopack, Server Actions)
- **UI & Styling:** React 19.2.8, Tailwind CSS v4
- **Database:** SQLite via native `node:sqlite`
- **Typography:** Fraunces, Work Sans, Material Symbols Outlined
- **Security:** Node Crypto (scrypt, HMAC-SHA256, timingSafeEqual)

---

## 📂 Repository Structure

```
.
├── safa-kesar/              # Next.js 16 Production Web Application
│   ├── src/
│   │   ├── app/             # App Router (Pages, Admin, API Routes)
│   │   ├── components/      # React UI Components (HeroSlider, CartDrawer, Gallery)
│   │   └── lib/             # SQLite Data Access, Auth, Security, Formatting
│   ├── public/              # High-Res Google Maps Photography & Media
│   └── package.json         # Web App Dependencies & Scripts
├── design-concepts/         # UI Screen Concept Mockups & Stitch Framework
├── .agents/                 # Developer Workflows, Rules & Skills
├── Dockerfile               # Multi-Stage Production Container Specification
├── render.yaml              # Render 1-Click Deployment Blueprint
└── README.md                # Project Overview & Setup Instructions
```

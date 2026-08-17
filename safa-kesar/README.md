# Safa Kesar — E-Commerce Website + Admin Panel

A full e-commerce store for **Safa Kesar**, the premium Kashmiri saffron brand from the Stitch designs — storefront, cart, checkout, and a complete admin panel, all in one app.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS** and **Node's built-in SQLite** (`node:sqlite`) — no separate database server to install.

## Running the site

```bash
cd safa-kesar
npm install     # first time only
npm run dev     # start at http://localhost:3000
```

The SQLite database (`data/app.db`) is created and seeded automatically on first run with all 6 products from the designs, store settings, and the admin password.

For production: `npm run build && npm start`.

## Admin panel

- **URL:** http://localhost:3000/admin
- **Default password:** `admin123` — change it in **Admin → Settings → Admin Password** after your first sign-in.

The panel includes:

| Section | What you can do |
|---|---|
| **Dashboard** | Revenue, order counts, average order value, top products, recent orders |
| **Products** | Add / edit / delete products — name, category, description, main image plus a multi-photo product gallery (URL or file upload per image), per-weight pricing, batch & lab data, per-product COD on/off, show/hide from the store |
| **Orders** | View every order with items and customer details, filter by status, update status (pending → confirmed → shipped → delivered / cancelled), WhatsApp the customer |
| **Settings** | Harvest banner text, WhatsApp number, shipping fee & free-shipping threshold, Cash on Delivery on/off, store contact info, admin password |

## Storefront

| Page | Route |
|---|---|
| Home (hero, provenance, offerings bento) | `/` |
| Shop — the catalog, category nav, live weight pricing | `/shop` |
| Product detail — gallery, batch verification, lab results | `/product/signature-mongra-saffron` (and every product) |
| Education — how to identify real saffron | `/education` |
| Visit Us — store info + live Google Map | `/visit` |
| Checkout (guest, Cash on Delivery or demo online payment) | `/checkout` |
| Order confirmation with WhatsApp share | `/order/SK-1001` |

The cart is a slide-out drawer (as designed) with quantity steppers, a free-shipping progress bar (free over ₹2,000), and it persists in the browser via localStorage.

## How it works

- **Prices are stored in paise** (integer) and always **recomputed server-side** at checkout — client-side price tampering has no effect.
- **Checkout payment** is intentionally demo: Cash on Delivery, or a simulated "Pay Online". A real gateway (Razorpay/Stripe) can be wired into `src/lib/queries.ts → createOrder` later.
- **Content is database-driven**: the shop, product pages, banner text, WhatsApp number, and shipping rules all read from SQLite, so the admin panel changes are reflected on the storefront immediately.
- **Images**: the Stitch design images were downloaded into `public/images/` so the site doesn't depend on Google's expiring CDN links. Product image uploads are stored in `public/uploads/`.

## Project layout

```
src/
├── app/
│   ├── (store)/          # storefront pages + shared layout (header/footer/cart)
│   │   ├── page.tsx      # Home
│   │   ├── shop/         # catalog
│   │   ├── product/[slug]/
│   │   ├── checkout/
│   │   ├── order/[orderNumber]/
│   │   ├── education/
│   │   └── visit/
│   ├── admin/
│   │   ├── login/        # standalone login page
│   │   ├── actions.ts    # all admin server actions
│   │   └── (panel)/      # guarded panel: dashboard, products, orders, settings
│   └── api/orders/       # order creation endpoint (validates prices server-side)
├── components/           # Header, Footer, CartDrawer, ProductPurchase, gallery…
└── lib/                  # db (schema + seed), queries, auth, money formatting
data/app.db               # SQLite database (auto-created, gitignored)
public/images/            # design imagery
public/uploads/           # admin image uploads (gitignored)
```

## Notes

- To reset the store to its seeded state, stop the server and delete `data/app.db` — it will be recreated on the next start.
- Orders appear in the admin panel instantly; use the status dropdown on an order to move it through fulfilment.

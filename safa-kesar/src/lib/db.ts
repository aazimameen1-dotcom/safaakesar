import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { hashPassword } from "./password";

const DATA_DIR = path.join(process.cwd(), "data");

declare global {
  // eslint-disable-next-line no-var
  var __skDb: DatabaseSync | undefined;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('saffron', 'dry-fruits', 'wellness')),
  short_desc TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  images TEXT DEFAULT '[]',
  badge TEXT DEFAULT '',
  rating REAL DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 0,
  batch_no TEXT DEFAULT '',
  harvest_date TEXT DEFAULT '',
  crocin TEXT DEFAULT '',
  safranal TEXT DEFAULT '',
  picrocrocin TEXT DEFAULT '',
  origin TEXT DEFAULT '',
  cod_enabled INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS product_variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  price INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  notes TEXT DEFAULT '',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'online')),
  payment_status TEXT DEFAULT 'pending',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  subtotal INTEGER NOT NULL,
  shipping INTEGER NOT NULL,
  total INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER,
  product_name TEXT NOT NULL,
  variant_label TEXT NOT NULL,
  unit_price INTEGER NOT NULL,
  qty INTEGER NOT NULL,
  line_total INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

export type ProductRow = {
  id: number;
  slug: string;
  name: string;
  category: "saffron" | "dry-fruits" | "wellness";
  short_desc: string;
  description: string;
  image: string;
  /** JSON array of additional gallery images shown on the product page */
  images: string;
  badge: string;
  rating: number;
  reviews_count: number;
  batch_no: string;
  harvest_date: string;
  crocin: string;
  safranal: string;
  picrocrocin: string;
  origin: string;
  /** per-product Cash on Delivery switch; order-level COD requires every item on */
  cod_enabled: number;
  sort_order: number;
  active: number;
  created_at: string;
};

export type VariantRow = {
  id: number;
  product_id: number;
  label: string;
  price: number;
  sort_order: number;
};

const DEFAULT_SETTINGS: Record<string, string> = {
  harvest_banner:
    "Fresh October Harvest Available Now — Directly from Lethipora",
  whatsapp_number: "919797756756",
  whatsapp_label: "WhatsApp Aadil",
  free_shipping_threshold: "200000", // paise (₹2,000)
  flat_shipping: "9000", // paise (₹90)
  store_address: "NH 44, Lethipora, Pampore, Jammu and Kashmir 192122",
  store_phone: "+91 97977 56756",
  store_email: "info@safakesar.com",
  cod_enabled: "1",
};

type SeedProduct = {
  slug: string;
  name: string;
  category: "saffron" | "dry-fruits" | "wellness";
  short_desc: string;
  description: string;
  image: string;
  gallery?: string[];
  badge?: string;
  rating?: number;
  reviews_count?: number;
  batch_no?: string;
  harvest_date?: string;
  crocin?: string;
  safranal?: string;
  picrocrocin?: string;
  origin?: string;
  variants: [label: string, rupees: number][];
};

const SEED_PRODUCTS: SeedProduct[] = [
  {
    slug: "signature-mongra-saffron",
    name: "Signature Mongra Saffron",
    category: "saffron",
    short_desc:
      "The highest grade of Kashmiri Kesar — only the deep red stigmas, tested for Crocin levels above 240.",
    description:
      "Our signature Mongra consists exclusively of the deep crimson stigma tips hand-picked from crocus flowers grown on the karewa highlands of Lethipora, Pampore. Every thread is dried the same week it is harvested, sealed in tamper-evident glass jars, and shipped in light-blocking packaging to protect the volatile aromatics. No styles, no fillers, no dyes — ever.",
    image: "/google-maps/safa-kesar-map-04.jpg",
    gallery: [
      "/google-maps/safa-kesar-map-04.jpg",
      "/google-maps/safa-kesar-map-02.jpg",
      "/google-maps/safa-kesar-map-03.jpg",
      "/google-maps/safa-kesar-map-11.jpg",
      "/google-maps/safa-kesar-map-12.jpg",
      "/google-maps/safa-kesar-map-21.jpg",
      "/images/pdp-main.jpg",
      "/images/pdp-tweezers.jpg",
    ],
    badge: "Batch Verified",
    rating: 4.8,
    reviews_count: 124,
    batch_no: "882",
    harvest_date: "Oct 2023",
    crocin: "246",
    safranal: "42",
    picrocrocin: "95",
    origin: "Pampore, Kashmir (34.02° N)",
    variants: [
      ["0.5g", 300],
      ["1g", 550],
      ["5g", 2650],
      ["10g", 5100],
      ["25g", 12250],
    ],
  },
  {
    slug: "kashmiri-walnuts-giri",
    name: "Kashmiri Walnuts (Giri)",
    category: "dry-fruits",
    short_desc:
      "Premium quality kernels, known for their high oil content and distinct flavor.",
    description:
      "Sun-dried walnut kernels from old-orchard trees of the Kashmir Valley. High oil content, thin skin, and a clean, buttery finish — excellent for direct consumption or cooking.",
    image: "/google-maps/safa-kesar-map-05.jpg",
    gallery: [
      "/google-maps/safa-kesar-map-05.jpg",
      "/google-maps/safa-kesar-map-22.jpg",
      "/images/walnuts.jpg",
    ],
    rating: 4.7,
    reviews_count: 58,
    variants: [["500g", 850]],
  },
  {
    slug: "mamra-almonds",
    name: "Mamra Almonds",
    category: "dry-fruits",
    short_desc:
      "Rare, nutrient-dense almonds sourced from select orchards.",
    description:
      "Mamra almonds are grown in small, select orchards and harvested in limited quantities. Dense in oils and nutrients, with an intense natural sweetness compared to commercial varieties.",
    image: "/google-maps/safa-kesar-map-10.jpg",
    gallery: [
      "/google-maps/safa-kesar-map-10.jpg",
      "/google-maps/safa-kesar-map-05.jpg",
      "/images/mamra-almonds.jpg",
    ],
    rating: 4.9,
    reviews_count: 41,
    variants: [["250g", 1200]],
  },
  {
    slug: "premium-pecans",
    name: "Premium Pecans",
    category: "dry-fruits",
    short_desc:
      "Rich, buttery pecans perfect for culinary or direct consumption.",
    description:
      "Large, uniformly graded pecan halves with a rich, buttery profile. Cracked and packed the week they arrive from the grower.",
    image: "/images/pecans.jpg",
    gallery: [
      "/images/pecans.jpg",
      "/google-maps/safa-kesar-map-22.jpg",
    ],
    rating: 4.6,
    reviews_count: 29,
    variants: [["250g", 950]],
  },
  {
    slug: "pure-rose-water-arqe-gulab",
    name: "Pure Rose Water (Arqe Gulab)",
    category: "wellness",
    short_desc:
      "Distilled from native Kashmiri roses. Zero additives.",
    description:
      "Traditional hydro-distillation of native Kashmiri damask roses, bottled with nothing added. Use in cooking, skincare, or traditional preparations.",
    image: "/images/rose-water.jpg",
    gallery: [
      "/images/rose-water.jpg",
      "/google-maps/safa-kesar-map-13.jpg",
    ],
    rating: 4.8,
    reviews_count: 34,
    variants: [["100 ml", 350]],
  },
  {
    slug: "himalayan-shilajit-resin",
    name: "Himalayan Shilajit Resin",
    category: "wellness",
    short_desc:
      "Purified resin sourced from high-altitude rock exudates.",
    description:
      "Raw shilajit collected from high-altitude rock exudates in the Himalaya, then purified using traditional water filtration. Lab tested for heavy metals before packing.",
    image: "/images/shilajit.jpg",
    gallery: [
      "/images/shilajit.jpg",
      "/google-maps/safa-kesar-map-13.jpg",
    ],
    rating: 4.7,
    reviews_count: 22,
    variants: [["10 g", 1800]],
  },
];

function seed(db: DatabaseSync) {
  const productCount = db
    .prepare("SELECT COUNT(*) AS n FROM products")
    .get() as { n: number };

  if (productCount.n === 0) {
    const insertProduct = db.prepare(`INSERT INTO products
      (slug, name, category, short_desc, description, image, images, badge, rating, reviews_count,
       batch_no, harvest_date, crocin, safranal, picrocrocin, origin, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const insertVariant = db.prepare(
      "INSERT INTO product_variants (product_id, label, price, sort_order) VALUES (?, ?, ?, ?)"
    );
    SEED_PRODUCTS.forEach((p, i) => {
      const r = insertProduct.run(
        p.slug,
        p.name,
        p.category,
        p.short_desc,
        p.description,
        p.image,
        JSON.stringify(p.gallery ?? []),
        p.badge ?? "",
        p.rating ?? 4.8,
        p.reviews_count ?? 0,
        p.batch_no ?? "",
        p.harvest_date ?? "",
        p.crocin ?? "",
        p.safranal ?? "",
        p.picrocrocin ?? "",
        p.origin ?? "",
        i
      );
      p.variants.forEach(([label, rupees], j) =>
        insertVariant.run(Number(r.lastInsertRowid), label, rupees * 100, j)
      );
    });
  }

  const settingKeys = Object.keys(DEFAULT_SETTINGS);
  const placeholders = settingKeys.map(() => "?").join(",");
  db.prepare(
    `INSERT OR IGNORE INTO settings (key, value) VALUES ${settingKeys
      .map(() => "(?, ?)")
      .join(",")}`
  ).run(...settingKeys.flatMap((k) => [k, DEFAULT_SETTINGS[k]]));

  db.prepare(
    "INSERT OR IGNORE INTO settings (key, value) VALUES ('admin_password_hash', ?)"
  ).run(hashPassword("admin123"));
  db.prepare(
    "INSERT OR IGNORE INTO settings (key, value) VALUES ('session_secret', ?)"
  ).run(crypto.randomUUID().replaceAll("-", "") + crypto.randomUUID().replaceAll("-", ""));
}

// Adds columns introduced after the first release to existing databases.
function migrate(db: DatabaseSync) {
  const cols = db.prepare("PRAGMA table_info(products)").all() as {
    name: string;
  }[];
  if (!cols.some((c) => c.name === "images")) {
    db.exec("ALTER TABLE products ADD COLUMN images TEXT DEFAULT '[]'");
  }
  if (!cols.some((c) => c.name === "cod_enabled")) {
    db.exec("ALTER TABLE products ADD COLUMN cod_enabled INTEGER DEFAULT 1");
  }

  // Update existing products with enriched Google Maps imagery
  SEED_PRODUCTS.forEach((p) => {
    db.prepare("UPDATE products SET image = ?, images = ? WHERE slug = ?").run(
      p.image,
      JSON.stringify(p.gallery ?? []),
      p.slug
    );
  });
}

export function getDb(): DatabaseSync {
  if (!global.__skDb) {
    mkdirSync(DATA_DIR, { recursive: true });
    const db = new DatabaseSync(path.join(DATA_DIR, "app.db"));
    db.exec(SCHEMA);
    migrate(db);
    seed(db);
    global.__skDb = db;
  }
  return global.__skDb;
}

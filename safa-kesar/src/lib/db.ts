import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { hashPassword } from "./password";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");

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
  stock INTEGER DEFAULT 100,
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
  coupon_code TEXT DEFAULT '',
  discount_amount INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  tracking_number TEXT DEFAULT '',
  tracking_carrier TEXT DEFAULT 'Delhivery',
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

CREATE TABLE IF NOT EXISTS coupons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'flat')),
  discount_value INTEGER NOT NULL,
  min_order_amount INTEGER DEFAULT 0,
  max_discount INTEGER DEFAULT 0,
  usage_limit INTEGER DEFAULT 0,
  times_used INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'showroom',
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  source TEXT DEFAULT 'google_maps',
  verified INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
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
  stock: number;
  sort_order: number;
};

export type OrderRow = {
  id: number;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
  payment_method: "cod" | "online";
  payment_status: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  shipping: number;
  coupon_code: string;
  discount_amount: number;
  total: number;
  tracking_number: string;
  tracking_carrier: string;
  created_at: string;
};

export type CouponRow = {
  id: number;
  code: string;
  discount_type: "percent" | "flat";
  discount_value: number; // percent or paise
  min_order_amount: number; // paise
  max_discount: number; // paise
  usage_limit: number;
  times_used: number;
  active: number;
  created_at: string;
};

export type GalleryImageRow = {
  id: number;
  url: string;
  title: string;
  category: "showroom" | "harvest" | "packaging" | "tea-lounge";
  sort_order: number;
  created_at: string;
};

export type ReviewRow = {
  id: number;
  product_id: number | null;
  author_name: string;
  rating: number;
  comment: string;
  source: "website" | "google_maps";
  verified: number;
  featured: number;
  created_at: string;
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
  variants: [label: string, rupees: number, stock?: number][];
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
    rating: 4.9,
    reviews_count: 124,
    batch_no: "882",
    harvest_date: "Oct 2023",
    crocin: "246",
    safranal: "42",
    picrocrocin: "95",
    origin: "Pampore, Kashmir (34.02° N)",
    variants: [
      ["0.5g", 300, 150],
      ["1g", 550, 200],
      ["5g", 2650, 80],
      ["10g", 5100, 45],
      ["25g", 12250, 20],
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
    badge: "Cold-Pressed Grade",
    rating: 4.8,
    reviews_count: 86,
    batch_no: "W-412",
    harvest_date: "Nov 2023",
    origin: "Anantnag Orchards, Kashmir",
    variants: [
      ["250g", 420, 100],
      ["500g", 800, 120],
      ["1kg", 1550, 60],
    ],
  },
  {
    slug: "kashmiri-mamra-almonds",
    name: "Kashmiri Mamra Badam",
    category: "dry-fruits",
    short_desc:
      "Concave shape, intensely sweet kernel with the highest natural oil content of any almond variety.",
    description:
      "Genuine Kashmiri Mamra almonds grown in high-altitude orchards. Unlike California imports, Kashmiri Mamra contains up to 50% natural oil, offering a richer flavor and concentrated nutrient profile.",
    image: "/google-maps/safa-kesar-map-06.jpg",
    gallery: [
      "/google-maps/safa-kesar-map-06.jpg",
      "/images/mamra-almonds.jpg",
    ],
    badge: "High-Oil Variety",
    rating: 4.9,
    reviews_count: 73,
    batch_no: "MB-108",
    harvest_date: "Sep 2023",
    origin: "Pulwama, Kashmir",
    variants: [
      ["250g", 750, 90],
      ["500g", 1450, 80],
      ["1kg", 2800, 50],
    ],
  },
  {
    slug: "pure-shilajit-resin",
    name: "Pure Himalayan Shilajit Resin",
    category: "wellness",
    short_desc:
      "Purified Himalayan Shilajit resin, rich in fulvic acid and trace minerals.",
    description:
      "Raw Shilajit harvested from high-altitude rock faces in the Himalayas, purified using traditional Ayurvedic water-filtration methods. Tested for heavy metals with over 75% fulvic acid content.",
    image: "/google-maps/safa-kesar-map-12.jpg",
    gallery: [
      "/google-maps/safa-kesar-map-12.jpg",
      "/images/shilajit.jpg",
    ],
    badge: "75% Fulvic Acid",
    rating: 4.9,
    reviews_count: 94,
    batch_no: "SH-99",
    origin: "High Himalayan Ridge (18,000 ft)",
    variants: [
      ["20g", 1200, 100],
      ["50g", 2700, 60],
    ],
  },
  {
    slug: "saffron-infused-acacia-honey",
    name: "Saffron Acacia Honey",
    category: "wellness",
    short_desc:
      "Raw mono-floral Acacia honey infused with genuine Mongra saffron strands.",
    description:
      "Wild acacia honey from Kashmir forest apiaries, steeped with our own hand-harvested Mongra saffron threads. Naturally non-crystallizing with a delicate floral warmth.",
    image: "/google-maps/safa-kesar-map-11.jpg",
    gallery: [
      "/google-maps/safa-kesar-map-11.jpg",
      "/images/cart-jar.jpg",
    ],
    badge: "Raw & Unfiltered",
    rating: 4.8,
    reviews_count: 51,
    origin: "Kashmir Valley Apiaries",
    variants: [
      ["250g", 650, 80],
      ["500g", 1200, 50],
    ],
  },
];

function seed(db: DatabaseSync) {
  const count = Number(
    (db.prepare("SELECT COUNT(*) as c FROM products").get() as { c: number }).c
  );
  if (count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (
        slug, name, category, short_desc, description, image, images,
        badge, rating, reviews_count, batch_no, harvest_date,
        crocin, safranal, picrocrocin, origin, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertVariant = db.prepare(`
      INSERT INTO product_variants (product_id, label, price, stock, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `);

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
      p.variants.forEach(([label, rupees, stock], j) =>
        insertVariant.run(Number(r.lastInsertRowid), label, rupees * 100, stock ?? 100, j)
      );
    });
  }

  // Seed default coupons
  db.prepare(`
    INSERT OR IGNORE INTO coupons (code, discount_type, discount_value, min_order_amount, active)
    VALUES ('HARVEST10', 'percent', 10, 150000, 1)
  `).run();
  db.prepare(`
    INSERT OR IGNORE INTO coupons (code, discount_type, discount_value, min_order_amount, active)
    VALUES ('WELCOME200', 'flat', 20000, 200000, 1)
  `).run();

  // Seed sample reviews
  const reviewCount = Number(
    (db.prepare("SELECT COUNT(*) as c FROM reviews").get() as { c: number }).c
  );
  if (reviewCount === 0) {
    const insertReview = db.prepare(`
      INSERT INTO reviews (author_name, rating, comment, source, verified, featured)
      VALUES (?, ?, ?, ?, 1, ?)
    `);
    insertReview.run("Dr. Rajesh Sharma, Delhi", 5, "The saffron quality is unmatched. Cold water test confirmed genuine Mongra with incredible aroma and coloring strength.", "google_maps", 1);
    insertReview.run("Priya Deshmukh, Mumbai", 5, "Visited their NH 44 showroom during our Kashmir trip. Aadil was extremely helpful. Walnuts and Shilajit are top notch!", "google_maps", 1);
    insertReview.run("Vikram Malhotra, Bangalore", 5, "Fast shipping and packaging in sealed glass jars ensures fresh aromatics. Real batch verification numbers on jar.", "website", 1);
  }

  const settingKeys = Object.keys(DEFAULT_SETTINGS);
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

function migrate(db: DatabaseSync) {
  // Check products table
  const prodCols = db.prepare("PRAGMA table_info(products)").all() as { name: string }[];
  if (!prodCols.some((c) => c.name === "images")) {
    db.exec("ALTER TABLE products ADD COLUMN images TEXT DEFAULT '[]'");
  }
  if (!prodCols.some((c) => c.name === "cod_enabled")) {
    db.exec("ALTER TABLE products ADD COLUMN cod_enabled INTEGER DEFAULT 1");
  }

  // Check product_variants table
  const varCols = db.prepare("PRAGMA table_info(product_variants)").all() as { name: string }[];
  if (!varCols.some((c) => c.name === "stock")) {
    db.exec("ALTER TABLE product_variants ADD COLUMN stock INTEGER DEFAULT 100");
  }

  // Check orders table
  const orderCols = db.prepare("PRAGMA table_info(orders)").all() as { name: string }[];
  if (!orderCols.some((c) => c.name === "coupon_code")) {
    db.exec("ALTER TABLE orders ADD COLUMN coupon_code TEXT DEFAULT ''");
  }
  if (!orderCols.some((c) => c.name === "discount_amount")) {
    db.exec("ALTER TABLE orders ADD COLUMN discount_amount INTEGER DEFAULT 0");
  }
  if (!orderCols.some((c) => c.name === "tracking_number")) {
    db.exec("ALTER TABLE orders ADD COLUMN tracking_number TEXT DEFAULT ''");
  }
  if (!orderCols.some((c) => c.name === "tracking_carrier")) {
    db.exec("ALTER TABLE orders ADD COLUMN tracking_carrier TEXT DEFAULT 'Delhivery'");
  }
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

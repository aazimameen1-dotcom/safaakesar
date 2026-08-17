import { getDb, type ProductRow, type VariantRow } from "./db";

// node:sqlite returns null-prototype rows, which React can't serialize
// across the server→client boundary — normalize to plain objects.
function plain<T>(rows: unknown[]): T[] {
  return rows.map((r) => ({ ...(r as object) })) as T[];
}

function plainOne<T>(row: unknown): T | undefined {
  return row === undefined ? undefined : ({ ...(row as object) } as T);
}

/** Product-page gallery: additional images if set, otherwise the main image. */
export function getProductImages(product: ProductRow): string[] {
  try {
    const arr = JSON.parse(product.images || "[]");
    if (Array.isArray(arr)) {
      const urls = arr.filter(
        (x): x is string => typeof x === "string" && x.trim() !== ""
      );
      if (urls.length > 0) return urls;
    }
  } catch {
    // malformed JSON — fall through to main image
  }
  return product.image ? [product.image] : [];
}

export type ProductWithVariants = ProductRow & { variants: VariantRow[] };

export type SiteSettings = {
  harvest_banner: string;
  whatsapp_number: string;
  whatsapp_label: string;
  free_shipping_threshold: number; // paise
  flat_shipping: number; // paise
  store_address: string;
  store_phone: string;
  store_email: string;
  cod_enabled: boolean;
};

export function getSettings(): SiteSettings {
  const db = getDb();
  const rows = db.prepare("SELECT key, value FROM settings").all() as {
    key: string;
    value: string;
  }[];
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    harvest_banner: map.harvest_banner ?? "",
    whatsapp_number: map.whatsapp_number ?? "",
    whatsapp_label: map.whatsapp_label ?? "WhatsApp",
    free_shipping_threshold: Number(map.free_shipping_threshold ?? 200000),
    flat_shipping: Number(map.flat_shipping ?? 9000),
    store_address: map.store_address ?? "",
    store_phone: map.store_phone ?? "",
    store_email: map.store_email ?? "",
    cod_enabled: (map.cod_enabled ?? "1") === "1",
  };
}

function attachVariants(products: ProductRow[]): ProductWithVariants[] {
  if (products.length === 0) return [];
  const db = getDb();
  const variants = plain<VariantRow>(
    db
      .prepare(
        "SELECT * FROM product_variants WHERE product_id IN (" +
          products.map(() => "?").join(",") +
          ") ORDER BY sort_order, id"
      )
      .all(...products.map((p) => p.id))
  );
  const byProduct = new Map<number, VariantRow[]>();
  for (const v of variants) {
    const list = byProduct.get(v.product_id) ?? [];
    list.push(v);
    byProduct.set(v.product_id, list);
  }
  return products.map((p) => ({ ...p, variants: byProduct.get(p.id) ?? [] }));
}

export function getActiveProducts(): ProductWithVariants[] {
  const rows = plain<ProductRow>(
    getDb()
      .prepare("SELECT * FROM products WHERE active = 1 ORDER BY sort_order, id")
      .all()
  );
  return attachVariants(rows);
}

export function getAllProducts(): ProductWithVariants[] {
  const rows = plain<ProductRow>(
    getDb()
      .prepare("SELECT * FROM products ORDER BY sort_order, id")
      .all()
  );
  return attachVariants(rows);
}

export function getProductBySlug(slug: string): ProductWithVariants | null {
  const row = plainOne<ProductRow>(
    getDb().prepare("SELECT * FROM products WHERE slug = ?").get(slug)
  );
  return row ? attachVariants([row])[0] : null;
}

export function getProductById(id: number): ProductWithVariants | null {
  const row = plainOne<ProductRow>(
    getDb().prepare("SELECT * FROM products WHERE id = ?").get(id)
  );
  return row ? attachVariants([row])[0] : null;
}

/* ── Orders ────────────────────────────────────────────────────────── */

export type NewOrderItem = {
  productId: number;
  variantLabel: string;
  qty: number;
};

export type NewOrderCustomer = {
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
  payment_method: "cod" | "online";
};

export class OrderError extends Error {}

export function createOrder(
  items: NewOrderItem[],
  customer: NewOrderCustomer
): { orderNumber: string } {
  if (!items.length) throw new OrderError("Cart is empty");
  const db = getDb();
  const settings = getSettings();

  // Prices are always recomputed from the database — never trusted from the client.
  const lines: {
    productId: number;
    name: string;
    variantLabel: string;
    unitPrice: number;
    qty: number;
    codEnabled: boolean;
  }[] = [];
  for (const item of items) {
    const qty = Math.floor(Number(item.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > 99)
      throw new OrderError(`Invalid quantity for an item`);
    const product = db
      .prepare("SELECT * FROM products WHERE id = ? AND active = 1")
      .get(item.productId) as ProductRow | undefined;
    if (!product) throw new OrderError("A product in your cart is unavailable");
    const variant = (
      db
        .prepare("SELECT * FROM product_variants WHERE product_id = ?")
        .all(item.productId) as VariantRow[]
    ).find((v) => v.label === item.variantLabel);
    if (!variant) throw new OrderError(`No variant ${item.variantLabel} for ${product.name}`);
    lines.push({
      productId: product.id,
      name: product.name,
      variantLabel: variant.label,
      unitPrice: variant.price,
      qty,
      codEnabled: product.cod_enabled === 1,
    });
  }

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const shipping =
    subtotal >= settings.free_shipping_threshold ? 0 : settings.flat_shipping;
  const total = subtotal + shipping;

  const required: [keyof NewOrderCustomer, string][] = [
    ["customer_name", "Name"],
    ["phone", "Phone"],
    ["address", "Address"],
    ["city", "City"],
    ["state", "State"],
    ["pincode", "PIN code"],
  ];
  for (const [field, label] of required) {
    if (!String(customer[field] ?? "").trim())
      throw new OrderError(`${label} is required`);
  }

  const name = String(customer.customer_name ?? "").trim().slice(0, 100);
  const rawPhone = String(customer.phone ?? "").replace(/\D/g, "");
  if (rawPhone.length < 10)
    throw new OrderError("Enter a valid 10-digit phone number");
  const phone = rawPhone.slice(-10);

  const rawPincode = String(customer.pincode ?? "").replace(/\D/g, "");
  if (!/^\d{6}$/.test(rawPincode))
    throw new OrderError("Enter a valid 6-digit PIN code");
  const pincode = rawPincode;

  const email = String(customer.email ?? "").trim().slice(0, 150);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new OrderError("Enter a valid email address");
  }

  const address = String(customer.address ?? "").trim().slice(0, 300);
  const city = String(customer.city ?? "").trim().slice(0, 100);
  const state = String(customer.state ?? "").trim().slice(0, 100);
  const notes = String(customer.notes ?? "").trim().slice(0, 500);

  if (customer.payment_method !== "cod" && customer.payment_method !== "online")
    throw new OrderError("Invalid payment method");
  if (customer.payment_method === "cod" && !settings.cod_enabled)
    throw new OrderError("Cash on Delivery is currently unavailable");
  if (customer.payment_method === "cod" && lines.some((l) => !l.codEnabled))
    throw new OrderError(
      "Cash on Delivery is not available for some items in your cart"
    );

  const insertOrder = db.prepare(`INSERT INTO orders
    (order_number, customer_name, phone, email, address, city, state, pincode, notes,
     payment_method, payment_status, status, subtotal, shipping, total)
    VALUES ('PENDING', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`);
  const result = insertOrder.run(
    name,
    phone,
    email,
    address,
    city,
    state,
    pincode,
    notes,
    customer.payment_method,
    customer.payment_method === "online" ? "paid-demo" : "pending",
    subtotal,
    shipping,
    total
  );
  const orderId = Number(result.lastInsertRowid);
  const orderNumber = `SK-${1000 + orderId}`;
  db.prepare("UPDATE orders SET order_number = ? WHERE id = ?").run(
    orderNumber,
    orderId
  );

  const insertItem = db.prepare(`INSERT INTO order_items
    (order_id, product_id, product_name, variant_label, unit_price, qty, line_total)
    VALUES (?, ?, ?, ?, ?, ?, ?)`);
  for (const l of lines) {
    insertItem.run(
      orderId,
      l.productId,
      l.name,
      l.variantLabel,
      l.unitPrice,
      l.qty,
      l.unitPrice * l.qty
    );
  }
  return { orderNumber };
}

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
  payment_method: string;
  payment_status: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  created_at: string;
};

export type OrderItemRow = {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  variant_label: string;
  unit_price: number;
  qty: number;
  line_total: number;
};

export function getOrders(status?: string): (OrderRow & { item_count: number })[] {
  const db = getDb();
  const orders = plain<OrderRow>(
    status && status !== "all"
      ? db.prepare("SELECT * FROM orders WHERE status = ? ORDER BY id DESC").all(status)
      : db.prepare("SELECT * FROM orders ORDER BY id DESC").all()
  );
  const counts = Object.fromEntries(
    plain<{ order_id: number; n: number }>(
      db
        .prepare("SELECT order_id, COUNT(*) AS n FROM order_items GROUP BY order_id")
        .all()
    ).map((r) => [r.order_id, r.n])
  );
  return orders.map((o) => ({ ...o, item_count: counts[o.id] ?? 0 }));
}

export function getOrder(
  orderNumber: string
): (OrderRow & { items: OrderItemRow[] }) | null {
  const db = getDb();
  const order = plainOne<OrderRow>(
    db.prepare("SELECT * FROM orders WHERE order_number = ?").get(orderNumber)
  );
  if (!order) return null;
  const items = plain<OrderItemRow>(
    db.prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY id").all(order.id)
  );
  return { ...order, items };
}

export function getOrderById(
  id: number
): (OrderRow & { items: OrderItemRow[] }) | null {
  const db = getDb();
  const order = plainOne<OrderRow>(
    db.prepare("SELECT * FROM orders WHERE id = ?").get(id)
  );
  if (!order) return null;
  const items = plain<OrderItemRow>(
    db.prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY id").all(order.id)
  );
  return { ...order, items };
}

export function updateOrderStatus(id: number, status: string) {
  const allowed = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) throw new OrderError("Invalid status");
  getDb().prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
}

/* ── Dashboard stats ───────────────────────────────────────────────── */

export function getDashboardStats() {
  const db = getDb();
  const revenue = (
    db
      .prepare(
        "SELECT COALESCE(SUM(total), 0) AS v FROM orders WHERE status != 'cancelled'"
      )
      .get() as { v: number }
  ).v;
  const orderCount = (
    db.prepare("SELECT COUNT(*) AS n FROM orders").get() as { n: number }
  ).n;
  const pending = (
    db
      .prepare("SELECT COUNT(*) AS n FROM orders WHERE status = 'pending'")
      .get() as { n: number }
  ).n;
  const productCount = (
    db
      .prepare("SELECT COUNT(*) AS n FROM products WHERE active = 1")
      .get() as { n: number }
  ).n;
  const avg = orderCount > 0 ? Math.round(revenue / orderCount) : 0;
  const topProducts = db
    .prepare(`SELECT product_name, SUM(qty) AS qty, SUM(line_total) AS revenue
              FROM order_items GROUP BY product_name ORDER BY qty DESC LIMIT 5`)
    .all() as { product_name: string; qty: number; revenue: number }[];
  const statusCounts = Object.fromEntries(
    (
      db
        .prepare("SELECT status, COUNT(*) AS n FROM orders GROUP BY status")
        .all() as { status: string; n: number }[]
    ).map((r) => [r.status, r.n])
  );
  return { revenue, orderCount, pending, productCount, avg, topProducts, statusCounts };
}

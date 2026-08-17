import {
  getDb,
  type ProductRow,
  type VariantRow,
  type OrderRow,
  type CouponRow,
  type GalleryImageRow,
  type ReviewRow,
} from "./db";

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
  if (!row) return null;
  const variants = plain<VariantRow>(
    getDb()
      .prepare("SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order, id")
      .all(row.id)
  );
  return { ...row, variants };
}

export function getProductById(id: number): ProductWithVariants | null {
  const row = plainOne<ProductRow>(
    getDb().prepare("SELECT * FROM products WHERE id = ?").get(id)
  );
  if (!row) return null;
  const variants = plain<VariantRow>(
    getDb()
      .prepare("SELECT * FROM product_variants WHERE product_id = ? ORDER BY sort_order, id")
      .all(row.id)
  );
  return { ...row, variants };
}

/* ── Coupons ────────────────────────────────────────────────────────── */

export function getCoupons(): CouponRow[] {
  return plain<CouponRow>(
    getDb().prepare("SELECT * FROM coupons ORDER BY id DESC").all()
  );
}

export function getCouponByCode(code: string): CouponRow | null {
  const c = plainOne<CouponRow>(
    getDb().prepare("SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND active = 1").get(code.trim())
  );
  return c ?? null;
}

export function validateCoupon(
  code: string,
  subtotal: number // paise
): { valid: boolean; discount: number; message: string; coupon?: CouponRow } {
  if (!code.trim()) return { valid: false, discount: 0, message: "Enter a coupon code" };
  const coupon = getCouponByCode(code);
  if (!coupon) {
    return { valid: false, discount: 0, message: "Invalid or expired coupon code" };
  }
  if (coupon.usage_limit > 0 && coupon.times_used >= coupon.usage_limit) {
    return { valid: false, discount: 0, message: "Coupon usage limit reached" };
  }
  if (subtotal < coupon.min_order_amount) {
    const minRupees = Math.round(coupon.min_order_amount / 100);
    return {
      valid: false,
      discount: 0,
      message: `Minimum order amount of ₹${minRupees} required for this coupon`,
    };
  }

  let discount = 0;
  if (coupon.discount_type === "percent") {
    discount = Math.round((subtotal * coupon.discount_value) / 100);
    if (coupon.max_discount > 0) {
      discount = Math.min(discount, coupon.max_discount);
    }
  } else {
    discount = coupon.discount_value;
  }
  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    discount,
    message: `Coupon "${coupon.code}" applied successfully!`,
    coupon,
  };
}

export function saveCoupon(data: {
  id?: number | null;
  code: string;
  discount_type: "percent" | "flat";
  discount_value: number;
  min_order_amount: number;
  max_discount: number;
  usage_limit: number;
  active: number;
}) {
  const db = getDb();
  if (data.id) {
    db.prepare(`
      UPDATE coupons SET
        code = UPPER(?), discount_type = ?, discount_value = ?,
        min_order_amount = ?, max_discount = ?, usage_limit = ?, active = ?
      WHERE id = ?
    `).run(
      data.code.trim(),
      data.discount_type,
      data.discount_value,
      data.min_order_amount,
      data.max_discount,
      data.usage_limit,
      data.active,
      data.id
    );
  } else {
    db.prepare(`
      INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount, usage_limit, active)
      VALUES (UPPER(?), ?, ?, ?, ?, ?, ?)
    `).run(
      data.code.trim(),
      data.discount_type,
      data.discount_value,
      data.min_order_amount,
      data.max_discount,
      data.usage_limit,
      data.active
    );
  }
}

export function deleteCoupon(id: number) {
  getDb().prepare("DELETE FROM coupons WHERE id = ?").run(id);
}

/* ── Gallery Images ─────────────────────────────────────────────────── */

export function getGalleryImages(category?: string): GalleryImageRow[] {
  const db = getDb();
  if (category && category !== "all") {
    return plain<GalleryImageRow>(
      db.prepare("SELECT * FROM gallery_images WHERE category = ? ORDER BY sort_order, id DESC").all(category)
    );
  }
  return plain<GalleryImageRow>(
    db.prepare("SELECT * FROM gallery_images ORDER BY sort_order, id DESC").all()
  );
}

export function saveGalleryImage(url: string, title: string, category: string) {
  getDb().prepare(`
    INSERT INTO gallery_images (url, title, category)
    VALUES (?, ?, ?)
  `).run(url, title, category);
}

export function deleteGalleryImage(id: number) {
  getDb().prepare("DELETE FROM gallery_images WHERE id = ?").run(id);
}

/* ── Customer Reviews ───────────────────────────────────────────────── */

export function getReviews(featuredOnly = false): ReviewRow[] {
  const db = getDb();
  if (featuredOnly) {
    return plain<ReviewRow>(
      db.prepare("SELECT * FROM reviews WHERE featured = 1 ORDER BY id DESC").all()
    );
  }
  return plain<ReviewRow>(
    db.prepare("SELECT * FROM reviews ORDER BY id DESC").all()
  );
}

export function saveReview(data: {
  author_name: string;
  rating: number;
  comment: string;
  source: string;
  verified: number;
  featured: number;
}) {
  getDb().prepare(`
    INSERT INTO reviews (author_name, rating, comment, source, verified, featured)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    data.author_name,
    data.rating,
    data.comment,
    data.source,
    data.verified,
    data.featured
  );
}

export function deleteReview(id: number) {
  getDb().prepare("DELETE FROM reviews WHERE id = ?").run(id);
}

export function toggleReviewFeatured(id: number, featured: number) {
  getDb().prepare("UPDATE reviews SET featured = ? WHERE id = ?").run(featured, id);
}

/* ── Orders ─────────────────────────────────────────────────────────── */

export type NewOrderItem = {
  productId: number;
  variantLabel: string;
  qty: number;
};

export type NewOrderCustomer = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
  paymentMethod: "cod" | "online";
  couponCode?: string;
};

export class OrderError extends Error {}

export function createOrder(
  items: NewOrderItem[],
  customer: NewOrderCustomer
): { orderNumber: string } {
  if (!items || items.length === 0) {
    throw new OrderError("Cart is empty");
  }
  if (
    !customer.name?.trim() ||
    !customer.phone?.trim() ||
    !customer.address?.trim() ||
    !customer.city?.trim() ||
    !customer.state?.trim() ||
    !customer.pincode?.trim()
  ) {
    throw new OrderError("Please fill in all required shipping fields");
  }
  if (!["cod", "online"].includes(customer.paymentMethod)) {
    throw new OrderError("Invalid payment method");
  }

  const db = getDb();
  const settings = getSettings();

  if (customer.paymentMethod === "cod" && !settings.cod_enabled) {
    throw new OrderError(
      "Cash on Delivery is currently unavailable. Please pay online."
    );
  }

  // Server-side price calculation
  const productIds = Array.from(new Set(items.map((i) => i.productId)));
  const products = getAllProducts().filter((p) => productIds.includes(p.id));
  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const lines: {
    productId: number;
    name: string;
    variantLabel: string;
    unitPrice: number;
    qty: number;
  }[] = [];

  for (const item of items) {
    const p = productMap.get(item.productId);
    if (!p || !p.active) {
      throw new OrderError("A product in your cart is no longer available");
    }
    if (customer.paymentMethod === "cod" && !p.cod_enabled) {
      throw new OrderError(
        `Cash on Delivery is unavailable for ${p.name}. Please select online payment or remove this item.`
      );
    }
    const variant = p.variants.find((v) => v.label === item.variantLabel);
    if (!variant) {
      throw new OrderError(
        `Selected variant is no longer available for ${p.name}`
      );
    }
    const qty = Math.max(1, Math.floor(item.qty));
    subtotal += variant.price * qty;
    lines.push({
      productId: p.id,
      name: p.name,
      variantLabel: variant.label,
      unitPrice: variant.price,
      qty,
    });
  }

  const shipping =
    subtotal >= settings.free_shipping_threshold ? 0 : settings.flat_shipping;

  // Coupon validation
  let discountAmount = 0;
  let appliedCouponCode = "";
  if (customer.couponCode?.trim()) {
    const couponRes = validateCoupon(customer.couponCode, subtotal);
    if (couponRes.valid) {
      discountAmount = couponRes.discount;
      appliedCouponCode = couponRes.coupon?.code ?? customer.couponCode.toUpperCase();
      // Increment coupon usage
      db.prepare("UPDATE coupons SET times_used = times_used + 1 WHERE UPPER(code) = UPPER(?)").run(appliedCouponCode);
    }
  }

  const total = Math.max(0, subtotal - discountAmount) + shipping;

  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `SK-${y}${m}-${rand}`;

  const insertOrder = db.prepare(`
    INSERT INTO orders (
      order_number, customer_name, phone, email, address, city, state, pincode,
      notes, payment_method, payment_status, status, subtotal, shipping,
      coupon_code, discount_amount, total
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?)
  `);

  const result = insertOrder.run(
    orderNumber,
    customer.name.trim(),
    customer.phone.trim(),
    customer.email?.trim() ?? "",
    customer.address.trim(),
    customer.city.trim(),
    customer.state.trim(),
    customer.pincode.trim(),
    customer.notes?.trim() ?? "",
    customer.paymentMethod,
    customer.paymentMethod === "online" ? "paid" : "pending",
    subtotal,
    shipping,
    appliedCouponCode,
    discountAmount,
    total
  );

  const orderId = Number(result.lastInsertRowid);

  const insertItem = db.prepare(`
    INSERT INTO order_items
    (order_id, product_id, product_name, variant_label, unit_price, qty, line_total)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

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

export function updateOrderTracking(id: number, trackingNumber: string, carrier = "Delhivery") {
  getDb().prepare("UPDATE orders SET tracking_number = ?, tracking_carrier = ? WHERE id = ?").run(
    trackingNumber.trim(),
    carrier.trim(),
    id
  );
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
  
  // Payment split
  const codCount = (
    db.prepare("SELECT COUNT(*) AS n FROM orders WHERE payment_method = 'cod'").get() as { n: number }
  ).n;
  const onlineCount = (
    db.prepare("SELECT COUNT(*) AS n FROM orders WHERE payment_method = 'online'").get() as { n: number }
  ).n;

  // Low stock variants (< 20 units)
  const lowStock = plain<{ product_name: string; label: string; stock: number }>(
    db.prepare(`
      SELECT p.name AS product_name, v.label, v.stock
      FROM product_variants v
      JOIN products p ON p.id = v.product_id
      WHERE v.stock < 20 AND p.active = 1
      ORDER BY v.stock ASC
      LIMIT 5
    `).all()
  );

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

  return {
    revenue,
    orderCount,
    pending,
    productCount,
    avg,
    codCount,
    onlineCount,
    lowStock,
    topProducts,
    statusCounts,
  };
}

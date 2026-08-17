"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import {
  checkAdminCredentials,
  checkLoginRateLimit,
  clearAdminCookie,
  isAdmin,
  recordFailedLogin,
  recordSuccessfulLogin,
  setAdminCookie,
} from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import {
  updateOrderStatus,
  updateOrderTracking,
  saveCoupon,
  deleteCoupon,
  saveGalleryImage,
  deleteGalleryImage,
  saveReview,
  deleteReview,
  toggleReviewFeatured,
  validateCoupon,
} from "@/lib/queries";

/* ── Auth ──────────────────────────────────────────────────────────── */

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const rateLimit = checkLoginRateLimit();
  if (!rateLimit.allowed) {
    return {
      error: `Too many failed attempts. Please wait ${Math.ceil(
        (rateLimit.remainingSeconds ?? 60) / 60
      )} minutes before trying again.`,
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Enter the admin password." };

  if (!checkAdminCredentials(password)) {
    const result = recordFailedLogin();
    if (result.locked) {
      return {
        error: "Too many failed attempts. Account temporarily locked for 15 minutes.",
      };
    }
    return {
      error: `Incorrect password. (${result.remainingAttempts} attempt${
        result.remainingAttempts === 1 ? "" : "s"
      } remaining)`,
    };
  }

  recordSuccessfulLogin();
  await setAdminCookie();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminCookie();
  redirect("/admin/login");
}

async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/* ── Products ──────────────────────────────────────────────────────── */

type VariantInput = { label: string; price: number; stock?: number };

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();

  const id = Number(formData.get("id")) || null;
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Product name is required");

  // Slug: use provided or generate from name
  const slug =
    String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const fields = {
    slug,
    name,
    category: String(formData.get("category") ?? "dry-fruits"),
    short_desc: String(formData.get("short_desc") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    badge: String(formData.get("badge") ?? "").trim(),
    rating: Number(formData.get("rating")) || 4.8,
    reviews_count: Math.max(0, Math.floor(Number(formData.get("reviews_count")) || 0)),
    batch_no: String(formData.get("batch_no") ?? "").trim(),
    harvest_date: String(formData.get("harvest_date") ?? "").trim(),
    crocin: String(formData.get("crocin") ?? "").trim(),
    safranal: String(formData.get("safranal") ?? "").trim(),
    picrocrocin: String(formData.get("picrocrocin") ?? "").trim(),
    origin: String(formData.get("origin") ?? "").trim(),
    cod_enabled: formData.get("cod_enabled") === "on" ? 1 : 0,
    sort_order: Number(formData.get("sort_order")) || 0,
    active: formData.get("active") === "on" ? 1 : 0,
  };

  // Image upload
  const file = formData.get("image_file") as File | null;
  let imagePath: string | null = null;
  if (file && file.size > 0) {
    imagePath = await handleImageUpload(file);
  }

  // Parse variants
  const variantsRaw = String(formData.get("variants_json") ?? "[]");
  let variants: VariantInput[] = [];
  try {
    variants = JSON.parse(variantsRaw);
  } catch {
    variants = [];
  }

  if (variants.length === 0) {
    throw new Error("At least one variant (e.g. 1g, 5g) with a price is required");
  }

  let productId = id;

  if (id) {
    // Update
    if (imagePath) {
      db.prepare(`
        UPDATE products SET
          slug = ?, name = ?, category = ?, short_desc = ?, description = ?,
          image = ?, badge = ?, rating = ?, reviews_count = ?, batch_no = ?,
          harvest_date = ?, crocin = ?, safranal = ?, picrocrocin = ?,
          origin = ?, cod_enabled = ?, sort_order = ?, active = ?
        WHERE id = ?
      `).run(
        fields.slug, fields.name, fields.category, fields.short_desc, fields.description,
        imagePath, fields.badge, fields.rating, fields.reviews_count, fields.batch_no,
        fields.harvest_date, fields.crocin, fields.safranal, fields.picrocrocin,
        fields.origin, fields.cod_enabled, fields.sort_order, fields.active, id
      );
    } else {
      db.prepare(`
        UPDATE products SET
          slug = ?, name = ?, category = ?, short_desc = ?, description = ?,
          badge = ?, rating = ?, reviews_count = ?, batch_no = ?,
          harvest_date = ?, crocin = ?, safranal = ?, picrocrocin = ?,
          origin = ?, cod_enabled = ?, sort_order = ?, active = ?
        WHERE id = ?
      `).run(
        fields.slug, fields.name, fields.category, fields.short_desc, fields.description,
        fields.badge, fields.rating, fields.reviews_count, fields.batch_no,
        fields.harvest_date, fields.crocin, fields.safranal, fields.picrocrocin,
        fields.origin, fields.cod_enabled, fields.sort_order, fields.active, id
      );
    }
    // Replace variants
    db.prepare("DELETE FROM product_variants WHERE product_id = ?").run(id);
  } else {
    // Insert
    const r = db.prepare(`
      INSERT INTO products (
        slug, name, category, short_desc, description, image, badge,
        rating, reviews_count, batch_no, harvest_date, crocin, safranal,
        picrocrocin, origin, cod_enabled, sort_order, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      fields.slug, fields.name, fields.category, fields.short_desc, fields.description,
      imagePath ?? "", fields.badge, fields.rating, fields.reviews_count, fields.batch_no,
      fields.harvest_date, fields.crocin, fields.safranal, fields.picrocrocin,
      fields.origin, fields.cod_enabled, fields.sort_order, fields.active
    );
    productId = Number(r.lastInsertRowid);
  }

  const insertVariant = db.prepare(`
    INSERT INTO product_variants (product_id, label, price, stock, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);
  variants.forEach((v, i) => {
    insertVariant.run(
      productId,
      v.label,
      Math.round(v.price), // stored in paise
      v.stock ?? 100,
      i
    );
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/product/${fields.slug}`);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) {
    getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");
  }
  redirect("/admin/products");
}

/* ── Orders & Tracking ───────────────────────────────────────────────── */

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (id && status) {
    updateOrderStatus(id, status);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin");
  }
}

export async function updateOrderTrackingAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const trackingNumber = String(formData.get("tracking_number") ?? "");
  const carrier = String(formData.get("tracking_carrier") ?? "Delhivery");
  if (id) {
    updateOrderTracking(id, trackingNumber, carrier);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
  }
}

/* ── Coupons ────────────────────────────────────────────────────────── */

export async function saveCouponAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id")) || null;
  const code = String(formData.get("code") ?? "").trim();
  const discountType = String(formData.get("discount_type")) as "percent" | "flat";
  const rawValue = Number(formData.get("discount_value")) || 0;
  const discountValue = discountType === "percent" ? rawValue : Math.round(rawValue * 100);
  const minOrderAmount = Math.round((Number(formData.get("min_order_rupees")) || 0) * 100);
  const maxDiscount = Math.round((Number(formData.get("max_discount_rupees")) || 0) * 100);
  const usageLimit = Number(formData.get("usage_limit")) || 0;
  const active = formData.get("active") === "on" ? 1 : 0;

  if (!code) throw new Error("Coupon code is required");

  saveCoupon({
    id,
    code,
    discount_type: discountType,
    discount_value: discountValue,
    min_order_amount: minOrderAmount,
    max_discount: maxDiscount,
    usage_limit: usageLimit,
    active,
  });

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCouponAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) {
    deleteCoupon(id);
    revalidatePath("/admin/coupons");
  }
}

export async function checkCouponCodeAction(code: string, subtotalPaise: number) {
  return validateCoupon(code, subtotalPaise);
}

/* ── Gallery Images ─────────────────────────────────────────────────── */

export async function uploadGalleryPhotoAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim() || "Showroom Photo";
  const category = String(formData.get("category") ?? "showroom");
  const file = formData.get("photo_file") as File | null;

  if (!file || file.size === 0) {
    throw new Error("Please select an image file to upload");
  }

  const url = await handleImageUpload(file);
  saveGalleryImage(url, title, category);

  revalidatePath("/");
  revalidatePath("/visit");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}

export async function deleteGalleryPhotoAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) {
    deleteGalleryImage(id);
    revalidatePath("/visit");
    revalidatePath("/admin/gallery");
  }
}

/* ── Reviews ────────────────────────────────────────────────────────── */

export async function saveReviewAction(formData: FormData) {
  await requireAdmin();
  const author_name = String(formData.get("author_name") ?? "").trim();
  const rating = Number(formData.get("rating")) || 5;
  const comment = String(formData.get("comment") ?? "").trim();
  const source = String(formData.get("source") ?? "google_maps");
  const featured = formData.get("featured") === "on" ? 1 : 0;

  if (!author_name || !comment) throw new Error("Author name and review text are required");

  saveReview({
    author_name,
    rating,
    comment,
    source,
    verified: 1,
    featured,
  });

  revalidatePath("/");
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function toggleReviewFeaturedAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const featured = Number(formData.get("featured")) ? 1 : 0;
  if (id) {
    toggleReviewFeatured(id, featured);
    revalidatePath("/admin/reviews");
  }
}

export async function deleteReviewAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) {
    deleteReview(id);
    revalidatePath("/admin/reviews");
  }
}

/* ── Settings ──────────────────────────────────────────────────────── */

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const entries: [string, string][] = [
    ["harvest_banner", String(formData.get("harvest_banner") ?? "").trim()],
    ["whatsapp_number", String(formData.get("whatsapp_number") ?? "").trim()],
    ["whatsapp_label", String(formData.get("whatsapp_label") ?? "WhatsApp").trim()],
    [
      "free_shipping_threshold",
      String(
        Math.round((Number(formData.get("free_shipping_rupees")) || 2000) * 100)
      ),
    ],
    [
      "flat_shipping",
      String(Math.round((Number(formData.get("flat_shipping_rupees")) || 90) * 100)),
    ],
    ["store_address", String(formData.get("store_address") ?? "").trim()],
    ["store_phone", String(formData.get("store_phone") ?? "").trim()],
    ["store_email", String(formData.get("store_email") ?? "").trim()],
    ["cod_enabled", formData.get("cod_enabled") === "on" ? "1" : "0"],
  ];

  const update = db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  );
  entries.forEach(([k, v]) => update.run(k, v));

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/checkout");
  revalidatePath("/visit");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

export async function changePasswordAction(
  _prev: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  await requireAdmin();
  const currentPassword = String(formData.get("current_password") ?? "");
  const newPassword = String(formData.get("new_password") ?? "");

  if (!checkAdminCredentials(currentPassword)) {
    return { error: "Current password is incorrect." };
  }
  if (!newPassword || newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  const hash = hashPassword(newPassword);
  getDb()
    .prepare(
      "INSERT INTO settings (key, value) VALUES ('admin_password_hash', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
    )
    .run(hash);

  return { success: "Password successfully changed!" };
}

/* ── Image Upload Helper ───────────────────────────────────────────── */

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

async function handleImageUpload(file: File): Promise<string> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error(
      "Invalid image type. Allowed types: JPEG, PNG, WebP, AVIF, GIF."
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image exceeds maximum allowed size of 10MB.");
  }

  const ext = MIME_EXTENSIONS[file.type] || ".jpg";
  const filename = `${randomBytes(16).toString("hex")}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return `/uploads/${filename}`;
}

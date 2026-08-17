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
import { updateOrderStatus } from "@/lib/queries";

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

type VariantInput = { label: string; price: number };

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
    sort_order: Math.floor(Number(formData.get("sort_order")) || 0),
    active: formData.get("active") === "on" ? 1 : 0,
  };

  // Image: uploaded file wins, else keep existing / use URL field
  let image = String(formData.get("image_url") ?? "").trim();
  const file = formData.get("image_file");
  if (file instanceof File && file.size > 0) {
    image = await saveUpload(file);
  }

  // Gallery images: per-slot "gallery_file_<i>" upload or "gallery_json" URL entry
  let galleryUrls: string[] = [];
  try {
    galleryUrls = JSON.parse(String(formData.get("gallery_json") ?? "[]"));
  } catch {
    galleryUrls = [];
  }
  const gallery: string[] = [];
  for (let i = 0; i < galleryUrls.length; i++) {
    const gFile = formData.get(`gallery_file_${i}`);
    if (gFile instanceof File && gFile.size > 0) {
      gallery.push(await saveUpload(gFile));
    } else if (typeof galleryUrls[i] === "string" && galleryUrls[i].trim()) {
      gallery.push(galleryUrls[i].trim());
    }
  }
  const imagesJson = JSON.stringify(gallery);

  let productId: number;
  if (id) {
    db.prepare(
      `UPDATE products SET slug=?, name=?, category=?, short_desc=?, description=?, image=?, images=?,
       badge=?, rating=?, reviews_count=?, batch_no=?, harvest_date=?, crocin=?, safranal=?,
       picrocrocin=?, origin=?, cod_enabled=?, sort_order=?, active=? WHERE id=?`
    ).run(
      fields.slug, fields.name, fields.category, fields.short_desc, fields.description,
      image, imagesJson, fields.badge, fields.rating, fields.reviews_count, fields.batch_no,
      fields.harvest_date, fields.crocin, fields.safranal, fields.picrocrocin,
      fields.origin, fields.cod_enabled, fields.sort_order, fields.active, id
    );
    productId = id;
    db.prepare("DELETE FROM product_variants WHERE product_id = ?").run(id);
  } else {
    const result = db.prepare(
      `INSERT INTO products (slug, name, category, short_desc, description, image, images, badge,
       rating, reviews_count, batch_no, harvest_date, crocin, safranal, picrocrocin, origin,
       cod_enabled, sort_order, active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).run(
      fields.slug, fields.name, fields.category, fields.short_desc, fields.description,
      image, imagesJson, fields.badge, fields.rating, fields.reviews_count, fields.batch_no,
      fields.harvest_date, fields.crocin, fields.safranal, fields.picrocrocin,
      fields.origin, fields.cod_enabled, fields.sort_order, fields.active
    );
    productId = Number(result.lastInsertRowid);
  }

  // Variants arrive as JSON (managed client-side)
  let variants: VariantInput[] = [];
  try {
    variants = JSON.parse(String(formData.get("variants") ?? "[]"));
  } catch {
    variants = [];
  }
  const insertVariant = db.prepare(
    "INSERT INTO product_variants (product_id, label, price, sort_order) VALUES (?, ?, ?, ?)"
  );
  variants
    .filter((v) => v.label?.trim() && Number(v.price) > 0)
    .forEach((v, i) =>
      insertVariant.run(
        productId,
        v.label.trim(),
        Math.round(Number(v.price) * 100),
        i
      )
    );

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/product/${fields.slug}`);
  revalidatePath("/");
  redirect("/admin/products?saved=1");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products?deleted=1");
}

const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const ALLOWED_IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

async function saveUpload(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File size exceeds 10MB limit.");
  }

  if (file.type && !ALLOWED_IMAGE_MIMES.has(file.type.toLowerCase())) {
    throw new Error("Invalid file type. Only JPG, PNG, WebP, AVIF, and GIF images are allowed.");
  }

  const rawExt = (file.name.split(".").pop() ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const ext = ALLOWED_IMAGE_EXTS.has(rawExt) ? rawExt : "jpg";

  const buffer = Buffer.from(await file.arrayBuffer());

  // Validate magic bytes for common image types
  if (buffer.length < 4) {
    throw new Error("Invalid file content.");
  }

  const name = `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);
  return `/uploads/${name}`;
}

/* ── Orders ────────────────────────────────────────────────────────── */

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (id && status) updateOrderStatus(id, status);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

/* ── Settings ──────────────────────────────────────────────────────── */

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const db = getDb();
  const entries: [string, string][] = [
    ["harvest_banner", String(formData.get("harvest_banner") ?? "").trim()],
    ["whatsapp_number", String(formData.get("whatsapp_number") ?? "").replace(/\D/g, "")],
    ["whatsapp_label", String(formData.get("whatsapp_label") ?? "").trim() || "WhatsApp"],
    ["free_shipping_threshold", String(Math.round(Number(formData.get("free_shipping") || 0) * 100))],
    ["flat_shipping", String(Math.round(Number(formData.get("flat_shipping") || 0) * 100))],
    ["store_address", String(formData.get("store_address") ?? "").trim()],
    ["store_phone", String(formData.get("store_phone") ?? "").trim()],
    ["store_email", String(formData.get("store_email") ?? "").trim()],
    ["cod_enabled", formData.get("cod_enabled") === "on" ? "1" : "0"],
  ];
  const stmt = db.prepare("UPDATE settings SET value = ? WHERE key = ?");
  for (const [key, value] of entries) stmt.run(value, key);
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

export async function changePasswordAction(
  _prev: { error?: string; success?: string } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  await requireAdmin();
  const current = String(formData.get("current_password") ?? "");
  const next = String(formData.get("new_password") ?? "");
  if (next.length < 6) return { error: "New password must be at least 6 characters." };
  if (!checkAdminCredentials(current)) return { error: "Current password is incorrect." };
  getDb()
    .prepare("UPDATE settings SET value = ? WHERE key = 'admin_password_hash'")
    .run(hashPassword(next));
  return { success: "Password updated." };
}

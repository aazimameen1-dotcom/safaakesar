"use client";

import { useState } from "react";
import { saveProductAction } from "../../actions";
import Icon from "@/components/Icon";

const MAX_IMAGE_DIM = 1600; // px — plenty for product photos
const COMPRESS_ABOVE = 400 * 1024; // only bother compressing files above 400 KB

/**
 * Downscales large photos in the browser before upload so a save never
 * blows past the server action body limit (phone photos are often 3–8 MB).
 */
async function downscaleImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  if (file.size <= COMPRESS_ABOVE) return file;
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }
  const scale = Math.min(1, MAX_IMAGE_DIM / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  // JPEG has no alpha — fill white so transparent PNGs don't turn black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85)
  );
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
    type: "image/jpeg",
  });
}

export type ProductFormValues = {
  id?: number;
  slug: string;
  name: string;
  category: string;
  short_desc: string;
  description: string;
  image: string;
  /** additional gallery images shown on the product page */
  gallery: string[];
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
  variants: { label: string; price: number; stock?: number }[];
};

const fileInputClass =
  "w-full font-body-md text-sm text-on-surface-variant file:mr-3 file:border-0 file:bg-surface-container file:text-walnut-ink file:rounded file:px-3 file:py-2 file:font-label-caps file:uppercase file:text-label-caps file:cursor-pointer";

const inputClass =
  "w-full border border-outline-variant bg-warm-ivory rounded px-3 py-2.5 font-body-md text-body-md text-walnut-ink focus:outline-none focus:border-primary";

function Field({
  label,
  name,
  children,
  span,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
  span?: 1 | 2 | 3;
}) {
  return (
    <div className={span === 2 ? "sm:col-span-2" : span === 3 ? "sm:col-span-2 lg:col-span-3" : ""}>
      <label
        htmlFor={name}
        className="block font-label-caps text-label-caps text-walnut-ink uppercase mb-2"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ProductForm({ initial }: { initial: ProductFormValues }) {
  const [variants, setVariants] = useState(
    initial.variants.length
      ? initial.variants
      : [{ label: "", price: 0 }]
  );
  const [gallery, setGallery] = useState<string[]>(
    initial.gallery.length ? initial.gallery : [""]
  );

  const setVariant = (
    i: number,
    patch: Partial<{ label: string; price: number; stock?: number }>
  ) =>
    setVariants((vs) => vs.map((v, j) => (j === i ? { ...v, ...patch } : v)));

  const setGalleryUrl = (i: number, url: string) =>
    setGallery((gs) => gs.map((g, j) => (j === i ? url : g)));

  const [saving, setSaving] = useState(false);

  // If any attached image is large, compress it in the browser before the
  // server action runs; otherwise let the form submit natively.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const fileInputs = Array.from(
      form.querySelectorAll<HTMLInputElement>('input[type="file"]')
    );
    const bigFiles = fileInputs.filter(
      (input) =>
        input.files?.[0] &&
        input.files[0].type.startsWith("image/") &&
        input.files[0].size > COMPRESS_ABOVE
    );
    if (bigFiles.length === 0) return;

    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(form);
      for (const input of bigFiles) {
        const original = input.files![0];
        const compressed = await downscaleImageFile(original);
        formData.set(input.name, compressed, compressed.name);
      }
      await saveProductAction(formData);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={saveProductAction} onSubmit={handleSubmit} className="space-y-8">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="variants" value={JSON.stringify(variants)} />
      <input type="hidden" name="gallery_json" value={JSON.stringify(gallery)} />

      {/* Basics */}
      <section className="bg-surface border border-outline-variant rounded p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <h2 className="font-headline-md text-headline-md text-walnut-ink sm:col-span-2 lg:col-span-3 mb-2">
          Basics
        </h2>
        <Field label="Product Name" name="name">
          <input id="name" name="name" defaultValue={initial.name} required className={inputClass} />
        </Field>
        <Field label="URL Slug (auto if blank)" name="slug">
          <input id="slug" name="slug" defaultValue={initial.slug} className={inputClass} placeholder="e.g. signature-mongra-saffron" />
        </Field>
        <Field label="Category" name="category">
          <select id="category" name="category" defaultValue={initial.category} className={inputClass}>
            <option value="saffron">Mongra Saffron</option>
            <option value="dry-fruits">Kashmiri Dry Fruits</option>
            <option value="wellness">Botanical Wellness</option>
          </select>
        </Field>
        <Field label="Short Description (card text)" name="short_desc" span={3}>
          <textarea id="short_desc" name="short_desc" defaultValue={initial.short_desc} rows={2} className={inputClass} />
        </Field>
        <Field label="Full Description (product page)" name="description" span={3}>
          <textarea id="description" name="description" defaultValue={initial.description} rows={4} className={inputClass} />
        </Field>
        <Field label="Badge (e.g. Batch Verified)" name="badge">
          <input id="badge" name="badge" defaultValue={initial.badge} className={inputClass} />
        </Field>
        <Field label="Rating (0–5)" name="rating">
          <input id="rating" name="rating" type="number" step="0.1" min="0" max="5" defaultValue={initial.rating} className={inputClass} />
        </Field>
        <Field label="Review Count" name="reviews_count">
          <input id="reviews_count" name="reviews_count" type="number" min="0" defaultValue={initial.reviews_count} className={inputClass} />
        </Field>
      </section>

      {/* Main image */}
      <section className="bg-surface border border-outline-variant rounded p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <h2 className="font-headline-md text-headline-md text-walnut-ink sm:col-span-2 mb-2">
          Main Image
          <span className="font-body-md text-sm text-on-surface-variant font-normal ml-2">
            shown on shop cards and in the cart
          </span>
        </h2>
        <Field label="Image Path or URL" name="image_url">
          <input
            id="image_url"
            name="image_url"
            defaultValue={initial.image}
            className={inputClass}
            placeholder="/images/shop-saffron.jpg or https://…"
          />
        </Field>
        <div>
          <label
            htmlFor="image_file"
            className="block font-label-caps text-label-caps text-walnut-ink uppercase mb-2"
          >
            …or Upload a File
          </label>
          <input
            type="file"
            id="image_file"
            name="image_file"
            accept="image/*"
            className={fileInputClass}
          />
          {initial.image && (
            <div className="mt-3 flex items-center gap-3">
              <div className="h-14 w-14 rounded border border-outline-variant bg-surface-container overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={initial.image} alt="" className="h-full w-full object-cover" />
              </div>
              <span className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                Current image
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Gallery images */}
      <section className="bg-surface border border-outline-variant rounded p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-headline-md text-headline-md text-walnut-ink">
            Gallery Images
            <span className="font-body-md text-sm text-on-surface-variant font-normal ml-2">
              the photo set on the product page
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setGallery((gs) => [...gs, ""])}
            className="border border-walnut-ink text-walnut-ink hover:bg-surface-variant font-label-caps text-label-caps uppercase tracking-wider px-3 py-1.5 rounded transition-colors flex items-center gap-1"
          >
            <Icon name="add" className="text-[14px]" /> Add Image
          </button>
        </div>
        <p className="font-body-md text-xs text-on-surface-variant mb-4">
          Paste a URL or upload a file for each slot. If the gallery is empty, the
          main image is shown on the product page instead.
        </p>
        <div className="space-y-3">
          {gallery.map((url, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3">
              <div className="h-14 w-14 shrink-0 rounded border border-outline-variant bg-surface-container overflow-hidden flex items-center justify-center">
                {url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Icon name="image" className="text-[20px] text-outline-variant" />
                )}
              </div>
              <input
                value={url}
                onChange={(e) => setGalleryUrl(i, e.target.value)}
                placeholder="/images/my-photo.jpg or https://…"
                aria-label={`Gallery image ${i + 1} path or URL`}
                className={`${inputClass} flex-1 min-w-[200px]`}
              />
              <input
                type="file"
                name={`gallery_file_${i}`}
                accept="image/*"
                className={`${fileInputClass} max-w-[240px]`}
              />
              <button
                type="button"
                onClick={() => setGallery((gs) => gs.filter((_, j) => j !== i))}
                className="p-2 rounded text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors"
                aria-label={`Remove gallery image ${i + 1}`}
              >
                <Icon name="close" className="text-[16px]" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Variants */}
      <section className="bg-surface border border-outline-variant rounded p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline-md text-headline-md text-walnut-ink">
            Weights &amp; Prices
          </h2>
          <button
            type="button"
            onClick={() => setVariants((vs) => [...vs, { label: "", price: 0 }])}
            className="border border-walnut-ink text-walnut-ink hover:bg-surface-variant font-label-caps text-label-caps uppercase tracking-wider px-3 py-1.5 rounded transition-colors flex items-center gap-1"
          >
            <Icon name="add" className="text-[14px]" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {variants.map((v, i) => (
            <div key={i} className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <input
                value={v.label}
                onChange={(e) => setVariant(i, { label: e.target.value })}
                placeholder="Weight, e.g. 1g / 250g"
                className={`${inputClass} max-w-[180px]`}
              />
              <div className="flex items-center gap-2">
                <span className="font-body-md text-sm text-on-surface-variant font-bold">₹</span>
                <input
                  value={v.price || ""}
                  onChange={(e) => setVariant(i, { price: Number(e.target.value) })}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  className={`${inputClass} max-w-[130px] tabular`}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body-md text-xs text-on-surface-variant whitespace-nowrap">Stock:</span>
                <input
                  value={v.stock ?? 100}
                  onChange={(e) => setVariant(i, { stock: Number(e.target.value) })}
                  type="number"
                  min="0"
                  placeholder="100"
                  className={`${inputClass} max-w-[110px] tabular`}
                />
              </div>
              <button
                type="button"
                onClick={() => setVariants((vs) => vs.filter((_, j) => j !== i))}
                className="p-2 rounded text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors"
                aria-label="Remove variant"
              >
                <Icon name="close" className="text-[16px]" />
              </button>
            </div>
          ))}
        </div>
        <p className="font-body-md text-xs text-on-surface-variant mt-3">
          Specify weight label, INR price, and available inventory stock per variant.
        </p>
      </section>

      {/* Provenance / lab data */}
      <section className="bg-surface border border-outline-variant rounded p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <h2 className="font-headline-md text-headline-md text-walnut-ink sm:col-span-2 lg:col-span-3 mb-2">
          Provenance &amp; Lab Data{" "}
          <span className="font-body-md text-sm text-on-surface-variant font-normal">
            (shown on the product page when filled)
          </span>
        </h2>
        <Field label="Batch Number" name="batch_no">
          <input id="batch_no" name="batch_no" defaultValue={initial.batch_no} className={inputClass} />
        </Field>
        <Field label="Harvest Date" name="harvest_date">
          <input id="harvest_date" name="harvest_date" defaultValue={initial.harvest_date} className={inputClass} placeholder="Oct 2023" />
        </Field>
        <Field label="Origin Label" name="origin">
          <input id="origin" name="origin" defaultValue={initial.origin} className={inputClass} placeholder="Pampore, Kashmir (34.02° N)" />
        </Field>
        <Field label="Crocin (coloring strength)" name="crocin">
          <input id="crocin" name="crocin" defaultValue={initial.crocin} className={inputClass} placeholder="246" />
        </Field>
        <Field label="Safranal (aroma)" name="safranal">
          <input id="safranal" name="safranal" defaultValue={initial.safranal} className={inputClass} placeholder="42" />
        </Field>
        <Field label="Picrocrocin (flavor)" name="picrocrocin">
          <input id="picrocrocin" name="picrocrocin" defaultValue={initial.picrocrocin} className={inputClass} placeholder="95" />
        </Field>
      </section>

      {/* Visibility + submit */}
      <section className="bg-surface border border-outline-variant rounded p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                defaultChecked={initial.active === 1}
                className="h-4 w-4 accent-[#851a08]"
              />
              <span className="font-body-md text-body-md text-walnut-ink">
                Visible on storefront
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="cod_enabled"
                defaultChecked={initial.cod_enabled === 1}
                className="h-4 w-4 accent-[#851a08]"
              />
              <span className="font-body-md text-body-md text-walnut-ink">
                Cash on Delivery (COD)
              </span>
            </label>
          </div>
          <p className="font-body-md text-xs text-on-surface-variant max-w-[260px]">
            With COD off, this product can only be bought with online payment —
            if it&apos;s in a cart, the whole order becomes prepaid-only.
          </p>
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-label-caps text-walnut-ink uppercase">
              Sort Order
            </span>
            <input
              name="sort_order"
              type="number"
              defaultValue={initial.sort_order}
              className={`${inputClass} w-20 tabular`}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary font-label-caps text-label-caps uppercase tracking-wider px-8 py-3.5 rounded transition-colors"
        >
          {saving ? "Compressing & Saving…" : "Save Product"}
        </button>
      </section>
    </form>
  );
}

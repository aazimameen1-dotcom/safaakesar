import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchase from "@/components/ProductPurchase";
import { getProductBySlug, getProductImages, getSettings } from "@/lib/queries";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return {
    title: product ? `${product.name} — Pure Kashmiri Origin` : "Product",
    description: product?.short_desc,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const settings = getSettings();
  const images = getProductImages(product);
  const hasLabData = Boolean(
    product.crocin || product.safranal || product.picrocrocin
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider mb-6 flex items-center gap-2">
        <Link href="/shop" className="hover:text-primary transition-colors">
          Shop Catalog
        </Link>
        <Icon name="chevron_right" className="text-[14px]" />
        <Link
          href={`/shop#${product.category}`}
          className="hover:text-primary transition-colors"
        >
          {product.category === "saffron"
            ? "Mongra Saffron"
            : product.category === "dry-fruits"
              ? "Dry Fruits"
              : "Wellness"}
        </Link>
        <Icon name="chevron_right" className="text-[14px]" />
        <span className="text-on-surface font-bold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-gutter items-start">
        {/* Left: Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={images}
            name={product.name}
            originBadge={product.origin || undefined}
          />
        </div>

        {/* Right: Details & Purchasing */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Header & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="font-label-md text-[11px] font-bold uppercase tracking-wider bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full shadow-sm">
                {product.badge || "Heritage Verified"}
              </span>
              {product.origin && (
                <span className="font-label-md text-[11px] font-bold text-trust-olive bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant">
                  {product.origin}
                </span>
              )}
            </div>

            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
              {product.name}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {product.short_desc}
            </p>
          </div>

          {/* Rating */}
          {product.reviews_count > 0 && (
            <div className="flex items-center gap-2 text-on-surface-variant">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Icon
                    key={s}
                    name="star"
                    fill={s <= Math.round(product.rating)}
                    className={`text-[16px] ${
                      s <= Math.round(product.rating)
                        ? "text-secondary"
                        : "text-outline-variant"
                    }`}
                  />
                ))}
              </div>
              <span className="font-label-md text-sm font-bold text-on-surface">
                {product.rating.toFixed(1)}
              </span>
              <span className="font-body-md text-xs text-on-surface-variant">
                ({product.reviews_count} Verified Customer Reviews)
              </span>
            </div>
          )}

          {/* Product Purchase Box */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm">
            <ProductPurchase
              productId={product.id}
              slug={product.slug}
              name={product.name}
              image={product.image}
              variants={product.variants}
            />
          </div>

          {/* Provenance & Batch Certificate */}
          {(product.batch_no || product.harvest_date) && (
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant space-y-3">
              <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                <span className="font-label-md text-xs font-bold text-trust-olive uppercase flex items-center gap-1.5">
                  <Icon name="verified" className="text-sm" /> Batch Certificate
                </span>
                <span className="font-label-md text-xs font-bold text-on-surface">
                  Batch #{product.batch_no || "882"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-on-surface-variant block">Harvest Date:</span>
                  <span className="font-bold text-on-surface">{product.harvest_date || "Current Season"}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Origin:</span>
                  <span className="font-bold text-on-surface">{product.origin || "Lethipora, Pampore"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Lab Test Metrics (For Saffron / Tested Items) */}
          {hasLabData && (
            <div className="bg-surface rounded-xl p-5 border border-outline-variant space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-base font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="science" className="text-primary text-[18px]" />
                  ISO 3632 Lab Metrics
                </h3>
                <span className="font-label-md text-[10px] text-trust-olive bg-trust-olive/10 px-2 py-0.5 rounded font-bold uppercase">
                  Grade 1 Standard
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-1">
                {product.crocin && (
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant text-center">
                    <span className="font-caption text-[10px] text-on-surface-variant uppercase block">Crocin (Color)</span>
                    <span className="tabular font-headline-md text-lg font-bold text-primary block mt-0.5">{product.crocin}</span>
                    <span className="text-[10px] text-trust-olive font-bold">Req: &gt;190</span>
                  </div>
                )}
                {product.safranal && (
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant text-center">
                    <span className="font-caption text-[10px] text-on-surface-variant uppercase block">Safranal (Aroma)</span>
                    <span className="tabular font-headline-md text-lg font-bold text-primary block mt-0.5">{product.safranal}</span>
                    <span className="text-[10px] text-trust-olive font-bold">Req: 20-50</span>
                  </div>
                )}
                {product.picrocrocin && (
                  <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant text-center">
                    <span className="font-caption text-[10px] text-on-surface-variant uppercase block">Picrocrocin</span>
                    <span className="tabular font-headline-md text-lg font-bold text-primary block mt-0.5">{product.picrocrocin}</span>
                    <span className="text-[10px] text-trust-olive font-bold">Req: &gt;70</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Direct WhatsApp Support Button */}
          <a
            href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(
              `Hello Aadil, I'm viewing ${product.name} on the Safa Kesar website and would like to ask a question / verify batch #${product.batch_no || "882"}.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-trust-olive text-trust-olive hover:bg-trust-olive hover:text-white py-3 px-6 rounded-lg transition-colors font-label-md text-xs font-bold uppercase tracking-wider"
          >
            <Icon name="chat" fill className="text-[18px]" />
            Ask Aadil about this Batch on WhatsApp
          </a>
        </div>
      </div>

      {/* Description & Testing Information */}
      <section className="mt-16 pt-12 border-t border-outline-variant">
        <div className="max-w-3xl space-y-6">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Product Details &amp; Authenticity
          </h2>
          <div className="prose font-body-md text-body-md text-on-surface-variant leading-relaxed space-y-4">
            <p>{product.description}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

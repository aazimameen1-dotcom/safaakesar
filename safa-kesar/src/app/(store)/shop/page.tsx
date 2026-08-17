import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import ProductPurchase from "@/components/ProductPurchase";
import QuickAddButton from "@/components/QuickAddButton";
import { formatINR } from "@/lib/money";
import { getActiveProducts, type ProductWithVariants } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Catalog — Pure Saffron & Dry Fruits",
};

const CATEGORY_META = {
  saffron: {
    title: "Pure Kashmiri Mongra Saffron",
    desc: "Directly from the saffron fields of Lethipora. Tested for Crocin > 240.",
    badge: "ISO 3632 Certified",
  },
  "dry-fruits": {
    title: "Kashmiri Dry Fruits & Nuts",
    desc: "Sun-dried Walnut kernels (Giri), Mamra Almonds, and local Pecans.",
    badge: "100% Natural",
  },
  wellness: {
    title: "Botanical Wellness & Honey",
    desc: "Pure Himalayan Shilajit, Saffron Acacia Honey, and traditional Kahwa spices.",
    badge: "Lab Tested",
  },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const allProducts = getActiveProducts();

  const products = q
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.short_desc.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase())
      )
    : allProducts;

  const saffron = products.filter((p) => p.category === "saffron");
  const dryFruits = products.filter((p) => p.category === "dry-fruits");
  const wellness = products.filter((p) => p.category === "wellness");

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-10 md:mb-14">
        <span className="font-label-md text-xs text-trust-olive uppercase tracking-widest font-bold mb-2 block">
          Pampore Landmark Catalog
        </span>
        <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface mb-3">
          {q ? `Search Results for "${q}"` : "Pure Artisanal Selection"}
        </h1>
        <p className="font-body-lg text-body-md text-on-surface-variant max-w-2xl">
          Authentic Kashmiri Saffron, Walnuts, and Botanical Wellness straight from our physical showroom in Lethipora on NH 44.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-gutter relative">
        {/* Sticky Collections Sidebar */}
        <aside className="lg:w-1/4 shrink-0">
          <div className="sticky top-24 bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
            <h2 className="font-headline-md text-headline-md text-primary mb-1">
              Collections
            </h2>
            <p className="font-body-md text-xs text-on-surface-variant mb-4">
              Direct from Lethipora, Pampore
            </p>

            <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden">
              <a
                href="#all"
                className="whitespace-nowrap flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors font-label-md text-sm font-bold"
              >
                <Icon name="grid_view" className="text-[18px]" />
                All Products ({products.length})
              </a>
              <a
                href="#saffron"
                className="whitespace-nowrap flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors font-label-md text-sm font-bold"
              >
                <Icon name="spa" className="text-[18px] text-secondary" />
                Pure Saffron ({saffron.length})
              </a>
              <a
                href="#dry-fruits"
                className="whitespace-nowrap flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors font-label-md text-sm font-bold"
              >
                <Icon name="nutrition" className="text-[18px]" />
                Dry Fruits &amp; Nuts ({dryFruits.length})
              </a>
              <a
                href="#wellness"
                className="whitespace-nowrap flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors font-label-md text-sm font-bold"
              >
                <Icon name="energy_savings_leaf" className="text-[18px]" />
                Botanical Wellness ({wellness.length})
              </a>
            </nav>

            <div className="mt-6 pt-6 border-t border-outline-variant hidden lg:block">
              <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
                <span className="font-label-md text-[11px] font-bold text-trust-olive uppercase flex items-center gap-1 mb-1">
                  <Icon name="verified" className="text-sm" /> Verified Origin
                </span>
                <p className="font-body-md text-xs text-on-surface-variant">
                  GPS: 34.02° N, 74.93° E<br />Elevation: 1,574m
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Canvas */}
        <div className="lg:w-3/4 flex flex-col gap-16">
          {/* Saffron Section */}
          {saffron.length > 0 && (
            <section className="scroll-mt-28" id="saffron">
              <div className="mb-6 border-b border-outline-variant pb-3 flex justify-between items-end">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    {CATEGORY_META.saffron.title}
                  </h2>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    {CATEGORY_META.saffron.desc}
                  </p>
                </div>
                <span className="font-label-md text-xs text-trust-olive font-bold flex items-center gap-1 bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant">
                  <Icon name="verified" className="text-xs" /> {CATEGORY_META.saffron.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {saffron.map((p) => (
                  <SaffronCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Dry Fruits Section */}
          {dryFruits.length > 0 && (
            <section className="scroll-mt-28" id="dry-fruits">
              <div className="mb-6 border-b border-outline-variant pb-3 flex justify-between items-end">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    {CATEGORY_META["dry-fruits"].title}
                  </h2>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    {CATEGORY_META["dry-fruits"].desc}
                  </p>
                </div>
                <span className="font-label-md text-xs text-trust-olive font-bold flex items-center gap-1 bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant">
                  <Icon name="eco" className="text-xs" /> {CATEGORY_META["dry-fruits"].badge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {dryFruits.map((p) => (
                  <StandardProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Wellness Section */}
          {wellness.length > 0 && (
            <section className="scroll-mt-28" id="wellness">
              <div className="mb-6 border-b border-outline-variant pb-3 flex justify-between items-end">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    {CATEGORY_META.wellness.title}
                  </h2>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    {CATEGORY_META.wellness.desc}
                  </p>
                </div>
                <span className="font-label-md text-xs text-trust-olive font-bold flex items-center gap-1 bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant">
                  <Icon name="science" className="text-xs" /> {CATEGORY_META.wellness.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {wellness.map((p) => (
                  <StandardProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function SaffronCard({ product }: { product: ProductWithVariants }) {
  const minPrice = Math.min(...product.variants.map((v) => v.price));

  return (
    <div className="bg-surface rounded-xl border border-outline-variant flex flex-col md:flex-row overflow-hidden group shadow-sm">
      <Link
        href={`/product/${product.slug}`}
        className="md:w-1/2 h-64 md:h-auto relative bg-surface-container overflow-hidden shrink-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-trust-olive text-white font-label-md text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
          <Icon name="verified" className="text-xs" />
          {product.harvest_date ? `Harvest: ${product.harvest_date}` : "Fresh Harvest"}
        </div>
      </Link>

      <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-surface-container-lowest">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-caption text-xs font-bold text-trust-olive uppercase">
              Batch #{product.batch_no || "882"}
            </span>
            {product.crocin && (
              <span className="font-caption text-[11px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-bold">
                Crocin: {product.crocin}
              </span>
            )}
          </div>
          <Link
            href={`/product/${product.slug}`}
            className="font-headline-md text-headline-md text-on-surface hover:text-primary transition-colors block mb-2"
          >
            {product.name}
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
            {product.short_desc}
          </p>

          {/* Interactive Weight/Purchase */}
          <div className="mb-6">
            <ProductPurchase
              productId={product.id}
              slug={product.slug}
              name={product.name}
              image={product.image}
              variants={product.variants}
              layout="card"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-between text-xs text-on-surface-variant">
          <span className="flex items-center gap-1 text-trust-olive font-bold">
            <Icon name="description" className="text-sm" /> Lab Verification Included
          </span>
          <Link
            href={`/product/${product.slug}`}
            className="font-label-md text-primary font-bold hover:underline flex items-center gap-0.5"
          >
            Full Details <Icon name="chevron_right" className="text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StandardProductCard({ product }: { product: ProductWithVariants }) {
  const minPrice = Math.min(...product.variants.map((v) => v.price));

  return (
    <div className="group bg-surface rounded-xl border border-outline-variant overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      <Link
        href={`/product/${product.slug}`}
        className="aspect-square bg-surface-container-lowest p-4 flex items-center justify-center overflow-hidden border-b border-outline-variant/40 relative"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-secondary-fixed text-on-secondary-fixed font-label-md text-[10px] font-bold uppercase px-2.5 py-1 rounded-sm shadow-sm">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <span className="font-caption text-xs font-bold text-trust-olive uppercase mb-1">
          {product.origin || "Kashmir Valley"}
        </span>
        <Link
          href={`/product/${product.slug}`}
          className="font-body-md text-body-md font-semibold text-on-surface line-clamp-2 mb-2 group-hover:text-primary transition-colors"
        >
          {product.name}
        </Link>
        <p className="font-body-md text-xs text-on-surface-variant line-clamp-2 mb-4">
          {product.short_desc}
        </p>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="tabular font-price-display text-price-display text-on-surface font-bold">
                {formatINR(minPrice)}
              </span>
              <span className="font-body-md text-xs text-on-surface-variant ml-1">
                / {product.variants[0]?.label || "pack"}
              </span>
            </div>
            {product.reviews_count > 0 && (
              <span className="font-caption text-xs text-on-surface-variant flex items-center gap-0.5">
                <Icon name="star" fill className="text-secondary text-xs" />
                {product.rating.toFixed(1)}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="flex-1 bg-surface hover:bg-surface-container text-primary border border-outline-variant font-label-md py-2.5 rounded-lg transition-colors font-bold text-center text-xs"
            >
              Details
            </Link>
            <QuickAddButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              image={product.image}
              variantLabel={product.variants[0]?.label || ""}
              price={product.variants[0]?.price || minPrice}
              style="solid"
              label="Add"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import ProductPurchase from "@/components/ProductPurchase";
import QuickAddButton from "@/components/QuickAddButton";
import { formatINR } from "@/lib/money";
import { getActiveProducts, type ProductWithVariants } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Shop" };

const CATEGORY_LABELS: Record<string, string> = {
  saffron: "Mongra Saffron",
  "dry-fruits": "Kashmiri Dry Fruits",
  wellness: "Botanical Wellness",
};

export default function ShopPage() {
  const products = getActiveProducts();
  const saffron = products.filter((p) => p.category === "saffron");
  const dryFruits = products.filter((p) => p.category === "dry-fruits");
  const wellness = products.filter((p) => p.category === "wellness");

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
      {/* Page Header */}
      <div className="mb-12 md:mb-20">
        <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-walnut-ink mb-4">
          The Catalog
        </h1>
        <p className="font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-2xl">
          Authentic, traceable goods direct from our physical storefront in
          Pampore. Every batch is documented and verified.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-gutter relative">
        {/* Category Sidebar */}
        <aside className="md:w-1/4 shrink-0">
          <div className="sticky top-32">
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 border-b md:border-b-0 border-outline-variant mb-8 md:mb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`whitespace-nowrap px-4 py-2 md:px-0 md:py-3 font-label-caps text-label-caps md:border-l-2 md:pl-4 transition-colors ${
                    id === "saffron"
                      ? "text-primary border-b-2 border-primary bg-surface-container-low md:bg-transparent md:border-primary"
                      : "text-on-surface-variant hover:text-primary border-b-2 border-transparent hover:border-outline-variant"
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Product Canvas */}
        <div className="md:w-3/4 flex flex-col gap-24">
          {/* Saffron */}
          <section className="scroll-mt-32" id="saffron">
            <div className="mb-8 border-b border-outline-variant pb-4 flex justify-between items-end">
              <h2 className="font-headline-lg text-headline-lg text-walnut-ink">
                {CATEGORY_LABELS.saffron}
              </h2>
              <span className="font-label-caps text-label-caps text-trust-olive flex items-center gap-1 bg-warm-ivory px-2 py-1 rounded">
                <Icon name="verified" className="text-[14px]" />
                Batch Verified
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-unit">
              {saffron.map((p) => (
                <SaffronHeroCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          {/* Dry Fruits */}
          {dryFruits.length > 0 && (
            <section className="scroll-mt-32" id="dry-fruits">
              <div className="mb-8 border-b border-outline-variant pb-4">
                <h2 className="font-headline-lg text-headline-lg text-walnut-ink">
                  {CATEGORY_LABELS["dry-fruits"]}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-unit">
                {dryFruits.map((p) => (
                  <GridProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Wellness */}
          {wellness.length > 0 && (
            <section className="scroll-mt-32" id="wellness">
              <div className="mb-8 border-b border-outline-variant pb-4">
                <h2 className="font-headline-lg text-headline-lg text-walnut-ink">
                  {CATEGORY_LABELS.wellness}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-unit">
                {wellness.map((p) => (
                  <ListProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function SaffronHeroCard({ product }: { product: ProductWithVariants }) {
  return (
    <div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant flex flex-col md:flex-row overflow-hidden group">
      <div className="md:w-1/2 h-64 md:h-auto relative bg-surface-container overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        {product.harvest_date && (
          <div className="absolute top-4 left-4 bg-trust-olive/90 text-white font-label-caps text-label-caps px-3 py-1 rounded-sm shadow-sm backdrop-blur-sm flex items-center gap-1">
            <Icon name="calendar_today" className="text-[14px]" />
            Harvest: {product.harvest_date}
          </div>
        )}
      </div>
      <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between bg-warm-ivory">
        <div>
          <h3 className="font-headline-md text-headline-md text-walnut-ink mb-2">
            {product.name}
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            {product.short_desc}
          </p>
          <ProductPurchase
            productId={product.id}
            slug={product.slug}
            name={product.name}
            image={product.image}
            variants={product.variants}
            layout="card"
          />
        </div>
        {product.batch_no && (
          <p className="mt-3 font-body-md text-[12px] text-trust-olive text-center flex items-center justify-center gap-1">
            <Icon name="description" className="text-[14px]" />
            Batch #{product.batch_no} Verification Included
          </p>
        )}
      </div>
    </div>
  );
}

function GridProductCard({ product }: { product: ProductWithVariants }) {
  const variant = product.variants[0];
  if (!variant) return null;
  return (
    <div className="bg-surface border border-outline-variant flex flex-col group">
      <Link href={`/product/${product.slug}`} className="h-48 bg-surface-container overflow-hidden block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-headline-md text-[20px] text-walnut-ink mb-1">
          {product.name}
        </h3>
        <p className="font-body-md text-[14px] text-on-surface-variant mb-4 line-clamp-2">
          {product.short_desc}
        </p>
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="tabular font-price-display text-[18px] text-walnut-ink">
              {formatINR(variant.price)}{" "}
              <span className="text-[12px] text-on-surface-variant font-normal">
                / {variant.label}
              </span>
            </span>
          </div>
          <QuickAddButton
            productId={product.id}
            slug={product.slug}
            name={product.name}
            image={product.image}
            variantLabel={variant.label}
            price={variant.price}
            style="outline"
          />
        </div>
      </div>
    </div>
  );
}

function ListProductCard({ product }: { product: ProductWithVariants }) {
  const variant = product.variants[0];
  if (!variant) return null;
  return (
    <div className="bg-surface-container-lowest border border-outline-variant flex overflow-hidden group">
      <Link href={`/product/${product.slug}`} className="w-1/3 min-h-full bg-surface-container overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="w-2/3 p-4 flex flex-col justify-center">
        <h3 className="font-headline-md text-[20px] text-walnut-ink mb-1">
          {product.name}
        </h3>
        <p className="font-body-md text-[14px] text-on-surface-variant mb-3 line-clamp-2">
          {product.short_desc}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="tabular font-price-display text-[18px] text-walnut-ink">
            {formatINR(variant.price)}
          </span>
          <QuickAddButton
            productId={product.id}
            slug={product.slug}
            name={product.name}
            image={product.image}
            variantLabel={variant.label}
            price={variant.price}
            style="text"
          />
        </div>
      </div>
    </div>
  );
}

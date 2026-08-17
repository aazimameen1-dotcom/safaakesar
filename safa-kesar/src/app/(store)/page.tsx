import Link from "next/link";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import HeroSlider from "@/components/HeroSlider";
import StorePhotoGallery from "@/components/StorePhotoGallery";
import { formatINR } from "@/lib/money";
import { getActiveProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const products = getActiveProducts();
  const saffron = products.find((p) => p.category === "saffron");
  const bestSellers = products.slice(0, 4);

  return (
    <div className="flex-grow flex flex-col gap-stack-lg w-full">
      {/* ── 1. Hero Section ── */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-4 md:pt-6">
        <HeroSlider>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/30 bg-black/40 backdrop-blur-md mb-6 shadow-sm">
            <Icon name="verified" fill className="text-secondary-fixed text-[16px]" />
            <span className="font-label-md text-xs text-secondary-fixed uppercase tracking-wider">
              {saffron?.batch_no
                ? `Heritage Selection • Batch #${saffron.batch_no} Verified`
                : "Heritage Selection • Lethipora, Pampore"}
            </span>
          </div>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-white mb-4 leading-tight [text-shadow:_0_2px_14px_rgba(0,0,0,0.65)]">
            Pure Artisanal
            <br className="hidden md:block" /> Dry Fruits &amp; Saffron
          </h1>
          <p className="font-body-lg text-body-md md:text-body-lg text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed [text-shadow:_0_1px_10px_rgba(0,0,0,0.65)]">
            Experience the finest Kashmiri Mongra Kesar, royal walnuts, and mamra almonds,
            harvested and tested with radical transparency on NH 44, Pampore.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="bg-secondary-fixed hover:bg-white text-on-secondary-fixed hover:text-primary font-label-md text-label-md px-8 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto shadow-md hover:scale-105 font-bold"
            >
              Shop the Collection
            </Link>
            <Link
              href="/visit"
              className="border border-white/40 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white font-label-md text-label-md px-8 py-3.5 rounded-full transition-all w-full sm:w-auto shadow-sm"
            >
              Visit NH 44 Store
            </Link>
          </div>
        </HeroSlider>
      </section>

      {/* ── 2. Trust Strip ── */}
      <section className="border-y border-outline-variant bg-surface-container-low py-4 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4">
          <a
            href="https://www.google.com/maps/place/Safa+Kesar/@33.9684339,74.9582498,17z/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <Icon name="star" fill className="text-secondary group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-label-md text-xs text-primary font-bold uppercase group-hover:text-secondary transition-colors">
                Google Maps Verified
              </p>
              <p className="font-body-md text-xs text-on-surface-variant">
                4.9★ (156 Verified Reviews)
              </p>
            </div>
          </a>
          <div className="hidden md:block w-px h-6 bg-outline-variant" />
          <Link href="/visit" className="flex items-center gap-3 group">
            <Icon name="storefront" fill className="text-trust-olive group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-label-md text-xs text-primary font-bold uppercase group-hover:text-secondary transition-colors">
                NH 44 Landmark Store
              </p>
              <p className="font-body-md text-xs text-on-surface-variant">
                Open 24 Hours in Lethipora, Pampore
              </p>
            </div>
          </Link>
          <div className="hidden md:block w-px h-6 bg-outline-variant" />
          <div className="flex items-center gap-3">
            <Icon name="verified_user" fill className="text-primary" />
            <div>
              <p className="font-label-md text-xs text-primary font-bold uppercase">
                ISO 3632 Lab Grade
              </p>
              <p className="font-body-md text-xs text-on-surface-variant">
                Crocin &gt; 240 • Zero Adulteration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Featured Categories (Bento Grid) ── */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 w-full">
        <div className="flex justify-between items-end mb-stack-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Featured Collections
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Explore our handpicked artisanal categories directly from Pampore.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-1 font-label-md text-label-md text-primary hover:text-secondary transition-colors"
          >
            View Full Catalog <Icon name="arrow_forward" className="text-sm" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter auto-rows-[220px]">
          {/* Card 1: Nuts & Dry Fruits (Spans 2 cols) */}
          <Link
            href="/shop#dry-fruits"
            className="relative rounded-xl overflow-hidden group md:col-span-2 shadow-sm border border-outline-variant"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/google-maps/safa-kesar-map-05.jpg"
              alt="Premium Kashmiri Walnuts & Almonds"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/85 to-transparent">
              <span className="inline-block px-2.5 py-0.5 bg-secondary-fixed text-on-secondary-fixed font-label-md text-[11px] font-bold rounded-full mb-2">
                Pure Harvest
              </span>
              <h3 className="font-headline-md text-headline-md text-white mb-1">
                Kashmiri Dry Fruits &amp; Nuts
              </h3>
              <p className="font-body-md text-body-md text-white/85">
                Snow-fed Walnuts (Giri), Mamra Almonds &amp; Pecans
              </p>
            </div>
          </Link>

          {/* Card 2: Pure Saffron */}
          <Link
            href="/shop#saffron"
            className="relative rounded-xl overflow-hidden group shadow-sm border border-outline-variant"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/google-maps/safa-kesar-map-04.jpg"
              alt="Pure Kashmiri Mongra Saffron"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/85 to-transparent">
              <h3 className="font-headline-md text-headline-md text-white mb-1">
                Pure Saffron
              </h3>
              <p className="font-body-md text-body-md text-white/85">
                Signature Mongra Kesar
              </p>
            </div>
          </Link>

          {/* Card 3: Botanical Wellness */}
          <Link
            href="/shop#wellness"
            className="relative rounded-xl overflow-hidden group shadow-sm border border-outline-variant"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/google-maps/safa-kesar-map-12.jpg"
              alt="Himalayan Shilajit & Saffron Honey"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/85 to-transparent">
              <h3 className="font-headline-md text-headline-md text-white mb-1">
                Botanical Wellness
              </h3>
              <p className="font-body-md text-body-md text-white/85">
                Pure Shilajit &amp; Saffron Honey
              </p>
            </div>
          </Link>

          {/* Card 4: Lethipora Origin (Spans 2 cols) */}
          <Link
            href="/visit"
            className="relative rounded-xl overflow-hidden group md:col-span-2 shadow-sm border border-outline-variant bg-surface-container-low flex items-center justify-between p-6 md:p-8"
          >
            <div className="z-10 max-w-sm">
              <span className="inline-block px-3 py-1 bg-secondary-fixed text-on-secondary-fixed font-label-md text-xs font-bold rounded-full mb-3">
                Landmark Experience
              </span>
              <h3 className="font-headline-lg text-headline-lg text-primary mb-2">
                Visit Us in Lethipora
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                Taste fresh saffron Kahwa tea and witness batch purity testing in person on NH 44.
              </p>
              <span className="font-label-md text-label-md text-primary flex items-center gap-1 group-hover:text-secondary transition-colors font-bold">
                Get Driving Directions <Icon name="arrow_forward" className="text-sm" />
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/google-maps/safa-kesar-map-01.jpg"
              alt="Safa Kesar Showroom Exterior"
              className="w-36 h-36 md:w-44 md:h-44 object-cover rounded-xl shadow-md border-2 border-white transform group-hover:scale-105 transition-transform duration-500 hidden sm:block"
            />
          </Link>
        </div>
      </section>

      {/* ── 4. Best Sellers (4-Column Grid) ── */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 w-full">
        <div className="flex justify-between items-center mb-stack-md border-b border-outline-variant pb-3">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Best Sellers
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant">
              Customer favorites tested and verified for quality.
            </p>
          </div>
          <Link
            href="/shop"
            className="font-label-md text-label-md text-primary hover:text-secondary transition-colors flex items-center gap-1 font-bold"
          >
            View All <Icon name="arrow_forward" className="text-sm" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {bestSellers.map((product, idx) => {
            const minPrice = Math.min(...product.variants.map((v) => v.price));
            const isTopProduct = idx === 0;

            return (
              <div
                key={product.id}
                className="group bg-surface rounded-xl border border-outline-variant overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col relative"
              >
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`font-label-md text-[10px] font-bold uppercase px-2.5 py-1 rounded-sm shadow-sm ${
                      isTopProduct
                        ? "bg-secondary-fixed text-on-secondary-fixed"
                        : "bg-surface-container-high text-on-surface-variant border border-outline-variant"
                    }`}
                  >
                    {product.badge || (isTopProduct ? "Best Seller" : "Verified")}
                  </span>
                </div>

                {/* Product Image */}
                <Link
                  href={`/product/${product.slug}`}
                  className="aspect-square bg-surface-container-lowest p-4 flex items-center justify-center overflow-hidden border-b border-outline-variant/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded"
                  />
                </Link>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <span className="font-caption text-caption text-trust-olive font-bold uppercase mb-1">
                    {product.category === "saffron"
                      ? "Pampore Mongra"
                      : product.category === "dry-fruits"
                        ? "Kashmiri Harvest"
                        : "Pure Himalayan"}
                  </span>
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-body-md text-body-md font-semibold text-on-surface line-clamp-2 mb-2 group-hover:text-primary transition-colors"
                  >
                    {product.name}
                  </Link>

                  <div className="mt-auto pt-2">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="tabular font-price-display text-price-display text-on-surface font-bold">
                        {formatINR(minPrice)}
                      </span>
                      <span className="font-body-md text-xs text-on-surface-variant">
                        / {product.variants[0]?.label || "pack"}
                      </span>
                    </div>

                    <Link
                      href={`/product/${product.slug}`}
                      className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 font-bold text-center"
                    >
                      <Icon name="add_shopping_cart" className="text-sm" /> Select Options
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. Provenance & Showroom Photo Reel ── */}
      <Reveal>
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <p className="font-label-md text-xs text-trust-olive font-bold uppercase tracking-wider mb-1">
                Visual Proof &amp; Provenance
              </p>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Inside the Pampore Showroom
              </h2>
            </div>
            <Link
              href="/visit"
              className="font-label-md text-primary hover:text-secondary transition-colors flex items-center gap-1 font-bold text-sm"
            >
              Explore Store Tour <Icon name="arrow_forward" className="text-sm" />
            </Link>
          </div>
          <StorePhotoGallery />
        </section>
      </Reveal>

      {/* ── 6. Educational Callout ── */}
      <section className="bg-surface-container-low border-y border-outline-variant py-16 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface text-crocus-purple border border-outline-variant mx-auto mb-2">
            <Icon name="science" className="text-2xl" />
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            How to Spot Real Saffron
          </h2>
          <p className="font-body-lg text-body-md text-on-surface-variant leading-relaxed">
            The saffron market is filled with dyed corn silk and synthetic substitutes.
            Learn the cold water bleed test, thread anatomy, and why genuine Kashmiri Mongra is
            the gold standard.
          </p>
          <div className="pt-2">
            <Link
              href="/education"
              className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md uppercase tracking-wider px-8 py-3.5 rounded-full transition-colors font-bold"
            >
              Read Purity Guide <Icon name="arrow_forward" className="text-sm" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

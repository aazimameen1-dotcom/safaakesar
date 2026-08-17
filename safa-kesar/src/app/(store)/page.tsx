import Link from "next/link";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import HeroSlider from "@/components/HeroSlider";
import TransitionImageFrame from "@/components/TransitionImageFrame";
import { formatINR } from "@/lib/money";
import { getActiveProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const products = getActiveProducts();
  const saffron = products.find((p) => p.category === "saffron");
  const fromPrice = saffron
    ? Math.min(...saffron.variants.map((v) => v.price))
    : null;

  return (
    <>
      {/* Hero with Smooth Image Transitions */}
      <HeroSlider>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-black/40 backdrop-blur-md mb-8 shadow-sm">
          <Icon name="verified" fill className="text-secondary-container text-[16px]" />
          <span className="font-label-caps text-label-caps text-secondary-container uppercase tracking-widest">
            {saffron?.batch_no
              ? `Harvest Batch #${saffron.batch_no} • Verified Provenance`
              : "Radical Transparency"}
          </span>
        </div>
        <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-white mb-6 [text-shadow:_0_2px_14px_rgba(0,0,0,0.65)]">
          Pampore&apos;s Finest Saffron,
          <br className="hidden md:block" /> Directly from the Source.
        </h1>
        <p className="font-body-lg text-body-md md:text-body-lg text-white/95 mb-10 max-w-2xl mx-auto leading-relaxed [text-shadow:_0_1px_10px_rgba(0,0,0,0.65)]">
          Authentic Mongra Kesar from the saffron fields of Lethipora, Pampore.
          Trusted since generations on NH 44. Documented, tested, and delivered
          with radical transparency.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="bg-primary hover:bg-primary-container text-white font-label-caps text-label-caps uppercase tracking-wider px-8 py-4 rounded-full transition-all w-full sm:w-auto shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            Shop Fresh Harvest
          </Link>
          <Link
            href="/visit"
            className="border border-white/40 bg-black/30 hover:bg-black/45 backdrop-blur-md text-white font-label-caps text-label-caps uppercase tracking-wider px-8 py-4 rounded-full transition-all w-full sm:w-auto shadow-md hover:scale-[1.02]"
          >
            Visit Our NH 44 Store
          </Link>
        </div>
      </HeroSlider>

      {/* Trust Strip */}
      <Reveal>
        <section className="border-y border-outline-variant bg-surface-container-low py-6 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4">
            <a
              href="https://www.google.com/maps/place/Safa+Kesar/@33.9684339,74.9582498,17z/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <Icon name="star" fill className="text-secondary group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-label-caps text-label-caps text-walnut-ink uppercase group-hover:text-primary transition-colors">
                  Google Maps
                </p>
                <p className="font-body-md text-sm text-on-surface-variant">
                  4.9★ (156 verified reviews)
                </p>
              </div>
            </a>
            <div className="hidden md:block w-px h-8 bg-outline-variant" />
            <Link href="/visit" className="flex items-center gap-3 group">
              <Icon name="storefront" fill className="text-trust-olive group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-label-caps text-label-caps text-walnut-ink uppercase group-hover:text-primary transition-colors">
                  Physical Showroom
                </p>
                <p className="font-body-md text-sm text-on-surface-variant">
                  Open 24 Hours on NH 44
                </p>
              </div>
            </Link>
            <div className="hidden md:block w-px h-8 bg-outline-variant" />
            <div className="flex items-center gap-3">
              <Icon name="local_shipping" fill className="text-primary" />
              <div>
                <p className="font-label-caps text-label-caps text-walnut-ink uppercase">
                  Global Delivery
                </p>
                <p className="font-body-md text-sm text-on-surface-variant">
                  Shipping Worldwide Securely
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* The Provenance with Transitioning Image Frame */}
      <Reveal>
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-background">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-5 md:col-start-1 order-2 md:order-1">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-walnut-ink mb-6">
                The Provenance of Lethipora
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                True saffron requires specific conditions: well-drained karewa
                soils, cool climates, and generations of specialized knowledge.
                Our Mongra saffron is cultivated exclusively in Lethipora,
                Pampore—the historical heartland of Kashmiri saffron.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
                We reject the artificial luxury narratives. Our focus is on the
                physical reality of the harvest. Every batch we sell is traceable
                back to these specific coordinates.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="inset-card p-4 rounded">
                  <p className="font-label-caps text-[10px] text-trust-olive uppercase mb-1">
                    Origin Coordinates
                  </p>
                  <p className="font-price-display text-price-display text-walnut-ink">
                    34.02° N, 74.93° E
                  </p>
                </div>
                <div className="inset-card p-4 rounded">
                  <p className="font-label-caps text-[10px] text-trust-olive uppercase mb-1">
                    Elevation
                  </p>
                  <p className="font-price-display text-price-display text-walnut-ink">
                    1,574 m
                  </p>
                </div>
              </div>
            </div>
            <div className="md:col-span-6 md:col-start-7 order-1 md:order-2 mb-10 md:mb-0">
              <TransitionImageFrame
                aspectRatio="aspect-[4/5]"
                intervalMs={4500}
                images={[
                  {
                    src: "/google-maps/safa-kesar-map-25.jpg",
                    label: "Karewa Highlands • Lethipora, Pampore",
                    alt: "Golden saffron fields in Lethipora during blooming"
                  },
                  {
                    src: "/google-maps/safa-kesar-map-12.jpg",
                    label: "Dawn Crocus Harvest • October Season",
                    alt: "Fresh purple crocus flowers harvested by hand"
                  },
                  {
                    src: "/google-maps/safa-kesar-map-07.jpg",
                    label: "Pampore Mountain Valley View",
                    alt: "Landscape view of Pampore saffron fields"
                  },
                  {
                    src: "/google-maps/safa-kesar-map-04.jpg",
                    label: "Grade A Crimson Mongra Threads",
                    alt: "Pure Kashmiri saffron threads"
                  }
                ]}
              />
            </div>
          </div>
        </section>
      </Reveal>

      {/* Product Preview (Bento Grid) */}
      <Reveal>
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
          <div className="max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-walnut-ink mb-2">
                  Our Offerings
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Curated from the local harvest.
                </p>
              </div>
              <Link
                href="/shop"
                className="hidden md:flex items-center gap-2 font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors uppercase tracking-wider"
              >
                View Full Shop <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter auto-rows-[300px]">
              {/* Primary product */}
              {saffron && (
                <div className="md:col-span-8 row-span-2 group relative overflow-hidden rounded-xl bg-warm-ivory border border-outline-variant inset-card flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/google-maps/safa-kesar-map-04.jpg"
                      alt={saffron.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="inline-block px-2 py-1 bg-surface-variant text-on-surface-variant font-label-caps text-[10px] uppercase rounded w-max mb-4 border border-outline-variant">
                      Signature
                    </div>
                    <h3 className="font-headline-md text-headline-md text-walnut-ink mb-4">
                      {saffron.name}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                      {saffron.short_desc}
                    </p>
                    <div className="mt-auto">
                      <p className="tabular font-price-display text-price-display text-walnut-ink mb-4">
                        {fromPrice !== null
                          ? `From ${formatINR(fromPrice)} / gram`
                          : ""}
                      </p>
                      <Link
                        href={`/product/${saffron.slug}`}
                        className="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps uppercase tracking-wider px-6 py-3 rounded transition-colors w-full md:w-auto inline-block text-center"
                      >
                        Select Weight
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              {/* Secondary categories */}
              <Link
                href="/shop#dry-fruits"
                className="md:col-span-4 row-span-1 group relative overflow-hidden rounded-xl bg-surface border border-outline-variant flex flex-col"
              >
                <div className="h-3/5 w-full relative border-b border-outline-variant bg-surface-container overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/google-maps/safa-kesar-map-05.jpg"
                    alt="Raw Kashmiri walnuts"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="h-2/5 p-6 flex flex-col justify-center bg-warm-ivory">
                  <h3 className="font-body-lg text-body-lg font-medium text-walnut-ink mb-1">
                    Local Dry Fruits
                  </h3>
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase flex items-center gap-1 group-hover:text-primary transition-colors">
                    Explore Selection <Icon name="arrow_forward" className="text-[14px]" />
                  </p>
                </div>
              </Link>
              <Link
                href="/shop#wellness"
                className="md:col-span-4 row-span-1 group relative overflow-hidden rounded-xl bg-surface border border-outline-variant flex flex-col"
              >
                <div className="h-3/5 w-full relative border-b border-outline-variant bg-surface-container overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/google-maps/safa-kesar-map-08.jpg"
                    alt="Kashmiri Kahwa tea ingredients"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="h-2/5 p-6 flex flex-col justify-center bg-warm-ivory">
                  <h3 className="font-body-lg text-body-lg font-medium text-walnut-ink mb-1">
                    Wellness Blends
                  </h3>
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase flex items-center gap-1 group-hover:text-primary transition-colors">
                    Explore Selection <Icon name="arrow_forward" className="text-[14px]" />
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Real Store Experience & Photos */}
      <Reveal>
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-background border-t border-outline-variant">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-trust-olive/10 text-trust-olive text-xs font-label-caps uppercase tracking-wider mb-3">
                  <Icon name="storefront" className="text-[16px]" />
                  Physical Landmark on NH 44
                </div>
                <h2 className="font-headline-lg text-headline-lg text-walnut-ink">
                  Visit Us in Lethipora, Pampore
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-2">
                  Open 24/7 on the Srinagar-Jammu National Highway. Taste pure saffron, inspect lab reports, and enjoy traditional Kahwa.
                </p>
              </div>
              <Link
                href="/visit"
                className="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps uppercase tracking-wider px-6 py-3.5 rounded transition-colors inline-flex items-center gap-2 self-start md:self-auto shrink-0"
              >
                <span>Store Details &amp; Gallery</span>
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>

            {/* Photo Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { src: "/google-maps/safa-kesar-map-01.jpg", label: "Storefront on NH 44" },
                { src: "/google-maps/safa-kesar-map-03.jpg", label: "Showroom Interior" },
                { src: "/google-maps/safa-kesar-map-02.jpg", label: "Saffron Jars" },
                { src: "/google-maps/safa-kesar-map-12.jpg", label: "Harvest Fields" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href="/visit"
                  className="group relative aspect-square rounded-xl overflow-hidden bg-surface-variant border border-outline-variant"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <span className="font-label-caps text-xs text-white uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Educational CTA */}
      <Reveal>
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface border-y border-outline-variant">
          <div className="max-w-3xl mx-auto text-center">
            <Icon name="science" className="text-crocus-purple text-4xl mb-6" />
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-walnut-ink mb-4">
              How to Spot Real Saffron
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
              The saffron market is filled with imitations. Learn the simple water
              test, the physical characteristics of a true Mongra thread, and why
              authentic Kashmiri saffron rarely comes cheap.
            </p>
            <Link
              href="/education"
              className="border border-walnut-ink text-walnut-ink hover:bg-surface-variant font-label-caps text-label-caps uppercase tracking-wider px-8 py-4 rounded transition-colors"
            >
              Read the Guide
            </Link>
          </div>
        </section>
      </Reveal>
    </>
  );
}

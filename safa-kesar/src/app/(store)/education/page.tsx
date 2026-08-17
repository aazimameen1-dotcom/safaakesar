import type { Metadata } from "next";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "How to Identify Real Saffron" };

export default function EducationPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16 md:space-y-20">
      {/* Header */}
      <header id="origin" className="text-center max-w-3xl mx-auto space-y-6 scroll-mt-32">
        <p className="font-label-caps text-label-caps text-trust-olive tracking-widest uppercase">
          Purity &amp; Provenance
        </p>
        <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-primary">
          How to Identify Real Saffron
        </h1>
        <p className="font-body-lg text-body-md md:text-body-lg text-on-surface-variant">
          The world&apos;s most precious spice is often compromised. Learn the
          definitive physical and chemical markers to verify authentic Kashmiri
          saffron.
        </p>
      </header>

      {/* Bento Grid: The Tests */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* The Bleed Test */}
        <div className="md:col-span-2 bg-surface-container rounded-xl p-8 border border-outline-variant/30 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <Icon name="water_drop" />
              <h2 className="font-headline-md text-headline-md">
                The Bleed Test
              </h2>
            </div>
            <p className="text-on-surface-variant">
              Real saffron releases its color slowly over 10-15 minutes, turning
              water a vibrant golden-yellow. Artificial dyes bleed instantly,
              turning water red or orange.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-background p-4 rounded-lg border border-outline-variant flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-secondary-container opacity-80 mb-2" />
              <span className="font-label-caps text-label-caps text-trust-olive">
                Authentic: Slow Golden
              </span>
            </div>
            <div className="bg-background p-4 rounded-lg border border-outline-variant flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-error-container opacity-80 mb-2" />
              <span className="font-label-caps text-label-caps text-error">
                Fake: Instant Red
              </span>
            </div>
          </div>
        </div>

        {/* Thread Anatomy */}
        <div className="bg-surface-container rounded-xl p-8 border border-outline-variant/30 flex flex-col space-y-4">
          <div className="flex items-center space-x-2 text-primary">
            <Icon name="search" />
            <h2 className="font-headline-md text-headline-md">Thread Anatomy</h2>
          </div>
          <p className="text-on-surface-variant flex-grow">
            Authentic threads are trumpet-shaped, bulging at one end. Uniform,
            straight threads are often synthetic or adulterated floral parts.
          </p>
          <div className="h-32 w-full bg-surface-variant rounded-lg overflow-hidden border border-outline-variant">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/google-maps/safa-kesar-map-21.jpg"
              alt="Macro photograph of a single premium saffron thread showing its trumpet shape"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* The Aroma Profile */}
        <div className="md:col-span-3 bg-surface-container rounded-xl p-8 border border-outline-variant/30 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-2 text-primary">
              <Icon name="air" />
              <h2 className="font-headline-md text-headline-md">
                The Aroma Profile
              </h2>
            </div>
            <p className="text-on-surface-variant">
              Real saffron smells sweet, but never tastes sweet. The aroma is
              complex: a blend of honey and hay, driven by the volatile compound
              Safranal. If it smells like harsh chemicals or has no scent, it is
              not authentic.
            </p>
          </div>
          <div className="flex-1 bg-surface-variant rounded-lg h-48 w-full border border-outline-variant overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/google-maps/safa-kesar-map-08.jpg"
              alt="Authentic saffron and traditional Kashmiri Kahwa preparation"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Mongra Distinction */}
      <section className="border-t border-outline-variant pt-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-headline-lg text-headline-lg text-walnut-ink">
              The &apos;Mongra&apos; Distinction
            </h2>
            <p className="text-on-surface-variant">
              Not all real saffron is equal. Safa Kesar exclusively sources
              &apos;Mongra&apos;—the absolute tip of the stigma. This section
              contains the highest concentration of crocin (color), picrocrocin
              (flavor), and safranal (aroma).
            </p>
            <p className="text-on-surface-variant">
              Lesser grades include the yellow style attached, which adds weight
              but contributes zero culinary or medicinal value.
            </p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-outline-variant">
            <div className="aspect-video bg-surface-container-high rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/google-maps/safa-kesar-map-04.jpg"
                alt="Close-up of pure Mongra saffron stigmas without yellow style"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Certification */}
      <section
        id="certified"
        className="bg-surface-container-low p-8 md:p-12 rounded-xl border border-outline-variant text-center space-y-8 scroll-mt-32"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="font-headline-lg text-headline-lg text-primary">
            Certified Provenance
          </h2>
          <p className="text-on-surface-variant">
            We don&apos;t just ask for your trust; we provide proof. Every batch
            of Safa Kesar undergoes rigorous laboratory testing for ISO 3632
            compliance, ensuring category 1 purity.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: "verified", label: "ISO 3632 Tested" },
            { icon: "science", label: "No Artificial Dyes" },
            { icon: "eco", label: "100% Organic Origin" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-trust-olive rounded text-trust-olive bg-surface font-label-caps text-label-caps"
            >
              <Icon name={badge.icon} fill />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

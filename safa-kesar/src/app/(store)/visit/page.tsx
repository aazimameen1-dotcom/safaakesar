import type { Metadata } from "next";
import Icon from "@/components/Icon";
import StorePhotoGallery from "@/components/StorePhotoGallery";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Visit Us" };

export default function VisitPage() {
  const settings = getSettings();

  return (
    <main className="flex-grow flex flex-col">
      {/* Hero */}
      <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-gutter items-center">
          <div className="flex flex-col space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-trust-olive/10 text-trust-olive text-xs font-label-caps uppercase tracking-wider w-max">
              <Icon name="verified" className="text-[16px]" />
              NH 44 Landmark Store • Lethipora, Pampore
            </div>
            <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-walnut-ink">
              Experience
              <br />
              Pampore&apos;s Finest
            </h1>
            <p className="font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-lg">
              Our physical storefront in the heart of Jammu &amp; Kashmir is open
              24/7. Step inside to witness authentic Kashmiri saffron
              heritage, verify our testing reports in person, and chat directly
              with our experts.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-trust-olive text-white px-6 py-3.5 rounded-full hover:bg-[#4a563b] transition-colors shadow-sm"
              >
                <Icon name="chat" fill className="mr-2" />
                <span className="font-label-caps text-label-caps">
                  Chat with Aadil for Orders
                </span>
              </a>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=33.9684339,74.9582498"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-walnut-ink text-walnut-ink hover:bg-surface-variant px-6 py-3.5 rounded-full font-label-caps text-label-caps transition-colors"
              >
                <Icon name="directions" className="mr-2 text-[18px]" />
                <span>Get Driving Directions</span>
              </a>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-[540px] w-full rounded-2xl overflow-hidden bg-surface-variant border border-outline-variant shadow-sm group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/google-maps/safa-kesar-map-01.jpg"
              alt="The Safa Kesar storefront exterior in Lethipora, Pampore along NH 44"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-lg border border-outline-variant shadow-sm flex items-center gap-2">
              <Icon name="photo_camera" className="text-[16px] text-trust-olive" />
              <span className="font-label-caps text-xs text-walnut-ink">
                Safa Kesar Main Storefront • Lethipora
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Details & Map */}
      <section className="w-full bg-surface-container-low py-12 md:py-20 border-y border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-gutter">
            {/* Contact card */}
            <div className="md:col-span-5 bg-surface rounded-xl p-8 border border-outline-variant flex flex-col space-y-8 shadow-sm">
              <div>
                <h2 className="font-headline-lg text-headline-lg mb-6 text-walnut-ink">
                  Store Information
                </h2>
                <div className="flex items-start space-x-4 mb-6">
                  <Icon name="location_on" className="text-trust-olive mt-1" />
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                      Address
                    </p>
                    <p className="font-body-md text-body-md whitespace-pre-line">
                      {settings.store_address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 mb-6">
                  <Icon name="schedule" className="text-trust-olive mt-1" />
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                      Hours
                    </p>
                    <p className="font-body-md text-body-md">
                      Open 24 Hours
                      <br />
                      7 Days a week (Open All Year)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Icon name="call" className="text-trust-olive mt-1" />
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                      Phone
                    </p>
                    <p className="font-body-md text-body-md">{settings.store_phone}</p>
                  </div>
                </div>
              </div>
              <div className="mt-auto border border-trust-olive/30 bg-trust-olive/5 rounded-lg p-4 flex items-center space-x-3">
                <Icon name="verified" className="text-trust-olive" />
                <span className="font-label-caps text-label-caps text-trust-olive">
                  Verified Coordinates: 33.9684° N, 74.9582° E
                </span>
              </div>
            </div>

            {/* Map + gallery */}
            <div className="md:col-span-7 grid grid-rows-2 gap-6 lg:gap-gutter md:h-[600px]">
              <div className="row-span-1 rounded-xl overflow-hidden relative border border-outline-variant min-h-[280px]">
                <iframe
                  title="Safa Kesar store location — NH 44, Lethipora, Pampore"
                  src="https://www.google.com/maps?q=33.9684339,74.9582498&z=15&output=embed"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=33.9684339,74.9582498"
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-outline-variant shadow-sm flex items-center space-x-2 hover:border-primary transition-colors"
                >
                  <Icon name="directions" className="text-[18px] text-primary" />
                  <span className="font-label-caps text-label-caps text-walnut-ink">
                    Get Directions
                  </span>
                </a>
              </div>
              <div className="row-span-1 grid grid-cols-2 gap-6 lg:gap-gutter">
                <div className="rounded-xl overflow-hidden bg-surface-variant relative border border-outline-variant group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/google-maps/safa-kesar-map-03.jpg"
                    alt="Safa Kesar store interior display with saffron jars"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-label-caps uppercase">
                    Store Showroom
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden bg-surface-variant relative border border-outline-variant group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/google-maps/safa-kesar-map-05.jpg"
                    alt="Kashmiri walnuts, almonds, and dry fruits counter inside Safa Kesar"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-label-caps uppercase">
                    Dry Fruits Selection
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Google Maps Gallery Section */}
      <section className="w-full py-16 md:py-24 px-margin-mobile md:px-margin-desktop bg-background">
        <div className="max-w-container-max mx-auto">
          <StorePhotoGallery
            title="Live Gallery from our NH 44 Storefront"
            subtitle="Authentic photos from our Google Maps listing showing our store, harvest, and local heritage in Lethipora, Pampore."
          />
        </div>
      </section>
    </main>
  );
}


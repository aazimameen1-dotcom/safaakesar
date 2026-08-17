"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

export interface GalleryPhoto {
  id: number;
  src: string;
  title: string;
  category: "store" | "harvest" | "products" | "experience";
  caption?: string;
}

export const GOOGLE_MAPS_PHOTOS: GalleryPhoto[] = [
  {
    id: 1,
    src: "/google-maps/safa-kesar-map-01.jpg",
    title: "Safa Kesar Storefront on NH 44",
    category: "store",
    caption: "Our main entrance and showroom in Lethipora, Pampore along the National Highway."
  },
  {
    id: 2,
    src: "/google-maps/safa-kesar-map-02.jpg",
    title: "Saffron Glass Jars & Packaging",
    category: "products",
    caption: "Freshly packed and sealed Mongra saffron ready for direct verification."
  },
  {
    id: 3,
    src: "/google-maps/safa-kesar-map-03.jpg",
    title: "Showroom Interior & Display",
    category: "store",
    caption: "Traditional wooden shelves curated with organic Kashmiri dry fruits and pure saffron."
  },
  {
    id: 4,
    src: "/google-maps/safa-kesar-map-04.jpg",
    title: "Pure Mongra Stigmas",
    category: "harvest",
    caption: "Deep crimson Kashmiri saffron threads without yellow style or artificial coloring."
  },
  {
    id: 5,
    src: "/google-maps/safa-kesar-map-05.jpg",
    title: "Dry Fruits & Walnut Display",
    category: "products",
    caption: "Kashmiri Kagzi walnuts and Giri directly harvested from local valley orchards."
  },
  {
    id: 6,
    src: "/google-maps/safa-kesar-map-06.jpg",
    title: "Authentic Saffron Tasting",
    category: "experience",
    caption: "In-store water bleed test demonstration for visitors and travelers on NH 44."
  },
  {
    id: 7,
    src: "/google-maps/safa-kesar-map-07.jpg",
    title: "Pampore Saffron Landscape",
    category: "harvest",
    caption: "The high-altitude karewa plateau of Lethipora during autumn crocus blooming."
  },
  {
    id: 8,
    src: "/google-maps/safa-kesar-map-08.jpg",
    title: "Traditional Kashmiri Kahwa Counter",
    category: "experience",
    caption: "Freshly brewed saffron kahwa served to travelers stopping by our Pampore store."
  },
  {
    id: 9,
    src: "/google-maps/safa-kesar-map-09.jpg",
    title: "Storefront Daytime Panorama",
    category: "store",
    caption: "Welcome to Safa Kesar — open 24/7 with authentic saffron & dry fruits."
  },
  {
    id: 10,
    src: "/google-maps/safa-kesar-map-10.jpg",
    title: "Mamra Almonds & Kernels",
    category: "products",
    caption: "Nutrient-dense raw Kashmiri Mamra almonds on physical display."
  },
  {
    id: 11,
    src: "/google-maps/safa-kesar-map-11.jpg",
    title: "Certified Batch Packaging",
    category: "products",
    caption: "Tamper-evident glass bottles with sealed batch verification certificates."
  },
  {
    id: 12,
    src: "/google-maps/safa-kesar-map-12.jpg",
    title: "Crocus Flower Harvest",
    category: "harvest",
    caption: "Hand-harvesting fresh purple saffron crocus blossoms at dawn in Lethipora."
  },
  {
    id: 13,
    src: "/google-maps/safa-kesar-map-13.jpg",
    title: "Apothecary & Himalayan Shilajit",
    category: "products",
    caption: "Purified high-altitude Shilajit resin and pure Kashmiri rose water."
  },
  {
    id: 14,
    src: "/google-maps/safa-kesar-map-14.jpg",
    title: "Batch Quality Inspection",
    category: "harvest",
    caption: "Manual sorting to isolate only the Grade A Mongra stigmas."
  },
  {
    id: 15,
    src: "/google-maps/safa-kesar-map-15.jpg",
    title: "Visitor Welcome Lounge",
    category: "store",
    caption: "Warm hospitality and guidance on identifying authentic Kashmiri heritage."
  },
  {
    id: 16,
    src: "/google-maps/safa-kesar-map-16.jpg",
    title: "Signature Saffron Gift Boxes",
    category: "products",
    caption: "Luxury wooden and acrylic presentation boxes for authentic gifting."
  },
  {
    id: 17,
    src: "/google-maps/safa-kesar-map-17.jpg",
    title: "Store Interior Panoramic View",
    category: "store",
    caption: "Extensive selection of valley walnuts, almonds, dried figs, and saffron."
  },
  {
    id: 18,
    src: "/google-maps/safa-kesar-map-18.jpg",
    title: "Fresh Harvest Display",
    category: "harvest",
    caption: "Freshly dried threads with rich aroma and high safranal concentration."
  },
  {
    id: 19,
    src: "/google-maps/safa-kesar-map-19.jpg",
    title: "Traditional Samovar Heritage",
    category: "experience",
    caption: "Hand-engraved copper samovars brewing traditional Kashmiri saffron tea."
  },
  {
    id: 20,
    src: "/google-maps/safa-kesar-map-20.jpg",
    title: "Highway Landmark NH 44",
    category: "store",
    caption: "Located conveniently on the Srinagar-Jammu National Highway at Lethipora."
  },
  {
    id: 21,
    src: "/google-maps/safa-kesar-map-21.jpg",
    title: "Pure Saffron Threads Macro",
    category: "harvest",
    caption: "Botanical clarity showing trumpet-shaped dark crimson tips."
  },
  {
    id: 22,
    src: "/google-maps/safa-kesar-map-22.jpg",
    title: "Organic Dry Fruits Selection",
    category: "products",
    caption: "Wild Kashmiri walnuts, apricots, and hand-picked pine nuts."
  },
  {
    id: 23,
    src: "/google-maps/safa-kesar-map-23.jpg",
    title: "Authenticity Testing Counter",
    category: "experience",
    caption: "Direct glass beaker testing station for in-person customers."
  },
  {
    id: 24,
    src: "/google-maps/safa-kesar-map-24.jpg",
    title: "Storefront Evening Ambience",
    category: "store",
    caption: "Warmly lit and welcoming travelers 24 hours a day on NH 44."
  },
  {
    id: 25,
    src: "/google-maps/safa-kesar-map-25.jpg",
    title: "Golden Saffron Fields of Pampore",
    category: "harvest",
    caption: "The legendary karewa soils of Kashmir, home to Safa Kesar for generations."
  }
];

const CATEGORIES = [
  { id: "all", label: "All Photos" },
  { id: "store", label: "Store on NH 44" },
  { id: "harvest", label: "Harvest & Fields" },
  { id: "products", label: "Products & Jars" },
  { id: "experience", label: "Visitor Experience" },
] as const;

export default function StorePhotoGallery({
  limit,
  showFilters = true,
  title = "Real Photos from our Google Maps Listing",
  subtitle = "Directly from our physical storefront on NH 44, Lethipora, Pampore (4.9 ★ with 150+ reviews)"
}: {
  limit?: number;
  showFilters?: boolean;
  title?: string;
  subtitle?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const filteredPhotos = GOOGLE_MAPS_PHOTOS.filter((photo) => {
    if (selectedCategory === "all") return true;
    return photo.category === selectedCategory;
  });

  const displayPhotos = limit ? filteredPhotos.slice(0, limit) : filteredPhotos;

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-trust-olive/10 text-trust-olive text-[11px] font-label-caps uppercase tracking-wider mb-2">
            <Icon name="photo_camera" className="text-[14px]" />
            Verified Google Maps Gallery
          </div>
          <h2 className="font-headline-lg text-headline-lg text-walnut-ink">
            {title}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
            {subtitle}
          </p>
        </div>

        <a
          href="https://www.google.com/maps/place/Safa+Kesar/@33.9684339,74.9582498,17z/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-container font-label-caps text-label-caps uppercase tracking-wider text-sm transition-colors shrink-0"
        >
          <span>View on Google Maps</span>
          <Icon name="open_in_new" className="text-[16px]" />
        </a>
      </div>

      {/* Filter Tabs */}
      {showFilters && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-outline-variant [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-label-caps text-label-caps text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container hover:bg-surface-variant text-on-surface-variant"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {displayPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-surface-variant border border-outline-variant cursor-pointer shadow-sm hover:shadow-md transition-all hover:border-primary"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
              <span className="font-label-caps text-[10px] uppercase text-primary-container font-semibold">
                {photo.category}
              </span>
              <p className="font-body-md text-xs font-medium line-clamp-1">
                {photo.title}
              </p>
            </div>
            <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <Icon name="zoom_in" className="text-[16px]" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-surface rounded-xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container">
              <div>
                <h3 className="font-headline-md text-headline-md text-walnut-ink">
                  {activePhoto.title}
                </h3>
                <span className="font-label-caps text-[10px] text-trust-olive uppercase tracking-wider">
                  Photo #{activePhoto.id} from Safa Kesar Google Maps
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                aria-label="Close photo preview"
                className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors cursor-pointer"
              >
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                className="max-h-[65vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Modal Footer */}
            {activePhoto.caption && (
              <div className="p-4 bg-surface-container-low border-t border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="font-body-md text-sm text-on-surface-variant">
                  {activePhoto.caption}
                </p>
                <a
                  href="https://www.google.com/maps/place/Safa+Kesar/@33.9684339,74.9582498,17z/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-xs uppercase px-4 py-2 rounded transition-colors whitespace-nowrap inline-flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Google Maps Listing</span>
                  <Icon name="open_in_new" className="text-[14px]" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

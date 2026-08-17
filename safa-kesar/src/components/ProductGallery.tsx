"use client";

import { useState } from "react";
import Icon from "./Icon";

export default function ProductGallery({
  images,
  name,
  originBadge,
}: {
  images: string[];
  name: string;
  originBadge?: string;
}) {
  const [active, setActive] = useState(0);
  const safeImages = images.length > 0 ? images : [""];
  const activeImage = safeImages[active];

  return (
    <div>
      {/* Desktop: masonry-lite — main image + secondary squares */}
      <div className="hidden md:grid grid-cols-2 gap-gutter">
        <div className="col-span-2 relative aspect-[16/10] bg-surface-container rounded-lg overflow-hidden border border-outline-variant">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage}
            alt={name}
            className="w-full h-full object-cover mix-blend-multiply"
          />
          {originBadge && (
            <div className="absolute bottom-4 left-4 glass-panel px-3 py-1.5 rounded flex items-center gap-1.5">
              <Icon name="location_on" fill className="text-[14px] text-trust-olive" />
              <span className="font-label-caps text-[10px] uppercase text-walnut-ink tracking-wider">
                {originBadge}
              </span>
            </div>
          )}
        </div>
        {safeImages.slice(1).map((img, i) => (
          <button
            key={img + i}
            onClick={() => setActive(i + 1)}
            aria-label={`View image ${i + 2}`}
            className={`relative aspect-square bg-surface-container rounded-lg overflow-hidden border transition-colors ${
              active === i + 1 ? "border-primary" : "border-outline-variant hover:border-outline"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`${name} view ${i + 2}`}
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </button>
        ))}
      </div>

      {/* Mobile: image + thumbnail strip */}
      <div className="md:hidden">
        <div className="relative aspect-[4/3] bg-surface-container rounded-lg overflow-hidden border border-outline-variant mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage}
            alt={name}
            className="w-full h-full object-cover mix-blend-multiply"
          />
          {originBadge && (
            <div className="absolute bottom-3 left-3 glass-panel px-3 py-1.5 rounded flex items-center gap-1.5">
              <Icon name="location_on" fill className="text-[14px] text-trust-olive" />
              <span className="font-label-caps text-[10px] uppercase text-walnut-ink tracking-wider">
                {originBadge}
              </span>
            </div>
          )}
        </div>
        {safeImages.length > 1 && (
          <div className="flex gap-2">
            {safeImages.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-16 w-16 bg-surface-container rounded overflow-hidden border ${
                  active === i ? "border-primary" : "border-outline-variant"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/Icon";

export interface FrameImage {
  src: string;
  label: string;
  alt: string;
}

export default function TransitionImageFrame({
  images,
  intervalMs = 4500,
  aspectRatio = "aspect-[4/5]"
}: {
  images: FrameImage[];
  intervalMs?: number;
  aspectRatio?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <div className={`relative w-full ${aspectRatio} bg-surface-container rounded-2xl overflow-hidden border border-outline-variant shadow-md group`}>
      {images.map((img, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={img.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              className={`w-full h-full object-cover transition-transform duration-[5000ms] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        );
      })}

      {/* Floating Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-surface/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-outline-variant shadow-sm text-xs font-label-caps text-walnut-ink flex items-center gap-1.5">
          <Icon name="verified" className="text-[14px] text-trust-olive" />
          <span>{images[currentIndex].label}</span>
        </div>

        {/* Indicator dots */}
        {images.length > 1 && (
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-4 bg-primary" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

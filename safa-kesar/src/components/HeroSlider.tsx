"use client";

import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/Icon";

export interface HeroSlide {
  image: string;
  badge: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    image: "/google-maps/safa-kesar-map-01.jpg",
    badge: "NH 44 Landmark Showroom • Lethipora, Pampore",
    alt: "Safa Kesar storefront on National Highway 44"
  },
  {
    image: "/google-maps/safa-kesar-map-25.jpg",
    badge: "Pampore Saffron Valley • Karewa Highlands",
    alt: "Golden saffron fields of Lethipora during autumn harvest"
  },
  {
    image: "/google-maps/safa-kesar-map-03.jpg",
    badge: "Authentic Saffron & Dry Fruits Showroom",
    alt: "Inside Safa Kesar store with traditional wooden displays"
  },
  {
    image: "/google-maps/safa-kesar-map-12.jpg",
    badge: "October Crocus Blossom Harvest",
    alt: "Handpicking fresh purple saffron flowers at dawn"
  },
  {
    image: "/google-maps/safa-kesar-map-04.jpg",
    badge: "Grade A Kashmiri Mongra Stigmas",
    alt: "Pure deep crimson Mongra saffron threads"
  },
  {
    image: "/google-maps/safa-kesar-map-08.jpg",
    badge: "Traditional Saffron Kahwa Experience",
    alt: "Brewing fresh Kashmiri saffron tea on NH 44"
  }
];

export default function HeroSlider({
  children
}: {
  children?: React.ReactNode;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  return (
    <div
      className="relative min-h-[640px] md:min-h-[920px] flex items-center justify-center overflow-hidden px-margin-mobile md:px-margin-desktop py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Slides with Smooth Crossfade */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#1A120B]">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.alt}
                className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          );
        })}

        {/* Natural Lighting Overlay: Balanced warmth without heavy darkening or white washout */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/45 via-black/15 to-black/30" />
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/25 via-transparent to-black/40" />
      </div>

      {/* Hero Content Foreground */}
      <div className="relative z-30 max-w-3xl mx-auto text-center">
        {children}

        {/* Slider Controls & Live Slide Badge */}
        <div className="mt-12 flex flex-col items-center gap-4">
          {/* Active Image Caption Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-label-caps text-white/95 shadow-md transition-all">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
            <span>{HERO_SLIDES[currentIndex].badge}</span>
          </div>

          {/* Navigation Dots and Arrows */}
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-md">
            <button
              onClick={prevSlide}
              aria-label="Previous image"
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <Icon name="chevron_left" className="text-[18px]" />
            </button>

            <div className="flex items-center gap-1.5">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    idx === currentIndex
                      ? "w-6 bg-secondary-container"
                      : "w-1.5 bg-white/40 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next image"
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <Icon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

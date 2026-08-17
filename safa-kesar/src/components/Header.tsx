"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import Icon from "./Icon";

const NAV = [
  { href: "/shop", label: "Shop Catalog", match: ["/shop"] },
  { href: "/shop#saffron", label: "Pure Saffron", match: ["/product"] },
  { href: "/education", label: "Purity & Tests", match: ["/education"] },
  { href: "/visit", label: "Our Heritage & Store", match: ["/visit"] },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, openDrawer, mounted } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <>
      {/* TopNavBar (Web) */}
      <header className="bg-surface/95 backdrop-blur-md border-b border-outline-variant sticky top-0 z-50 transition-all duration-300">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-3.5 max-w-container-max mx-auto">
          {/* Brand Logo & Search */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link
              href="/"
              className="font-headline-md text-headline-md font-bold text-kesar-deep-red tracking-tight flex items-center gap-2"
            >
              <Icon name="spa" fill className="text-secondary" />
              Safa Kesar
            </Link>

            {/* Search Input (Desktop) */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-1.5 border border-outline-variant focus-within:border-primary transition-colors"
            >
              <Icon name="search" className="text-outline mr-2 text-[18px]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pure saffron, walnuts, almonds..."
                className="bg-transparent border-none outline-none focus:ring-0 text-body-md font-body-md w-56 lg:w-72 text-on-surface placeholder:text-outline text-sm"
              />
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV.map((item) => {
              const active = item.match.some((m) => pathname.startsWith(m));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`font-label-md text-label-md transition-colors duration-200 ${
                    active
                      ? "text-primary border-b-2 border-primary pb-1 font-bold"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Trailing Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/visit"
              className="hidden sm:flex p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors"
              title="Visit NH 44 Store"
            >
              <Icon name="storefront" className="text-[20px]" />
            </Link>

            <button
              onClick={openDrawer}
              className="flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-full hover:bg-primary-container transition-colors shadow-sm relative"
              aria-label="Open Cart"
            >
              <Icon name="shopping_cart" className="text-[18px]" />
              <span className="hidden sm:inline">Cart</span>
              {mounted && count > 0 && (
                <span className="tabular bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold px-2 py-0.5 rounded-full ml-1">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant z-50 pb-safe shadow-lg">
        <div className="flex justify-around items-center py-2">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 ${
              pathname === "/" ? "text-primary font-bold" : "text-on-surface-variant"
            }`}
          >
            <span
              className={`material-symbols-outlined rounded-full px-3 py-1 ${
                pathname === "/" ? "bg-secondary-container text-on-secondary-container" : ""
              }`}
              style={pathname === "/" ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              home
            </span>
            <span className="font-label-caps text-[10px] uppercase">Home</span>
          </Link>
          <Link
            href="/shop"
            className={`flex flex-col items-center gap-1 transition-colors ${
              pathname.startsWith("/shop") || pathname.startsWith("/product")
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined px-3 py-1">grid_view</span>
            <span className="font-label-caps text-[10px] uppercase">Catalog</span>
          </Link>
          <Link
            href="/education"
            className={`flex flex-col items-center gap-1 transition-colors ${
              pathname.startsWith("/education")
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined px-3 py-1">science</span>
            <span className="font-label-caps text-[10px] uppercase">Purity</span>
          </Link>
          <Link
            href="/visit"
            className={`flex flex-col items-center gap-1 transition-colors ${
              pathname.startsWith("/visit")
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined px-3 py-1">location_on</span>
            <span className="font-label-caps text-[10px] uppercase">Visit</span>
          </Link>
          <button
            onClick={openDrawer}
            className="flex flex-col items-center gap-1 text-on-surface-variant relative"
          >
            <span className="material-symbols-outlined px-3 py-1">shopping_cart</span>
            {mounted && count > 0 && (
              <span className="tabular absolute top-0 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-[9px] font-bold px-1">
                {count}
              </span>
            )}
            <span className="font-label-caps text-[10px] uppercase">Cart</span>
          </button>
        </div>
      </nav>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import Icon from "./Icon";

const NAV = [
  { href: "/shop#saffron", label: "Our Saffron", match: ["/product"] },
  { href: "/shop", label: "Shop", match: ["/shop"] },
  { href: "/education", label: "Education", match: ["/education"] },
  { href: "/visit", label: "Visit Us", match: ["/visit"] },
];

export default function Header() {
  const pathname = usePathname();
  const { count, openDrawer, mounted } = useCart();

  return (
    <>
      {/* Web nav */}
      <header className="hidden md:flex bg-background border-b border-outline-variant sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-desktop py-4 max-w-container-max mx-auto">
          <Link
            href="/"
            className="font-headline-md text-headline-md font-bold text-primary"
          >
            Safa Kesar
          </Link>
          <nav className="flex gap-8">
            {NAV.map((item) => {
              const active = item.match.some((m) => pathname.startsWith(m));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`font-body-lg text-body-lg transition-colors ${
                    active
                      ? "text-primary border-b-2 border-primary pb-1 opacity-80"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-6">
            <button
              onClick={openDrawer}
              className="relative text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Open cart"
            >
              <Icon name="shopping_bag" />
              {mounted && count > 0 && (
                <span className="tabular absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-label-caps text-[9px] text-on-primary">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={openDrawer}
              className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors uppercase tracking-wider"
            >
              Cart
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-low border-t border-outline-variant z-50">
        <div className="flex justify-around items-center py-2">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 ${
              pathname === "/" ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <span
              className={`material-symbols-outlined rounded-full px-4 py-1 ${
                pathname === "/" ? "bg-secondary-container text-on-secondary-container" : ""
              }`}
              style={pathname === "/" ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              home
            </span>
            <span className="font-label-caps text-[10px] uppercase font-bold">Home</span>
          </Link>
          <Link
            href="/shop"
            className={`flex flex-col items-center gap-1 transition-colors ${
              pathname.startsWith("/shop") || pathname.startsWith("/product")
                ? "text-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined px-4 py-1">storefront</span>
            <span className="font-label-caps text-[10px] uppercase">Shop</span>
          </Link>
          <Link
            href="/education"
            className={`flex flex-col items-center gap-1 transition-colors ${
              pathname.startsWith("/education")
                ? "text-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined px-4 py-1">menu_book</span>
            <span className="font-label-caps text-[10px] uppercase">Education</span>
          </Link>
          <button
            onClick={openDrawer}
            className="flex flex-col items-center gap-1 text-on-surface-variant relative"
          >
            <span className="material-symbols-outlined px-4 py-1">shopping_bag</span>
            {mounted && count > 0 && (
              <span className="tabular absolute top-0 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-label-caps text-[9px] text-on-primary">
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/products", label: "Products & Stock", icon: "inventory_2" },
  { href: "/admin/orders", label: "Orders & Shipping", icon: "receipt_long" },
  { href: "/admin/coupons", label: "Coupons & Promo", icon: "confirmation_number" },
  { href: "/admin/reviews", label: "Customer Reviews", icon: "rate_review" },
  { href: "/admin/gallery", label: "Photo Gallery", icon: "photo_library" },
  { href: "/admin/settings", label: "Store Settings", icon: "settings" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 whitespace-nowrap px-4 py-2.5 rounded-lg font-label-md text-xs font-bold uppercase tracking-wider transition-colors ${
              active
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
            }`}
          >
            <Icon name={link.icon} fill={active} className="text-[18px]" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

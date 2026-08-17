"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/products", label: "Products", icon: "inventory_2" },
  { href: "/admin/orders", label: "Orders", icon: "receipt_long" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 whitespace-nowrap px-4 py-2.5 rounded font-label-caps text-label-caps uppercase tracking-wider transition-colors ${
              active
                ? "bg-primary text-on-primary"
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

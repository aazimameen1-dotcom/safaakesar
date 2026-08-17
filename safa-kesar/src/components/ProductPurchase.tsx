"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatINR } from "@/lib/money";
import Icon from "./Icon";

export type PurchasableVariant = { label: string; price: number };

/**
 * Weight/variant selector + live price + Add to Cart.
 * Used on the product detail page and the shop's saffron hero card.
 */
export default function ProductPurchase({
  productId,
  slug,
  name,
  image,
  variants,
  layout = "pdp",
}: {
  productId: number;
  slug: string;
  name: string;
  image: string;
  variants: PurchasableVariant[];
  layout?: "pdp" | "card";
}) {
  const [selected, setSelected] = useState(
    variants[Math.min(1, Math.max(0, variants.length - 1))]?.label ?? ""
  );
  const { addItem } = useCart();
  const variant = variants.find((v) => v.label === selected) ?? variants[0];

  if (!variant) return null;

  return (
    <div className="space-y-4">
      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span
          id="dynamic-price"
          className="tabular font-headline-md text-2xl md:text-3xl font-bold text-on-surface"
        >
          {formatINR(variant.price)}
        </span>
        <span className="font-body-md text-sm text-on-surface-variant">
          / <span id="dynamic-unit" className="font-bold text-primary">{variant.label}</span>
        </span>
      </div>

      {/* Weight selector */}
      <div>
        <p className="font-label-md text-xs font-bold text-on-surface uppercase mb-2">
          Select Quantity / Weight
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select weight">
          {variants.map((v) => (
            <button
              key={v.label}
              onClick={() => setSelected(v.label)}
              aria-pressed={v.label === selected}
              className={`tabular min-w-[54px] px-3.5 py-2 rounded-lg font-label-md text-xs font-bold uppercase transition-all duration-200 ${
                v.label === selected
                  ? "border-2 border-primary bg-primary text-on-primary shadow-sm"
                  : "border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className="font-body-md text-[11px] text-on-surface-variant mt-2">
          Tax included. Free shipping on orders above ₹2,000.
        </p>
      </div>

      {/* Add to cart */}
      <button
        onClick={() =>
          addItem({
            productId,
            slug,
            name,
            variantLabel: variant.label,
            unitPrice: variant.price,
            image,
          })
        }
        className={`flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm uppercase tracking-wider py-3.5 rounded-lg transition-colors font-bold shadow-sm hover:shadow ${
          layout === "pdp" ? "w-full px-8" : "w-full md:w-auto px-8"
        }`}
      >
        <Icon name="add_shopping_cart" className="text-[18px]" />
        Add to Cart
      </button>
    </div>
  );
}

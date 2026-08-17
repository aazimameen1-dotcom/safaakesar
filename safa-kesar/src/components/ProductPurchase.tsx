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
    <div className="space-y-5">
      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span
          id="dynamic-price"
          className="tabular font-price-display text-[28px] leading-8 font-semibold text-walnut-ink"
        >
          {formatINR(variant.price)}
        </span>
        <span className="font-body-md text-body-md text-on-surface-variant">
          / <span id="dynamic-unit">{variant.label}</span>
        </span>
      </div>

      {/* Weight selector */}
      <div>
        <p className="font-label-caps text-label-caps text-walnut-ink uppercase mb-2">
          Select Weight
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select weight">
          {variants.map((v) => (
            <button
              key={v.label}
              onClick={() => setSelected(v.label)}
              aria-pressed={v.label === selected}
              className={`tabular min-w-[56px] border px-4 py-2 font-label-caps text-label-caps uppercase transition-colors ${
                v.label === selected
                  ? "border-primary bg-primary text-on-primary"
                  : "border-outline-variant bg-warm-ivory text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className="font-body-md text-xs text-on-surface-variant mt-2">
          Tax included. Shipping calculated at checkout.
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
        className={`flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps uppercase tracking-wider transition-colors ${
          layout === "pdp" ? "w-full px-8 py-4" : "w-full md:w-auto px-8 py-4"
        }`}
      >
        <Icon name="add_shopping_cart" className="text-[18px]" />
        Add to Cart
      </button>
    </div>
  );
}

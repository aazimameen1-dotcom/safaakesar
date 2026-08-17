"use client";

import { useCart } from "./CartProvider";
import Icon from "./Icon";

export default function QuickAddButton({
  productId,
  slug,
  name,
  image,
  variantLabel,
  price,
  style = "solid",
  label = "Add to Cart",
}: {
  productId: number;
  slug: string;
  name: string;
  image: string;
  variantLabel: string;
  price: number;
  style?: "solid" | "outline" | "text";
  label?: string;
}) {
  const { addItem } = useCart();

  if (style === "text") {
    return (
      <button
        onClick={() =>
          addItem({ productId, slug, name, variantLabel, unitPrice: price, image })
        }
        className="text-primary font-label-caps text-label-caps hover:text-primary-container transition-colors uppercase tracking-wider flex items-center gap-1"
      >
        Add <Icon name="add_circle" className="text-[16px]" />
      </button>
    );
  }

  return (
    <button
      onClick={() =>
        addItem({ productId, slug, name, variantLabel, unitPrice: price, image })
      }
      className={
        style === "outline"
          ? "w-full border border-walnut-ink text-walnut-ink font-label-caps text-label-caps py-2 rounded-sm uppercase tracking-wider hover:bg-walnut-ink hover:text-warm-ivory transition-colors"
          : "bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps px-6 py-3 rounded transition-colors inline-flex items-center gap-2"
      }
    >
      {label}
    </button>
  );
}

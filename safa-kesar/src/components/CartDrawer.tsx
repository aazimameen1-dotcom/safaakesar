"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatINR } from "@/lib/money";
import Icon from "./Icon";

export default function CartDrawer({
  freeShippingThreshold,
}: {
  freeShippingThreshold: number; // paise
}) {
  const { items, subtotal, count, drawerOpen, closeDrawer, setQty, removeItem, mounted } =
    useCart();

  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-walnut-ink/30 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 z-[70] flex h-full w-full max-w-[480px] flex-col bg-background border-l border-outline-variant shadow-xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-outline-variant px-6 py-5">
          <h2 className="font-headline-md text-headline-md text-walnut-ink">
            Cart{" "}
            <span className="font-body-md text-body-md text-on-surface-variant">
              · {mounted ? count : 0} {count === 1 ? "Item" : "Items"}
            </span>
          </h2>
          <button
            onClick={closeDrawer}
            className="flex items-center justify-center w-10 h-10 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
            aria-label="Close cart"
          >
            <Icon name="close" />
          </button>
        </div>

        {mounted && items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <Icon name="shopping_bag" className="text-5xl text-outline-variant" />
            <p className="font-body-lg text-body-md text-on-surface-variant">
              Your cart is empty.
            </p>
            <Link
              href="/shop"
              onClick={closeDrawer}
              className="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps uppercase tracking-wider px-6 py-3 rounded transition-colors"
            >
              Browse the Shop
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="border-b border-outline-variant bg-surface-container-low px-6 py-4">
              <p className="font-label-caps text-label-caps text-trust-olive uppercase mb-2">
                {remaining > 0 ? (
                  <>
                    Add <span className="tabular">{formatINR(remaining)}</span> more
                    for Free Shipping
                  </>
                ) : (
                  "You've unlocked Free Shipping"
                )}
              </p>
              <div className="h-1.5 w-full rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full rounded-full bg-trust-olive transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4">
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={closeDrawer}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded border border-outline-variant bg-surface-container"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-body-md text-body-md font-medium text-walnut-ink">
                          {item.name}
                        </p>
                        <p className="font-label-caps text-[10px] uppercase text-on-surface-variant mt-0.5">
                          {item.variantLabel}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.key)}
                        className="text-on-surface-variant hover:text-error transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Icon name="delete" className="text-[20px]" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-outline-variant rounded">
                        <button
                          onClick={() => setQty(item.key, item.qty - 1)}
                          className="flex h-8 w-8 items-center justify-center text-on-surface-variant hover:text-primary disabled:opacity-30"
                          aria-label="Decrease quantity"
                        >
                          <Icon name="remove" className="text-[16px]" />
                        </button>
                        <span className="tabular w-8 text-center font-body-md text-sm text-walnut-ink">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => setQty(item.key, item.qty + 1)}
                          className="flex h-8 w-8 items-center justify-center text-on-surface-variant hover:text-primary disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Icon name="add" className="text-[16px]" />
                        </button>
                      </div>
                      <p className="tabular font-price-display text-price-display text-walnut-ink">
                        {formatINR(item.unitPrice * item.qty)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-outline-variant px-6 py-5 space-y-3 bg-surface-container-lowest">
              <div className="flex justify-between">
                <span className="font-body-md text-body-md text-on-surface-variant">
                  Subtotal
                </span>
                <span className="tabular font-price-display text-price-display text-walnut-ink">
                  {formatINR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-body-md text-body-md text-on-surface-variant">
                  Shipping
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant">
                  {remaining > 0 ? "Calculated at next step" : "Free"}
                </span>
              </div>
              <div className="flex justify-between border-t border-outline-variant pt-3">
                <span className="font-headline-md text-headline-md text-walnut-ink">
                  Total
                </span>
                <span className="tabular font-headline-md text-headline-md text-walnut-ink">
                  {formatINR(subtotal)}
                </span>
              </div>
              <p className="font-body-md text-xs text-on-surface-variant">
                Tax included. Shipping calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps uppercase tracking-wider px-6 py-4 rounded transition-colors"
              >
                Checkout <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
              <div className="flex items-center justify-center gap-6 pt-1">
                <span className="flex items-center gap-1.5 font-label-caps text-[10px] uppercase text-trust-olive">
                  <Icon name="lock" fill className="text-[14px]" /> Secure Checkout
                </span>
                <span className="flex items-center gap-1.5 font-label-caps text-[10px] uppercase text-trust-olive">
                  <Icon name="verified" fill className="text-[14px]" /> ISO 3632
                  Certified
                </span>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import Icon from "@/components/Icon";
import { formatINR } from "@/lib/money";

const FIELDS = [
  { name: "customer_name", label: "Full Name", type: "text", required: true, span: 2 },
  { name: "phone", label: "Phone (10 digits)", type: "tel", required: true, span: 1 },
  { name: "email", label: "Email (optional)", type: "email", required: false, span: 1 },
  { name: "address", label: "Street Address", type: "text", required: true, span: 2 },
  { name: "city", label: "City", type: "text", required: true, span: 1 },
  { name: "pincode", label: "PIN Code", type: "text", required: true, span: 1 },
  { name: "state", label: "State", type: "text", required: true, span: 2 },
  { name: "notes", label: "Order Notes (optional)", type: "text", required: false, span: 2 },
] as const;

export default function CheckoutForm({
  freeShippingThreshold,
  flatShipping,
  codEnabled = true,
  codByProduct = {},
}: {
  freeShippingThreshold: number;
  flatShipping: number;
  codEnabled?: boolean;
  codByProduct?: Record<number, boolean>;
}) {
  const { items, subtotal, clear, mounted } = useCart();
  const router = useRouter();
  const [payment, setPayment] = useState<"cod" | "online">(codEnabled ? "cod" : "online");

  // COD needs the store-wide switch on AND every cart item to allow it.
  const cartBlocksCod = items.some((i) => codByProduct[i.productId] === false);
  const codAvailable = codEnabled && !cartBlocksCod;

  useEffect(() => {
    if (!codAvailable) setPayment("online");
  }, [codAvailable]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal >= freeShippingThreshold ? 0 : flatShipping;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const customer = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantLabel: i.variantLabel,
            qty: i.qty,
          })),
          customer: { ...customer, payment_method: payment },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");
      clear();
      router.push(`/order/${data.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (mounted && items.length === 0) {
    return (
      <div className="inset-card rounded p-12 text-center space-y-4">
        <Icon name="shopping_bag" className="text-5xl text-outline-variant" />
        <p className="font-body-lg text-body-md text-on-surface-variant">
          Your cart is empty.
        </p>
        <Link
          href="/shop"
          className="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps uppercase tracking-wider px-6 py-3 rounded transition-colors inline-block"
        >
          Browse the Shop
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      {/* Customer details */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-surface border border-outline-variant rounded p-6 md:p-8">
          <h2 className="font-headline-md text-headline-md text-walnut-ink mb-6 flex items-center gap-2">
            <Icon name="local_shipping" className="text-primary" />
            Delivery Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map((field) => (
              <div
                key={field.name}
                className={field.span === 2 ? "sm:col-span-2" : ""}
              >
                <label
                  htmlFor={field.name}
                  className="block font-label-caps text-label-caps text-walnut-ink uppercase mb-2"
                >
                  {field.label}
                </label>
                {field.name === "notes" || field.name === "address" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    rows={field.name === "address" ? 2 : 2}
                    className="w-full border border-outline-variant bg-warm-ivory rounded px-3 py-2.5 font-body-md text-body-md text-walnut-ink focus:outline-none focus:border-primary"
                  />
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    className="w-full border border-outline-variant bg-warm-ivory rounded px-3 py-2.5 font-body-md text-body-md text-walnut-ink focus:outline-none focus:border-primary"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-surface border border-outline-variant rounded p-6 md:p-8">
          <h2 className="font-headline-md text-headline-md text-walnut-ink mb-6 flex items-center gap-2">
            <Icon name="payments" className="text-primary" />
            Payment Method
          </h2>
          <div className="space-y-3">
            {codEnabled && cartBlocksCod && (
              <p className="font-body-md text-sm text-on-surface-variant bg-surface-container-low border border-outline-variant rounded p-3 flex items-start gap-2">
                <Icon name="info" className="text-[18px] text-primary mt-0.5" />
                Cash on Delivery is not available for some items in your cart —
                this order is online payment only.
              </p>
            )}
            {codAvailable && (
              <label
                className={`flex items-start gap-3 border rounded p-4 cursor-pointer transition-colors ${
                  payment === "cod" ? "border-primary bg-primary-fixed/10" : "border-outline-variant bg-warm-ivory"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                  className="mt-1 accent-[#851a08]"
                />
                <span>
                  <span className="block font-body-md text-body-md font-medium text-walnut-ink">
                    Cash on Delivery
                  </span>
                  <span className="block font-body-md text-sm text-on-surface-variant">
                    Pay in cash when your order arrives at your door.
                  </span>
                </span>
              </label>
            )}
            <label
              className={`flex items-start gap-3 border rounded p-4 cursor-pointer transition-colors ${
                payment === "online" ? "border-primary bg-primary-fixed/10" : "border-outline-variant bg-warm-ivory"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="online"
                checked={payment === "online"}
                onChange={() => setPayment("online")}
                className="mt-1 accent-[#851a08]"
              />
              <span>
                <span className="block font-body-md text-body-md font-medium text-walnut-ink">
                  Pay Online{" "}
                  <span className="font-label-caps text-[10px] uppercase text-trust-olive border border-trust-olive/40 rounded px-1.5 py-0.5 ml-1">
                    Demo
                  </span>
                </span>
                <span className="block font-body-md text-sm text-on-surface-variant">
                  Simulated UPI / card payment for this demo — no real money
                  moves. A payment gateway can be connected later.
                </span>
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Order summary */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-32 bg-surface-container-lowest border border-outline-variant rounded p-6 space-y-4">
          <h2 className="font-headline-md text-headline-md text-walnut-ink">
            Order Summary
          </h2>
          <div className="space-y-4 border-b border-outline-variant pb-4">
            {items.map((item) => (
              <div key={item.key} className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded border border-outline-variant bg-surface-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body-md text-sm font-medium text-walnut-ink truncate">
                    {item.name}
                  </p>
                  <p className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                    {item.variantLabel} × {item.qty}
                  </p>
                </div>
                <p className="tabular font-price-display text-sm text-walnut-ink">
                  {formatINR(item.unitPrice * item.qty)}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-body-md text-body-md text-on-surface-variant">Subtotal</span>
              <span className="tabular font-body-md text-body-md text-walnut-ink">
                {formatINR(subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-body-md text-body-md text-on-surface-variant">Shipping</span>
              <span className="tabular font-body-md text-body-md text-walnut-ink">
                {shipping === 0 ? "Free" : formatINR(shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-outline-variant pt-3">
              <span className="font-headline-md text-headline-md text-walnut-ink">Total</span>
              <span className="tabular font-headline-md text-headline-md text-walnut-ink">
                {formatINR(total)}
              </span>
            </div>
            <p className="font-body-md text-xs text-on-surface-variant">
              Tax included. Free shipping on orders over {formatINR(freeShippingThreshold)}.
            </p>
          </div>
          {error && (
            <p className="font-body-md text-sm text-error bg-error-container/40 border border-error/20 rounded p-3">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary font-label-caps text-label-caps uppercase tracking-wider px-8 py-4 rounded transition-colors"
          >
            {submitting ? "Placing Order…" : "Place Order"}
            {!submitting && <Icon name="arrow_forward" className="text-[16px]" />}
          </button>
          <div className="flex items-center justify-center gap-6 pt-1">
            <span className="flex items-center gap-1.5 font-label-caps text-[10px] uppercase text-trust-olive">
              <Icon name="lock" fill className="text-[14px]" /> Secure Checkout
            </span>
            <span className="flex items-center gap-1.5 font-label-caps text-[10px] uppercase text-trust-olive">
              <Icon name="verified" fill className="text-[14px]" /> ISO 3632 Certified
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import Icon from "@/components/Icon";
import { formatINR } from "@/lib/money";
import { checkCouponCodeAction } from "@/app/admin/actions";

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

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // COD needs the store-wide switch on AND every cart item to allow it.
  const cartBlocksCod = items.some((i) => codByProduct[i.productId] === false);
  const codAvailable = codEnabled && !cartBlocksCod;

  useEffect(() => {
    if (!codAvailable) setPayment("online");
  }, [codAvailable]);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const shipping = subtotal >= freeShippingThreshold ? 0 : flatShipping;
  const total = Math.max(0, subtotal - discountAmount) + shipping;

  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    setCouponError("");
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    try {
      const res = await checkCouponCodeAction(couponInput, subtotal);
      if (res.valid) {
        setAppliedCoupon({
          code: couponInput.toUpperCase(),
          discount: res.discount,
          message: res.message,
        });
        setCouponError("");
      } else {
        setCouponError(res.message);
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("Could not validate coupon. Please try again.");
    } finally {
      setValidatingCoupon(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const raw = Object.fromEntries(form.entries());

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
          customer: {
            name: String(raw.customer_name ?? ""),
            phone: String(raw.phone ?? ""),
            email: String(raw.email ?? ""),
            address: String(raw.address ?? ""),
            city: String(raw.city ?? ""),
            state: String(raw.state ?? ""),
            pincode: String(raw.pincode ?? ""),
            notes: String(raw.notes ?? ""),
            paymentMethod: payment,
            couponCode: appliedCoupon?.code,
          },
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
      <div className="bg-surface border border-outline-variant rounded-xl p-12 text-center space-y-4 shadow-sm">
        <Icon name="shopping_bag" className="text-5xl text-outline-variant" />
        <p className="font-body-lg text-body-md text-on-surface-variant">
          Your cart is currently empty.
        </p>
        <Link
          href="/shop"
          className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg transition-colors inline-block shadow-sm"
        >
          Browse the Catalog
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Shipping & Payment Fields */}
      <div className="lg:col-span-7 space-y-8">
        <section className="bg-surface border border-outline-variant rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-headline-md text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <Icon name="local_shipping" className="text-primary" /> Delivery Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map((f) => (
              <div key={f.name} className={f.span === 2 ? "sm:col-span-2" : ""}>
                <label
                  htmlFor={f.name}
                  className="block font-label-md text-xs font-bold uppercase text-on-surface-variant mb-1.5"
                >
                  {f.label} {f.required && <span className="text-primary">*</span>}
                </label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  required={f.required}
                  placeholder={
                    f.name === "phone"
                      ? "10-digit mobile number"
                      : f.name === "pincode"
                      ? "6-digit PIN"
                      : undefined
                  }
                  className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg px-4 py-2.5 font-body-md text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Payment options */}
        <section className="bg-surface border border-outline-variant rounded-xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-headline-md text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <Icon name="payments" className="text-primary" /> Payment Method
          </h2>

          <div className="space-y-3">
            {/* COD option */}
            <label
              className={`flex items-start gap-4 border rounded-xl p-4 cursor-pointer transition-all ${
                payment === "cod"
                  ? "border-primary bg-primary-fixed/20 shadow-sm"
                  : "border-outline-variant bg-surface-container-lowest hover:border-primary/50"
              } ${!codAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="payment_choice"
                value="cod"
                checked={payment === "cod"}
                disabled={!codAvailable}
                onChange={() => setPayment("cod")}
                className="mt-1 h-4 w-4 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-on-surface">
                    Cash on Delivery (COD)
                  </span>
                  <span className="font-label-md text-[10px] uppercase font-bold text-trust-olive bg-trust-olive/15 px-2 py-0.5 rounded">
                    Pay at Doorstep
                  </span>
                </div>
                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                  Pay with cash or UPI scanner upon delivery by the courier agent.
                </p>
                {!codAvailable && (
                  <p className="font-body-md text-xs text-error mt-2">
                    {cartBlocksCod
                      ? "COD is unavailable for one or more items in your cart."
                      : "Cash on delivery is currently turned off."}
                  </p>
                )}
              </div>
            </label>

            {/* Online payment */}
            <label
              className={`flex items-start gap-4 border rounded-xl p-4 cursor-pointer transition-all ${
                payment === "online"
                  ? "border-primary bg-primary-fixed/20 shadow-sm"
                  : "border-outline-variant bg-surface-container-lowest hover:border-primary/50"
              }`}
            >
              <input
                type="radio"
                name="payment_choice"
                value="online"
                checked={payment === "online"}
                onChange={() => setPayment("online")}
                className="mt-1 h-4 w-4 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-on-surface">
                    UPI / QR / Net Banking
                  </span>
                  <span className="font-label-md text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    Instant
                  </span>
                </div>
                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                  Pay securely via GPay, PhonePe, Paytm, or direct bank transfer.
                </p>
              </div>
            </label>
          </div>
        </section>
      </div>

      {/* Right Column: Order Summary & Coupon */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-surface border border-outline-variant rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="font-headline-md text-lg font-bold text-on-surface pb-3 border-b border-outline-variant">
            Order Summary ({items.length})
          </h2>

          {/* Cart items */}
          <div className="divide-y divide-outline-variant/60 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.key} className="py-3 flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg border border-outline-variant bg-surface-container"
                  />
                  <div>
                    <p className="font-semibold text-on-surface line-clamp-1">{item.name}</p>
                    <p className="font-label-md text-xs text-trust-olive font-bold uppercase">
                      {item.variantLabel} × {item.qty}
                    </p>
                  </div>
                </div>
                <span className="tabular font-bold text-on-surface">
                  {formatINR(item.unitPrice * item.qty)}
                </span>
              </div>
            ))}
          </div>

          {/* Promo Code Input Box */}
          <div className="border-t border-b border-outline-variant py-4 space-y-2">
            <span className="block font-label-md text-xs uppercase font-bold text-on-surface-variant">
              Have a Promo Code?
            </span>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-trust-olive/15 border border-trust-olive/30 rounded-lg">
                <div className="flex items-center gap-2 text-trust-olive">
                  <Icon name="check_circle" fill className="text-base" />
                  <span className="font-mono font-bold text-xs">{appliedCoupon.code}</span>
                  <span className="text-xs">(-{formatINR(appliedCoupon.discount)})</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold uppercase text-error hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. HARVEST10"
                  className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg px-3 py-2 text-xs font-mono uppercase font-bold text-primary focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={validatingCoupon || !couponInput.trim()}
                  className="bg-secondary text-on-secondary font-label-md text-xs font-bold uppercase px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
                >
                  {validatingCoupon ? "..." : "Apply"}
                </button>
              </div>
            )}
            {couponError && (
              <p className="text-xs text-error font-medium">{couponError}</p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal</span>
              <span className="tabular font-medium text-on-surface">
                {formatINR(subtotal)}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-trust-olive font-medium">
                <span>Coupon Discount</span>
                <span className="tabular">-{formatINR(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-on-surface-variant">
              <span>Delivery Fee</span>
              <span className="tabular font-medium text-trust-olive">
                {shipping === 0 ? "FREE" : formatINR(shipping)}
              </span>
            </div>

            <div className="flex justify-between border-t border-outline-variant pt-3 text-base font-bold text-on-surface">
              <span>Total Payable</span>
              <span className="tabular text-primary text-xl font-bold">
                {formatINR(total)}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-error-container text-on-error-container text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-bold uppercase tracking-wider py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              "Placing Order..."
            ) : (
              <>
                Place Order · <span className="tabular">{formatINR(total)}</span>
                <Icon name="arrow_forward" className="text-sm" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-4 text-xs text-on-surface-variant pt-2">
            <span className="flex items-center gap-1">
              <Icon name="lock" fill className="text-trust-olive text-sm" /> 256-bit Secure
            </span>
            <span className="flex items-center gap-1">
              <Icon name="verified" fill className="text-trust-olive text-sm" /> Direct from Lethipora
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}

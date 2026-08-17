import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { formatINR } from "@/lib/money";
import { getOrder, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = getOrder(decodeURIComponent(orderNumber));
  if (!order) notFound();
  const settings = getSettings();

  const whatsappText = encodeURIComponent(
    `Assalamu Alaikum! I just placed order ${order.order_number} on safakesar.com (${formatINR(order.total)}). — ${order.customer_name}`
  );

  return (
    <main className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24">
      {/* Confirmation header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-trust-olive/10 border border-trust-olive/30 mb-6">
          <Icon name="check_circle" fill className="text-3xl text-trust-olive" />
        </div>
        <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-walnut-ink mb-3">
          Thank You, {order.customer_name.split(" ")[0]}.
        </h1>
        <p className="font-body-lg text-body-md text-on-surface-variant">
          Your order has been received. We&apos;ll contact you on{" "}
          <span className="font-medium text-walnut-ink">{order.phone}</span> to
          confirm.
        </p>
        <p className="font-label-caps text-label-caps text-trust-olive uppercase tracking-widest mt-4">
          Order {order.order_number}
        </p>
      </div>

      {/* Order card */}
      <div className="bg-surface border border-outline-variant rounded overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-walnut-ink">
            Order Details
          </h2>
          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">
            {new Date(order.created_at + "Z").toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
        <div className="divide-y divide-outline-variant">
          {order.items.map((item) => (
            <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-body-md text-body-md font-medium text-walnut-ink">
                  {item.product_name}
                </p>
                <p className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                  {item.variant_label} × {item.qty} · {formatINR(item.unit_price)} each
                </p>
              </div>
              <p className="tabular font-price-display text-price-display text-walnut-ink shrink-0">
                {formatINR(item.line_total)}
              </p>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant space-y-2">
          <div className="flex justify-between">
            <span className="font-body-md text-body-md text-on-surface-variant">Subtotal</span>
            <span className="tabular font-body-md text-body-md text-walnut-ink">
              {formatINR(order.subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-body-md text-body-md text-on-surface-variant">Shipping</span>
            <span className="tabular font-body-md text-body-md text-walnut-ink">
              {order.shipping === 0 ? "Free" : formatINR(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between border-t border-outline-variant pt-2">
            <span className="font-headline-md text-headline-md text-walnut-ink">Total</span>
            <span className="tabular font-headline-md text-headline-md text-walnut-ink">
              {formatINR(order.total)}
            </span>
          </div>
          <p className="font-label-caps text-[10px] uppercase text-on-surface-variant pt-1">
            {order.payment_method === "cod"
              ? "Payment: Cash on Delivery"
              : "Payment: Paid Online (demo)"}
          </p>
        </div>
      </div>

      {/* Delivery + WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter mb-12">
        <div className="inset-card rounded p-5">
          <p className="font-label-caps text-label-caps text-walnut-ink uppercase mb-2 flex items-center gap-1.5">
            <Icon name="local_shipping" fill className="text-[16px] text-trust-olive" />
            Delivering To
          </p>
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
            {order.customer_name}
            <br />
            {order.address}, {order.city}
            <br />
            {order.state} — {order.pincode}
          </p>
        </div>
        <a
          href={`https://wa.me/${settings.whatsapp_number}?text=${whatsappText}`}
          target="_blank"
          rel="noreferrer"
          className="inset-card rounded p-5 flex items-center gap-4 hover:border-trust-olive transition-colors"
        >
          <div className="flex items-center justify-center h-11 w-11 rounded-full bg-trust-olive text-white shrink-0">
            <Icon name="chat" fill />
          </div>
          <div>
            <p className="font-label-caps text-label-caps text-walnut-ink uppercase">
              {settings.whatsapp_label}
            </p>
            <p className="font-body-md text-sm text-on-surface-variant">
              Send this order on WhatsApp for quick confirmation.
            </p>
          </div>
        </a>
      </div>

      <div className="text-center">
        <Link
          href="/shop"
          className="border border-walnut-ink text-walnut-ink hover:bg-surface-variant font-label-caps text-label-caps uppercase tracking-wider px-8 py-4 rounded transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}

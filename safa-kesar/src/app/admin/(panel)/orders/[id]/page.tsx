import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { formatINR } from "@/lib/money";
import { getOrderById } from "@/lib/queries";
import { updateOrderStatusAction } from "../../../actions";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-secondary-fixed/40 text-on-secondary-fixed-variant",
  confirmed: "bg-tertiary-fixed/60 text-on-tertiary-fixed-variant",
  shipped: "bg-primary-fixed/60 text-on-primary-fixed-variant",
  delivered: "bg-trust-olive/15 text-trust-olive",
  cancelled: "bg-error-container text-on-error-container",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(Number(id));
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary uppercase tracking-wider"
          >
            ← Orders
          </Link>
          <h1 className="font-headline-lg text-headline-lg text-walnut-ink flex items-center gap-3">
            {order.order_number}
            <span className={`font-label-caps text-[10px] uppercase rounded px-2 py-1 ${STATUS_STYLES[order.status] ?? ""}`}>
              {order.status}
            </span>
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            {new Date(order.created_at + "Z").toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        {/* Status update */}
        <form action={updateOrderStatusAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={order.id} />
          <select
            name="status"
            defaultValue={order.status}
            className="border border-outline-variant bg-warm-ivory rounded px-3 py-2.5 font-body-md text-body-md text-walnut-ink focus:outline-none focus:border-primary"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps uppercase tracking-wider px-5 py-2.5 rounded transition-colors"
          >
            Update Status
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-outline-variant rounded overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low">
              <h2 className="font-headline-md text-headline-md text-walnut-ink">Items</h2>
            </div>
            <div className="divide-y divide-outline-variant">
              {order.items.map((item) => (
                <div key={item.id} className="px-5 py-4 flex items-center justify-between gap-4">
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
            <div className="px-5 py-4 bg-surface-container-lowest border-t border-outline-variant space-y-1.5">
              <div className="flex justify-between">
                <span className="font-body-md text-sm text-on-surface-variant">Subtotal</span>
                <span className="tabular font-body-md text-sm text-walnut-ink">{formatINR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body-md text-sm text-on-surface-variant">Shipping</span>
                <span className="tabular font-body-md text-sm text-walnut-ink">
                  {order.shipping === 0 ? "Free" : formatINR(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-outline-variant pt-2">
                <span className="font-headline-md text-headline-md text-walnut-ink">Total</span>
                <span className="tabular font-headline-md text-headline-md text-walnut-ink">
                  {formatINR(order.total)}
                </span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-surface border border-outline-variant rounded p-5">
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">
                Customer Notes
              </p>
              <p className="font-body-md text-body-md text-walnut-ink">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Customer */}
        <div className="space-y-6">
          <div className="bg-surface border border-outline-variant rounded p-5 space-y-4">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase flex items-center gap-1.5">
              <Icon name="person" fill className="text-[16px] text-trust-olive" /> Customer
            </p>
            <div className="font-body-md text-body-md text-walnut-ink space-y-1">
              <p className="font-medium">{order.customer_name}</p>
              {order.email && <p className="text-sm text-on-surface-variant">{order.email}</p>}
              <p className="text-sm">{order.phone}</p>
            </div>
            <div className="border-t border-outline-variant pt-4">
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 flex items-center gap-1.5">
                <Icon name="local_shipping" fill className="text-[16px] text-trust-olive" /> Address
              </p>
              <p className="font-body-md text-sm text-walnut-ink leading-relaxed whitespace-pre-line">
                {order.address}
                {"\n"}
                {order.city}, {order.state} — {order.pincode}
              </p>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded p-5">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 flex items-center gap-1.5">
              <Icon name="payments" fill className="text-[16px] text-trust-olive" /> Payment
            </p>
            <p className="font-body-md text-body-md text-walnut-ink">
              {order.payment_method === "cod"
                ? "Cash on Delivery"
                : "Paid Online (demo)"}
            </p>
            <p className="font-label-caps text-[10px] uppercase text-on-surface-variant mt-1">
              {order.payment_status}
            </p>
          </div>

          <a
            href={`https://wa.me/91${order.phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
              `Assalamu Alaikum ${order.customer_name}, this is Safa Kesar regarding your order ${order.order_number} (${formatINR(order.total)}).`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="bg-trust-olive hover:bg-[#4a563b] text-white rounded p-4 flex items-center gap-3 transition-colors"
          >
            <Icon name="chat" fill />
            <span className="font-label-caps text-label-caps uppercase">
              WhatsApp Customer
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

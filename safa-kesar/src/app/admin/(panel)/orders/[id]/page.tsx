import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { formatINR } from "@/lib/money";
import { getOrderById } from "@/lib/queries";
import { updateOrderStatusAction, updateOrderTrackingAction } from "../../../actions";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-secondary-fixed text-on-secondary-fixed font-bold",
  confirmed: "bg-tertiary-fixed text-on-tertiary-fixed font-bold",
  shipped: "bg-primary-fixed text-on-primary-fixed font-bold",
  delivered: "bg-trust-olive/20 text-trust-olive font-bold",
  cancelled: "bg-error-container text-on-error-container font-bold",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(Number(id));
  if (!order) notFound();

  const whatsappConfirmMsg = encodeURIComponent(
    `Hello ${order.customer_name}, this is Aadil from Safa Kesar. Your order #${order.order_number} for ${formatINR(order.total)} is CONFIRMED and is being prepared for dispatch from our Lethipora showroom.`
  );

  const whatsappShippedMsg = encodeURIComponent(
    `Hello ${order.customer_name}, your Safa Kesar order #${order.order_number} has been DISPATCHED via ${order.tracking_carrier || "Delhivery"}! ${order.tracking_number ? `Tracking Number: ${order.tracking_number}` : ""} Thank you for choosing pure Kashmiri saffron!`
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <Link
            href="/admin/orders"
            className="font-label-md text-xs font-bold uppercase text-on-surface-variant hover:text-primary flex items-center gap-1 mb-2"
          >
            <Icon name="arrow_back" className="text-sm" /> Back to Orders List
          </Link>
          <h1 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-3">
            {order.order_number}
            <span
              className={`font-label-md text-xs uppercase rounded-full px-3 py-1 ${
                STATUS_STYLES[order.status] ?? ""
              }`}
            >
              {order.status}
            </span>
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">
            Placed on {new Date(order.created_at + "Z").toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        {/* Status update & Print Invoice */}
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/orders/${order.id}/invoice`}
            className="inline-flex items-center gap-1.5 bg-surface border border-outline-variant text-primary font-label-md text-xs font-bold uppercase px-4 py-2.5 rounded-lg hover:bg-surface-container transition-colors shadow-sm"
          >
            <Icon name="print" className="text-base" /> Print Invoice
          </Link>

          <form action={updateOrderStatusAction} className="flex items-center gap-2">
            <input type="hidden" name="id" value={order.id} />
            <select
              name="status"
              defaultValue={order.status}
              aria-label="Order status"
              className="border border-outline-variant bg-surface rounded-lg px-3 py-2 text-sm font-label-md font-bold text-on-surface focus:outline-none focus:border-primary"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Update Status
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Left 2 Cols: Items & Logistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items card */}
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-outline-variant bg-surface-container-low">
              <h2 className="font-headline-md text-base font-bold text-on-surface">
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-outline-variant">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="px-6 py-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-body-md text-sm font-semibold text-on-surface">
                      {item.product_name}
                    </p>
                    <p className="font-label-md text-xs text-on-surface-variant mt-0.5">
                      {item.variant_label} × {item.qty} · {formatINR(item.unit_price)} each
                    </p>
                  </div>
                  <p className="tabular font-headline-md text-base font-bold text-on-surface shrink-0">
                    {formatINR(item.line_total)}
                  </p>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="px-6 py-5 bg-surface-container-lowest border-t border-outline-variant space-y-2 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="tabular font-medium text-on-surface">
                  {formatINR(order.subtotal)}
                </span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-trust-olive font-medium">
                  <span>Coupon Discount ({order.coupon_code})</span>
                  <span className="tabular">-{formatINR(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping Fee</span>
                <span className="tabular font-medium text-on-surface">
                  {order.shipping === 0 ? "FREE" : formatINR(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-outline-variant pt-3 text-base font-bold text-on-surface">
                <span>Total Amount</span>
                <span className="tabular text-primary text-xl">
                  {formatINR(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Courier & Tracking Form */}
          <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-headline-md text-base font-bold text-on-surface flex items-center gap-2">
              <Icon name="local_shipping" className="text-primary" /> Courier &amp; Tracking Number
            </h2>
            <form action={updateOrderTrackingAction} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input type="hidden" name="id" value={order.id} />
              <div>
                <label htmlFor="tracking_carrier" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                  Logistics Carrier
                </label>
                <select
                  id="tracking_carrier"
                  name="tracking_carrier"
                  defaultValue={order.tracking_carrier || "Delhivery"}
                  className="w-full border border-outline-variant bg-surface rounded-lg px-3 py-2 text-sm font-body-md"
                >
                  <option value="Delhivery">Delhivery</option>
                  <option value="India Post SpeedPost">India Post SpeedPost</option>
                  <option value="BlueDart">BlueDart</option>
                  <option value="DTDC">DTDC</option>
                  <option value="Local Showroom Pickup">Local Showroom Pickup</option>
                </select>
              </div>
              <div>
                <label htmlFor="tracking_number" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                  Waybill / Tracking #
                </label>
                <input
                  id="tracking_number"
                  name="tracking_number"
                  type="text"
                  defaultValue={order.tracking_number}
                  placeholder="e.g. 12849102941"
                  className="w-full border border-outline-variant bg-surface rounded-lg px-3 py-2 text-sm font-body-md"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold uppercase py-2.5 rounded-lg transition-colors"
                >
                  Save Tracking
                </button>
              </div>
            </form>
          </div>

          {order.notes && (
            <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm">
              <p className="font-label-md text-xs font-bold text-on-surface-variant uppercase mb-2">
                Customer Delivery Instructions
              </p>
              <p className="font-body-md text-sm text-on-surface">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right 1 Col: Customer Contact & WhatsApp Actions */}
        <div className="space-y-6">
          {/* Customer Address Card */}
          <div className="bg-surface border border-outline-variant rounded-xl p-6 space-y-4 shadow-sm">
            <h2 className="font-label-md text-xs font-bold text-trust-olive uppercase flex items-center gap-1.5">
              <Icon name="person" fill className="text-sm" /> Customer Details
            </h2>
            <div className="font-body-md text-sm text-on-surface space-y-1">
              <p className="font-bold text-base">{order.customer_name}</p>
              <p className="text-on-surface-variant">{order.phone}</p>
              {order.email && <p className="text-on-surface-variant">{order.email}</p>}
            </div>
            <div className="border-t border-outline-variant pt-4">
              <p className="font-label-md text-xs font-bold text-trust-olive uppercase mb-2 flex items-center gap-1.5">
                <Icon name="location_on" fill className="text-sm" /> Delivery Destination
              </p>
              <p className="font-body-md text-sm text-on-surface leading-relaxed whitespace-pre-line">
                {order.address}
                {"\n"}
                {order.city}, {order.state} — {order.pincode}
              </p>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm space-y-2">
            <p className="font-label-md text-xs font-bold text-trust-olive uppercase flex items-center gap-1.5">
              <Icon name="payments" fill className="text-sm" /> Payment Method
            </p>
            <p className="font-headline-md text-base font-bold text-on-surface">
              {order.payment_method === "cod" ? "Cash on Delivery" : "Online Prepaid (UPI)"}
            </p>
            <span className="inline-block bg-surface-container-low px-2.5 py-1 rounded text-xs font-bold text-on-surface-variant uppercase">
              Status: {order.payment_status}
            </span>
          </div>

          {/* 1-Click WhatsApp Quick Actions */}
          <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm space-y-3">
            <h3 className="font-label-md text-xs font-bold uppercase text-on-surface flex items-center gap-1.5">
              <Icon name="chat" fill className="text-trust-olive text-sm" /> 1-Click WhatsApp Updates
            </h3>
            <a
              href={`https://wa.me/${order.phone.replace(/\D/g, "")}?text=${whatsappConfirmMsg}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-trust-olive hover:bg-[#4a563b] text-white rounded-lg p-3 flex items-center justify-between text-xs font-bold transition-colors"
            >
              <span>Send Order Confirmation</span>
              <Icon name="send" className="text-sm" />
            </a>
            <a
              href={`https://wa.me/${order.phone.replace(/\D/g, "")}?text=${whatsappShippedMsg}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-primary hover:bg-primary-container text-white rounded-lg p-3 flex items-center justify-between text-xs font-bold transition-colors"
            >
              <span>Send Dispatch &amp; Tracking</span>
              <Icon name="send" className="text-sm" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

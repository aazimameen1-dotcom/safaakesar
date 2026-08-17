import Link from "next/link";
import Icon from "@/components/Icon";
import { formatINR } from "@/lib/money";
import { getOrders } from "@/lib/queries";
import { updateOrderStatusAction } from "../../actions";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-secondary-fixed text-on-secondary-fixed font-bold",
  confirmed: "bg-tertiary-fixed text-on-tertiary-fixed font-bold",
  shipped: "bg-primary-fixed text-on-primary-fixed font-bold",
  delivered: "bg-trust-olive/20 text-trust-olive font-bold",
  cancelled: "bg-error-container text-on-error-container font-bold",
};

const FILTERS = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await searchParams;
  const orders = getOrders(status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Customer Orders
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            {orders.length} {status === "all" ? "total" : status} orders in store database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/export-orders"
            download="safa-kesar-orders.csv"
            className="inline-flex items-center gap-1.5 bg-surface border border-outline-variant text-primary font-label-md text-xs font-bold uppercase px-4 py-2 rounded-lg hover:bg-surface-container transition-colors shadow-sm"
          >
            <Icon name="download" className="text-sm" /> Export to CSV (Delhivery)
          </a>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={`/admin/orders${f === "all" ? "" : `?status=${f}`}`}
            className={`font-label-md text-xs uppercase rounded-lg px-3.5 py-2 border transition-colors font-bold ${
              status === f
                ? "border-primary bg-primary text-on-primary shadow-sm"
                : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary hover:text-primary"
            }`}
          >
            {f}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface border border-outline-variant rounded-xl p-12 text-center">
          <p className="font-body-lg text-body-md text-on-surface-variant">
            No orders found in this filter.
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-outline-variant rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-left min-w-[850px] text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low text-xs uppercase text-on-surface-variant font-label-md">
                <th className="px-5 py-3.5">Order #</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Customer &amp; Location</th>
                <th className="px-4 py-3.5">Items</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Total</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {orders.map((order) => {
                const whatsappMsg = encodeURIComponent(
                  `Hello ${order.customer_name}, this is Aadil from Safa Kesar. Regarding your order #${order.order_number} for ${formatINR(order.total)}: Your order status is ${order.status.toUpperCase()}${order.tracking_number ? ` (Tracking #: ${order.tracking_number} via ${order.tracking_carrier})` : ""}. Thank you for choosing authentic Kashmiri saffron!`
                );

                return (
                  <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-primary">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-4 font-body-md text-xs text-on-surface-variant whitespace-nowrap">
                      {new Date(order.created_at + "Z").toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-on-surface">{order.customer_name}</p>
                      <p className="text-xs text-on-surface-variant">
                        {order.city}, {order.state} • {order.phone}
                      </p>
                    </td>
                    <td className="px-4 py-4 font-body-md text-xs text-on-surface-variant">
                      {order.item_count} items
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-label-md text-[11px] font-bold uppercase text-on-surface-variant">
                        {order.payment_method === "cod" ? "Cash on Delivery" : "Online UPI"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <form action={updateOrderStatusAction} className="inline-block">
                        <input type="hidden" name="id" value={order.id} />
                        <select
                          name="status"
                          defaultValue={order.status}
                          aria-label={`Update status for order ${order.order_number}`}
                          className={`font-label-md text-xs rounded-full px-2.5 py-1 border border-outline-variant cursor-pointer ${
                            STATUS_STYLES[order.status] ?? ""
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </form>
                    </td>
                    <td className="px-4 py-4 tabular font-bold text-on-surface">
                      {formatINR(order.total)}
                      {order.discount_amount > 0 && (
                        <span className="block text-[10px] text-trust-olive font-normal">
                          Saved {formatINR(order.discount_amount)} ({order.coupon_code})
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${order.phone.replace(/\D/g, "")}?text=${whatsappMsg}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 bg-trust-olive/15 text-trust-olive hover:bg-trust-olive hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          title="WhatsApp customer"
                        >
                          <Icon name="chat" fill className="text-sm" /> WhatsApp
                        </a>
                        <Link
                          href={`/admin/orders/${order.id}/invoice`}
                          className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container"
                          title="Print Packing Slip & Invoice"
                        >
                          <Icon name="print" className="text-[18px]" />
                        </Link>
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-1.5 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container"
                          title="View Order Details"
                        >
                          <Icon name="visibility" className="text-[18px]" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { formatINR } from "@/lib/money";
import { getOrders } from "@/lib/queries";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-secondary-fixed/40 text-on-secondary-fixed-variant",
  confirmed: "bg-tertiary-fixed/60 text-on-tertiary-fixed-variant",
  shipped: "bg-primary-fixed/60 text-on-primary-fixed-variant",
  delivered: "bg-trust-olive/15 text-trust-olive",
  cancelled: "bg-error-container text-on-error-container",
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
      <div>
        <h1 className="font-headline-lg text-headline-lg text-walnut-ink">Orders</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {orders.length} {status === "all" ? "total" : status} orders.
        </p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={`/admin/orders${f === "all" ? "" : `?status=${f}`}`}
            className={`font-label-caps text-label-caps uppercase rounded px-3 py-1.5 border transition-colors ${
              status === f
                ? "border-primary bg-primary text-on-primary"
                : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary hover:text-primary"
            }`}
          >
            {f}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface border border-outline-variant rounded p-12 text-center">
          <p className="font-body-lg text-body-md text-on-surface-variant">
            No orders here yet.
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-outline-variant rounded overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="px-5 py-3 font-label-caps text-[10px] uppercase text-on-surface-variant">Order</th>
                <th className="px-3 py-3 font-label-caps text-[10px] uppercase text-on-surface-variant">Date</th>
                <th className="px-3 py-3 font-label-caps text-[10px] uppercase text-on-surface-variant">Customer</th>
                <th className="px-3 py-3 font-label-caps text-[10px] uppercase text-on-surface-variant">Items</th>
                <th className="px-3 py-3 font-label-caps text-[10px] uppercase text-on-surface-variant">Payment</th>
                <th className="px-3 py-3 font-label-caps text-[10px] uppercase text-on-surface-variant">Status</th>
                <th className="px-5 py-3 font-label-caps text-[10px] uppercase text-on-surface-variant text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low/60">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-body-md text-sm font-medium text-primary hover:underline"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-3 py-3 font-body-md text-sm text-on-surface-variant whitespace-nowrap">
                    {new Date(order.created_at + "Z").toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-body-md text-sm text-walnut-ink">{order.customer_name}</p>
                    <p className="font-body-md text-xs text-on-surface-variant">{order.phone}</p>
                  </td>
                  <td className="px-3 py-3 font-body-md text-sm text-on-surface-variant">
                    {order.item_count}
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                      {order.payment_method === "cod" ? "COD" : "Online (demo)"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`font-label-caps text-[10px] uppercase rounded px-2 py-1 ${STATUS_STYLES[order.status] ?? ""}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="tabular px-5 py-3 font-body-md text-sm text-walnut-ink text-right">
                    {formatINR(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

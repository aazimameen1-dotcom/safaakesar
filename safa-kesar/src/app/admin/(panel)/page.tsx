import Link from "next/link";
import Icon from "@/components/Icon";
import { formatINR } from "@/lib/money";
import { getDashboardStats, getOrders } from "@/lib/queries";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-secondary-fixed/40 text-on-secondary-fixed-variant",
  confirmed: "bg-tertiary-fixed/60 text-on-tertiary-fixed-variant",
  shipped: "bg-primary-fixed/60 text-on-primary-fixed-variant",
  delivered: "bg-trust-olive/15 text-trust-olive",
  cancelled: "bg-error-container text-on-error-container",
};

export default function AdminDashboardPage() {
  const stats = getDashboardStats();
  const recent = getOrders().slice(0, 8);

  const cards = [
    {
      label: "Total Revenue",
      value: formatINR(stats.revenue),
      icon: "payments",
      tone: "text-primary",
    },
    {
      label: "Orders",
      value: String(stats.orderCount),
      icon: "receipt_long",
      tone: "text-tertiary",
      sub: `${stats.pending} pending`,
    },
    {
      label: "Avg. Order Value",
      value: formatINR(stats.avg),
      icon: "trending_up",
      tone: "text-secondary",
    },
    {
      label: "Active Products",
      value: String(stats.productCount),
      icon: "inventory_2",
      tone: "text-trust-olive",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-walnut-ink">
          Dashboard
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          The store at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        {cards.map((card) => (
          <div key={card.label} className="bg-surface border border-outline-variant rounded p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                {card.label}
              </span>
              <Icon name={card.icon} fill className={`text-[20px] ${card.tone}`} />
            </div>
            <p className="tabular font-headline-md text-headline-md text-walnut-ink">
              {card.value}
            </p>
            {card.sub && (
              <p className="font-body-md text-xs text-on-surface-variant mt-1">{card.sub}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-surface border border-outline-variant rounded overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-walnut-ink">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="font-label-caps text-label-caps text-primary hover:text-primary-container uppercase tracking-wider"
            >
              View All
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="px-5 py-8 font-body-md text-body-md text-on-surface-variant text-center">
              No orders yet. Place a test order from the storefront.
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="px-5 py-2.5 font-label-caps text-[10px] uppercase text-on-surface-variant">Order</th>
                  <th className="px-3 py-2.5 font-label-caps text-[10px] uppercase text-on-surface-variant">Customer</th>
                  <th className="px-3 py-2.5 font-label-caps text-[10px] uppercase text-on-surface-variant">Status</th>
                  <th className="px-5 py-2.5 font-label-caps text-[10px] uppercase text-on-surface-variant text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {recent.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/60">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-body-md text-sm font-medium text-primary hover:underline"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-3 py-3 font-body-md text-sm text-walnut-ink">
                      {order.customer_name}
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
          )}
        </div>

        {/* Top products */}
        <div className="bg-surface border border-outline-variant rounded p-5">
          <h2 className="font-headline-md text-headline-md text-walnut-ink mb-4">
            Top Products
          </h2>
          {stats.topProducts.length === 0 ? (
            <p className="font-body-md text-sm text-on-surface-variant">
              Sales data will appear here after the first order.
            </p>
          ) : (
            <ol className="space-y-4">
              {stats.topProducts.map((p, i) => (
                <li key={p.product_name} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-container font-label-caps text-label-caps text-walnut-ink">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md text-sm font-medium text-walnut-ink truncate">
                      {p.product_name}
                    </p>
                    <p className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                      {p.qty} sold
                    </p>
                  </div>
                  <span className="tabular font-body-md text-sm text-walnut-ink">
                    {formatINR(p.revenue)}
                  </span>
                </li>
              ))}
            </ol>
          )}

          {/* Status breakdown */}
          <div className="border-t border-outline-variant mt-6 pt-5">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-3">
              Orders by Status
            </p>
            <div className="flex flex-wrap gap-2">
              {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                <Link
                  key={s}
                  href={`/admin/orders?status=${s}`}
                  className={`font-label-caps text-[10px] uppercase rounded px-2.5 py-1.5 ${STATUS_STYLES[s]}`}
                >
                  {s} · {stats.statusCounts[s] ?? 0}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

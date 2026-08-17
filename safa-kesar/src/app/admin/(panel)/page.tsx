import Link from "next/link";
import Icon from "@/components/Icon";
import { formatINR } from "@/lib/money";
import { getDashboardStats, getOrders, getSettings } from "@/lib/queries";
import { updateOrderStatusAction } from "../actions";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-secondary-fixed text-on-secondary-fixed font-bold",
  confirmed: "bg-tertiary-fixed text-on-tertiary-fixed font-bold",
  shipped: "bg-primary-fixed text-on-primary-fixed font-bold",
  delivered: "bg-trust-olive/20 text-trust-olive font-bold",
  cancelled: "bg-error-container text-on-error-container font-bold",
};

export default function AdminDashboardPage() {
  const stats = getDashboardStats();
  const recent = getOrders().slice(0, 8);
  const settings = getSettings();

  const cards = [
    {
      label: "Total Revenue",
      value: formatINR(stats.revenue),
      icon: "payments",
      tone: "text-primary",
      sub: "Excludes cancelled",
    },
    {
      label: "Total Orders",
      value: String(stats.orderCount),
      icon: "receipt_long",
      tone: "text-tertiary",
      sub: `${stats.pending} pending fulfillment`,
    },
    {
      label: "Avg. Order Value",
      value: formatINR(stats.avg),
      icon: "trending_up",
      tone: "text-secondary",
      sub: "Per completed order",
    },
    {
      label: "Active Products",
      value: String(stats.productCount),
      icon: "inventory_2",
      tone: "text-trust-olive",
      sub: "In online catalog",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Store Dashboard
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            Live overview of sales, fulfillment, stock, and orders.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-xs font-bold uppercase px-4 py-2 rounded-lg hover:bg-primary-container transition-colors shadow-sm"
          >
            <Icon name="receipt_long" className="text-sm" /> Manage Orders
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 bg-surface-container-high text-primary border border-outline-variant font-label-md text-xs font-bold uppercase px-4 py-2 rounded-lg hover:bg-surface-container-highest transition-colors"
          >
            <Icon name="add" className="text-sm" /> Add Product
          </Link>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {stats.lowStock && stats.lowStock.length > 0 && (
        <div className="bg-secondary-fixed/30 border border-secondary/40 rounded-xl p-4 flex items-start gap-3">
          <Icon name="warning" fill className="text-secondary mt-0.5 text-xl" />
          <div className="flex-1">
            <h3 className="font-label-md text-sm font-bold text-on-surface">
              Low Stock Alert ({stats.lowStock.length} items low)
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant mb-2">
              The following variants are running low on inventory:
            </p>
            <div className="flex flex-wrap gap-2">
              {stats.lowStock.map((ls, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 bg-surface px-2.5 py-1 rounded-md text-xs border border-outline-variant font-medium text-on-surface"
                >
                  <span className="font-bold">{ls.product_name}</span> ({ls.label}):{" "}
                  <span className="font-bold text-error">{ls.stock} left</span>
                </span>
              ))}
            </div>
          </div>
          <Link
            href="/admin/products"
            className="font-label-md text-xs font-bold text-primary hover:underline whitespace-nowrap"
          >
            Update Stock &rarr;
          </Link>
        </div>
      )}

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-md text-xs font-bold text-on-surface-variant uppercase">
                {card.label}
              </span>
              <Icon name={card.icon} fill className={`text-[20px] ${card.tone}`} />
            </div>
            <p className="tabular font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
              {card.value}
            </p>
            {card.sub && (
              <p className="font-body-md text-xs text-on-surface-variant mt-1">
                {card.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Payment Split & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Payment breakdown */}
        <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="font-headline-md text-base font-bold text-on-surface">
            Payment Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant">
              <span className="font-label-md text-[11px] font-bold text-trust-olive uppercase block">
                Cash on Delivery
              </span>
              <span className="tabular font-headline-md text-2xl font-bold text-on-surface mt-1 block">
                {stats.codCount}
              </span>
              <span className="text-xs text-on-surface-variant">Orders</span>
            </div>
            <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant">
              <span className="font-label-md text-[11px] font-bold text-primary uppercase block">
                Online (UPI/Cards)
              </span>
              <span className="tabular font-headline-md text-2xl font-bold text-on-surface mt-1 block">
                {stats.onlineCount}
              </span>
              <span className="text-xs text-on-surface-variant">Orders</span>
            </div>
          </div>
          <div className="pt-2">
            <div className="flex justify-between text-xs text-on-surface-variant mb-1 font-medium">
              <span>COD ({stats.orderCount > 0 ? Math.round((stats.codCount / stats.orderCount) * 100) : 0}%)</span>
              <span>Online ({stats.orderCount > 0 ? Math.round((stats.onlineCount / stats.orderCount) * 100) : 0}%)</span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden flex">
              <div
                className="bg-trust-olive h-full"
                style={{
                  width: `${stats.orderCount > 0 ? (stats.codCount / stats.orderCount) * 100 : 50}%`,
                }}
              />
              <div
                className="bg-primary h-full"
                style={{
                  width: `${stats.orderCount > 0 ? (stats.onlineCount / stats.orderCount) * 100 : 50}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Top selling items */}
        <div className="lg:col-span-2 bg-surface border border-outline-variant rounded-xl p-5 shadow-sm">
          <h2 className="font-headline-md text-base font-bold text-on-surface mb-4">
            Top Performing Products
          </h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-4 text-center">
              No product sales data recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((tp, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-surface text-primary font-bold text-xs flex items-center justify-center border border-outline-variant">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-body-md text-sm font-semibold text-on-surface">
                        {tp.product_name}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {tp.qty} units sold
                      </p>
                    </div>
                  </div>
                  <span className="tabular font-headline-md text-sm font-bold text-primary">
                    {formatINR(tp.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
          <div>
            <h2 className="font-headline-md text-lg font-bold text-on-surface">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-on-surface-variant">
              Quick status updates and customer WhatsApp links.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="font-label-md text-xs font-bold text-primary hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            View All Orders <Icon name="arrow_forward" className="text-sm" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-6 py-12 font-body-md text-sm text-on-surface-variant text-center">
            No customer orders placed yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-xs uppercase text-on-surface-variant font-label-md">
                  <th className="px-6 py-3">Order #</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {recent.map((o) => {
                  const whatsappMsg = encodeURIComponent(
                    `Hello ${o.customer_name}, this is Aadil from Safa Kesar. Regarding your order #${o.order_number} for ${formatINR(o.total)}: Your order is currently marked as ${o.status.toUpperCase()}. Let us know if you need any assistance!`
                  );

                  return (
                    <tr key={o.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-primary">
                        <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                          {o.order_number}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-on-surface">{o.customer_name}</p>
                        <p className="text-xs text-on-surface-variant">{o.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-label-md text-[11px] font-bold uppercase text-on-surface-variant">
                          {o.payment_method === "cod" ? "Cash on Delivery" : "Online UPI"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-label-md uppercase ${
                            STATUS_STYLES[o.status] ?? ""
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 tabular font-bold text-on-surface">
                        {formatINR(o.total)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://wa.me/${o.phone.replace(/\D/g, "")}?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 bg-trust-olive/15 text-trust-olive hover:bg-trust-olive hover:text-white px-2.5 py-1 rounded text-xs font-bold transition-colors"
                            title="Send WhatsApp update"
                          >
                            <Icon name="chat" fill className="text-[14px]" /> WhatsApp
                          </a>
                          <Link
                            href={`/admin/orders/${o.id}/invoice`}
                            className="p-1 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container"
                            title="Print Invoice / Packing Slip"
                          >
                            <Icon name="print" className="text-[18px]" />
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
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { formatINR } from "@/lib/money";
import { getOrderById, getSettings } from "@/lib/queries";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function OrderInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(Number(id));
  if (!order) notFound();

  const settings = getSettings();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top action bar (hidden during print) */}
      <div className="flex items-center justify-between print:hidden border-b border-outline-variant pb-4">
        <Link
          href={`/admin/orders/${order.id}`}
          className="font-label-md text-xs font-bold uppercase text-on-surface-variant hover:text-primary flex items-center gap-1"
        >
          <Icon name="arrow_back" className="text-sm" /> Back to Order Details
        </Link>
        <div className="flex items-center gap-3">
          <PrintButton />
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 sm:p-12 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-outline-variant pb-8">
          <div>
            <div className="font-headline-md text-2xl font-bold text-kesar-deep-red tracking-tight flex items-center gap-2 mb-1">
              <Icon name="spa" fill className="text-secondary" />
              Safa Kesar
            </div>
            <p className="font-body-md text-xs text-on-surface-variant max-w-xs leading-relaxed">
              {settings.store_address}
            </p>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Phone: {settings.store_phone} • Email: {settings.store_email}
            </p>
          </div>
          <div className="text-right">
            <span className="font-label-md text-xs uppercase tracking-widest font-bold text-trust-olive block mb-1">
              Official Packing Slip &amp; Bill
            </span>
            <p className="font-mono text-xl font-bold text-on-surface">
              {order.order_number}
            </p>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              Date: {new Date(order.created_at + "Z").toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-2 gap-8 py-6 border-b border-outline-variant text-sm">
          <div>
            <h3 className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              Ship To Customer:
            </h3>
            <p className="font-bold text-on-surface text-base">{order.customer_name}</p>
            <p className="text-on-surface whitespace-pre-line mt-1">{order.address}</p>
            <p className="text-on-surface font-semibold">
              {order.city}, {order.state} — {order.pincode}
            </p>
            <p className="text-on-surface-variant mt-2">
              Phone: <span className="font-semibold text-on-surface">{order.phone}</span>
            </p>
            {order.email && (
              <p className="text-on-surface-variant">Email: {order.email}</p>
            )}
          </div>

          <div className="text-right">
            <h3 className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              Fulfillment &amp; Logistics:
            </h3>
            <p className="text-on-surface">
              <span className="text-on-surface-variant">Payment Method:</span>{" "}
              <strong className="uppercase">
                {order.payment_method === "cod" ? "Cash on Delivery" : "Online Prepaid"}
              </strong>
            </p>
            <p className="text-on-surface mt-1">
              <span className="text-on-surface-variant">Status:</span>{" "}
              <strong className="uppercase">{order.status}</strong>
            </p>
            {order.tracking_number && (
              <p className="text-on-surface mt-1">
                <span className="text-on-surface-variant">Carrier:</span>{" "}
                <strong>{order.tracking_carrier}</strong> ({order.tracking_number})
              </p>
            )}
            {order.notes && (
              <div className="mt-3 p-2 bg-surface-container-low rounded text-xs text-left border border-outline-variant">
                <span className="font-bold block text-on-surface">Customer Note:</span>
                <span className="text-on-surface-variant">{order.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Items Table */}
        <div className="py-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant text-xs uppercase font-label-md text-on-surface-variant">
                <th className="pb-3">Item Description</th>
                <th className="pb-3">Weight/Variant</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3 text-right">Unit Price</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 font-semibold text-on-surface">
                    {item.product_name}
                  </td>
                  <td className="py-3 text-on-surface-variant font-medium">
                    {item.variant_label}
                  </td>
                  <td className="py-3 text-center font-bold text-on-surface">
                    {item.qty}
                  </td>
                  <td className="py-3 text-right tabular text-on-surface-variant">
                    {formatINR(item.unit_price)}
                  </td>
                  <td className="py-3 text-right tabular font-bold text-on-surface">
                    {formatINR(item.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="border-t border-outline-variant pt-4 flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal:</span>
              <span className="tabular font-medium text-on-surface">
                {formatINR(order.subtotal)}
              </span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-trust-olive font-medium">
                <span>Coupon ({order.coupon_code}):</span>
                <span className="tabular">-{formatINR(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-on-surface-variant">
              <span>Shipping Fee:</span>
              <span className="tabular font-medium text-on-surface">
                {order.shipping === 0 ? "FREE" : formatINR(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t-2 border-primary pt-2 text-base font-bold text-on-surface">
              <span>Total Amount:</span>
              <span className="tabular text-primary text-lg">
                {formatINR(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Authenticity Footer */}
        <div className="mt-12 pt-6 border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-2 text-trust-olive font-bold">
            <Icon name="verified" className="text-base" />
            100% Guaranteed Pure Kashmiri Saffron &amp; Heritage Dry Fruits
          </div>
          <p>Thank you for supporting local Kashmir farmers!</p>
        </div>
      </div>
    </div>
  );
}

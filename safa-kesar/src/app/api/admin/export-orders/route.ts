import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getOrders, getOrderById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const orders = getOrders();

  // CSV headers matching standard logistics (Delhivery / Courier) & accounting format
  const headers = [
    "Order Number",
    "Order Date",
    "Customer Name",
    "Phone Number",
    "Email",
    "Shipping Address",
    "City",
    "State",
    "Pincode",
    "Payment Method",
    "Status",
    "Tracking Carrier",
    "Tracking Number",
    "Item Count",
    "Items Summary",
    "Subtotal (INR)",
    "Discount (INR)",
    "Coupon Code",
    "Shipping (INR)",
    "Total (INR)",
  ];

  const rows = orders.map((o) => {
    const full = getOrderById(o.id);
    const itemsSummary = full?.items
      ? full.items.map((i) => `${i.product_name} (${i.variant_label}) x${i.qty}`).join(" | ")
      : "";

    return [
      `"${o.order_number}"`,
      `"${new Date(o.created_at + "Z").toISOString()}"`,
      `"${o.customer_name.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.email ?? ""}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      `"${o.city.replace(/"/g, '""')}"`,
      `"${o.state.replace(/"/g, '""')}"`,
      `"${o.pincode}"`,
      `"${o.payment_method.toUpperCase()}"`,
      `"${o.status.toUpperCase()}"`,
      `"${o.tracking_carrier || "Delhivery"}"`,
      `"${o.tracking_number || ""}"`,
      o.item_count,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      (o.subtotal / 100).toFixed(2),
      (o.discount_amount / 100).toFixed(2),
      `"${o.coupon_code || ""}"`,
      (o.shipping / 100).toFixed(2),
      (o.total / 100).toFixed(2),
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\r\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="safa-kesar-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

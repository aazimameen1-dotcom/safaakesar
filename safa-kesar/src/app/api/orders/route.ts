import { NextResponse } from "next/server";
import {
  createOrder,
  OrderError,
  type NewOrderCustomer,
  type NewOrderItem,
} from "@/lib/queries";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer } = body as {
      items: NewOrderItem[];
      customer: NewOrderCustomer;
    };
    if (!Array.isArray(items) || typeof customer !== "object") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { orderNumber } = createOrder(items, customer);
    return NextResponse.json({ orderNumber });
  } catch (err) {
    if (err instanceof OrderError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Order creation failed:", err);
    return NextResponse.json(
      { error: "Could not place the order. Please try again." },
      { status: 500 }
    );
  }
}

import type { Metadata } from "next";
import CheckoutForm from "./CheckoutForm";
import { getActiveProducts, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  const settings = getSettings();
  const products = getActiveProducts();
  const codByProduct = Object.fromEntries(
    products.map((p) => [p.id, p.cod_enabled === 1])
  );
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
      <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-walnut-ink mb-4">
        Checkout
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-12">
        Secure, unhurried, and transparent — like everything we do.
      </p>
      <CheckoutForm
        freeShippingThreshold={settings.free_shipping_threshold}
        flatShipping={settings.flat_shipping}
        codEnabled={settings.cod_enabled}
        codByProduct={codByProduct}
      />
    </main>
  );
}

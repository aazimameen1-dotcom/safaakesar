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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface mb-2 font-bold">
        Checkout
      </h1>
      <p className="font-body-md text-sm sm:text-base text-on-surface-variant mb-8 sm:mb-10">
        Direct from Lethipora, Pampore. Sourced with radical transparency.
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

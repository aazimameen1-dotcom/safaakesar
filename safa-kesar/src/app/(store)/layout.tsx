import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HarvestBanner from "@/components/HarvestBanner";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import { getSettings } from "@/lib/queries";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSettings();
  return (
    <CartProvider>
      <HarvestBanner text={settings.harvest_banner} />
      <Header />
      <main className="pb-24 md:pb-0 flex-1">{children}</main>
      <Footer settings={settings} />
      <WhatsAppFAB
        number={settings.whatsapp_number}
        label={settings.whatsapp_label}
      />
      <CartDrawer freeShippingThreshold={settings.free_shipping_threshold} />
    </CartProvider>
  );
}

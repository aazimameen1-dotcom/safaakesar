import Link from "next/link";
import Icon from "./Icon";
import type { SiteSettings } from "@/lib/queries";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-surface-container border-t border-outline-variant pb-24 md:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-16 max-w-container-max mx-auto">
        <div className="col-span-1 md:col-span-2">
          <div className="font-headline-md text-headline-md font-bold text-kesar-deep-red mb-3 flex items-center gap-2">
            <Icon name="spa" fill className="text-secondary" />
            Safa Kesar
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-6 leading-relaxed">
            Pure Artisanal Kashmiri Saffron, Walnuts, and Organic Dry Fruits directly from the fields of Lethipora, Pampore. Sourced with radical transparency.
          </p>
          <p className="font-label-md text-xs text-on-surface-variant">
            © {new Date().getFullYear()} Safa Kesar Pampore. Heritage of NH 44.
          </p>
        </div>
        <div>
          <h4 className="font-label-md text-sm font-bold text-on-surface uppercase tracking-wider mb-4">
            Quick Links
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/shop"
                className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-all block"
              >
                Shop Catalog
              </Link>
            </li>
            <li>
              <Link
                href="/education#origin"
                className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-all block"
              >
                Pampore Origin Story
              </Link>
            </li>
            <li>
              <Link
                href="/education"
                className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-all block"
              >
                Saffron Purity Guide
              </Link>
            </li>
            <li>
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(
                  "Hello Safa Kesar, I would like to make a bulk inquiry for Kashmiri Saffron & Dry Fruits."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-all block"
              >
                Bulk &amp; Wholesale Inquiries
              </a>
            </li>
            <li>
              <Link
                href="/visit"
                className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-all block"
              >
                Visit Our Showroom (NH 44)
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-md text-sm font-bold text-on-surface uppercase tracking-wider mb-4">
            Showroom &amp; Contact
          </h4>
          <p className="font-body-md text-sm text-on-surface-variant mb-4 whitespace-pre-line leading-relaxed">
            {settings.store_address}
          </p>
          <p className="font-body-md text-sm text-on-surface-variant mb-4">
            <span className="font-bold text-on-surface">Phone:</span> {settings.store_phone}
            <br />
            <span className="font-bold text-on-surface">Email:</span> {settings.store_email}
          </p>
          <div className="flex items-center gap-2 text-trust-olive bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant w-fit">
            <Icon name="chat" fill className="text-[18px]" />
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}?text=${encodeURIComponent(
                "Hello Safa Kesar, I have a question about your Kashmiri Saffron and Dry Fruits products."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="font-label-md text-xs font-bold uppercase hover:underline"
            >
              {settings.whatsapp_label}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

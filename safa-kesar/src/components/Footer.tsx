import Link from "next/link";
import Icon from "./Icon";
import type { SiteSettings } from "@/lib/queries";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-surface-container border-t border-outline-variant pb-24 md:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-16 max-w-container-max mx-auto">
        <div className="col-span-1 md:col-span-2">
          <div className="font-headline-md text-headline-md text-primary mb-4">
            Safa Kesar
          </div>
          <p className="font-body-md text-body-md text-walnut-ink max-w-sm mb-6">
            Premium Kashmiri Saffron, directly from the fields of Lethipora,
            Pampore.
          </p>
          <p className="font-label-caps text-label-caps text-on-surface-variant">
            © {new Date().getFullYear()} Safa Kesar Pampore. Heritage of NH 44.
          </p>
        </div>
        <div>
          <h4 className="font-label-caps text-label-caps text-walnut-ink uppercase tracking-wider mb-4">
            Quick Links
          </h4>
          <ul className="space-y-3">
            <li>
              <Link
                href="/education#origin"
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-all block"
              >
                Our Story
              </Link>
            </li>
            <li>
              <Link
                href="/education#certified"
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-all block"
              >
                Laboratory Reports
              </Link>
            </li>
            <li>
              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noreferrer"
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-all block"
              >
                Bulk Inquiries
              </a>
            </li>
            <li>
              <Link
                href="/visit"
                className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-all block"
              >
                Visit Us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-caps text-label-caps text-walnut-ink uppercase tracking-wider mb-4">
            Contact Us
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4 whitespace-pre-line">
            {settings.store_address}
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">
            {settings.store_phone}
            <br />
            {settings.store_email}
          </p>
          <div className="flex items-center gap-2 text-trust-olive">
            <Icon name="qr_code_2" className="text-[18px]" />
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              target="_blank"
              rel="noreferrer"
              className="font-label-caps text-label-caps uppercase hover:underline"
            >
              {settings.whatsapp_label}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

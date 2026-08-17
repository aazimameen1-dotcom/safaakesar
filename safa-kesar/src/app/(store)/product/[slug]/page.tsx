import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchase from "@/components/ProductPurchase";
import { getProductBySlug, getProductImages, getSettings } from "@/lib/queries";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product ? product.name : "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const settings = getSettings();
  const images = getProductImages(product);
  const hasLabData = Boolean(
    product.crocin || product.safranal || product.picrocrocin
  );

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-16">
      {/* Breadcrumb */}
      <nav className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-6 flex items-center gap-2">
        <Link href="/shop" className="hover:text-primary transition-colors">
          Shop
        </Link>
        <Icon name="chevron_right" className="text-[14px]" />
        <span className="text-walnut-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        {/* Gallery */}
        <div className="md:col-span-7 mb-8 md:mb-0">
          <ProductGallery
            images={images}
            name={product.name}
            originBadge={product.origin || undefined}
          />
        </div>

        {/* Details */}
        <div className="md:col-span-5">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-walnut-ink mb-2">
            {product.name}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">
            {product.short_desc}
          </p>

          {product.reviews_count > 0 && (
            <a
              href="#reviews"
              className="inline-flex items-center gap-2 mb-6 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Icon
                    key={s}
                    name="star"
                    fill={s <= Math.round(product.rating)}
                    className={`text-[16px] ${
                      s <= Math.round(product.rating) ? "text-secondary" : "text-outline-variant"
                    }`}
                  />
                ))}
              </span>
              <span className="font-body-md text-sm">
                {product.rating.toFixed(1)} ({product.reviews_count} Reviews)
              </span>
            </a>
          )}

          <div className="border-y border-outline-variant py-6 my-6">
            <ProductPurchase
              productId={product.id}
              slug={product.slug}
              name={product.name}
              image={product.image}
              variants={product.variants}
            />
          </div>

          {/* Verification block */}
          {(product.batch_no || hasLabData) && (
            <div className="inset-card rounded p-5 mb-6">
              <p className="font-label-caps text-label-caps text-trust-olive uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Icon name="verified" fill className="text-[16px]" />
                Verified Origin &amp; Quality
              </p>
              <div className="grid grid-cols-3 gap-3">
                {product.batch_no && (
                  <div>
                    <p className="font-label-caps text-[10px] uppercase text-on-surface-variant mb-1">
                      Batch
                    </p>
                    <p className="tabular font-price-display text-price-display text-walnut-ink">
                      #{product.batch_no}
                    </p>
                  </div>
                )}
                {product.harvest_date && (
                  <div>
                    <p className="font-label-caps text-[10px] uppercase text-on-surface-variant mb-1">
                      Harvest
                    </p>
                    <p className="font-body-md text-sm font-medium text-walnut-ink">
                      {product.harvest_date}
                    </p>
                  </div>
                )}
                {product.crocin && (
                  <div>
                    <p className="font-label-caps text-[10px] uppercase text-on-surface-variant mb-1">
                      Lab Tested
                    </p>
                    <p className="font-body-md text-sm font-medium text-walnut-ink">
                      Crocin {product.crocin}+
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Micro trust badges */}
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="flex items-center gap-1.5 font-label-caps text-[10px] uppercase text-on-surface-variant">
              <Icon name="local_shipping" fill className="text-[14px] text-trust-olive" />
              Free Shipping &gt; {formatINR(settings.free_shipping_threshold)}
            </span>
            <span className="flex items-center gap-1.5 font-label-caps text-[10px] uppercase text-on-surface-variant">
              <Icon name="lock" fill className="text-[14px] text-trust-olive" />
              Secure Checkout
            </span>
            <span className="flex items-center gap-1.5 font-label-caps text-[10px] uppercase text-on-surface-variant">
              <Icon
                name={product.cod_enabled ? "payments" : "credit_card"}
                fill
                className="text-[14px] text-trust-olive"
              />
              {product.cod_enabled ? "Cash on Delivery" : "Online Payment Only"}
            </span>
          </div>

          {/* Accordions */}
          <div className="divide-y divide-outline-variant border-y border-outline-variant">
            <details open className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-walnut-ink list-none">
                The Pampore Origin
                <Icon
                  name="expand_more"
                  className="transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="font-body-md text-body-md text-on-surface-variant pt-3 leading-relaxed">
                Grown on the karewa highlands of Lethipora, Pampore — the
                historical heartland of Kashmiri saffron. Well-drained soil, cool
                nights, and generations of specialized knowledge produce the
                world&apos;s finest Mongra threads.
              </p>
            </details>

            {hasLabData && (
              <details className="group py-4">
                <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-walnut-ink list-none">
                  Lab Test Results
                  <Icon
                    name="expand_more"
                    className="transition-transform group-open:rotate-180"
                  />
                </summary>
                <div className="pt-3">
                  <p className="font-body-md text-sm text-on-surface-variant mb-4">
                    Tested at an ISO 3632 NABL-accredited laboratory. Category I
                    (highest) classification across all three metrics.
                  </p>
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-outline-variant">
                      {[
                        ["Crocin (coloring strength)", product.crocin],
                        ["Safranal (aroma)", product.safranal],
                        ["Picrocrocin (flavor)", product.picrocrocin],
                      ]
                        .filter(([, v]) => v)
                        .map(([label, value]) => (
                          <tr key={label as string}>
                            <th className="py-2 pr-4 font-body-md text-sm font-medium text-walnut-ink">
                              {label}
                            </th>
                            <td className="tabular py-2 text-right font-price-display text-sm text-trust-olive">
                              {value}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}

            <details className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-walnut-ink list-none">
                Shipping &amp; Returns
                <Icon
                  name="expand_more"
                  className="transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="pt-3 font-body-md text-body-md text-on-surface-variant space-y-2">
                <p>3–5 business days within India. Free shipping on orders over {formatINR(settings.free_shipping_threshold)}.</p>
                <p>
                  Packed in a tamper-evident glass jar inside a light-blocking box
                  to protect aroma and color.
                </p>
                <p>
                  Returns accepted only if the seal is broken on arrival —
                  contact us within 48 hours.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}

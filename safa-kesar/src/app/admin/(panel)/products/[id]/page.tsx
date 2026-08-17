import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "../ProductForm";
import { getProductById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary uppercase tracking-wider"
        >
          ← Products
        </Link>
        <h1 className="font-headline-lg text-headline-lg text-walnut-ink">
          {product.name}
        </h1>
      </div>
      <ProductForm
        initial={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          short_desc: product.short_desc,
          description: product.description,
          image: product.image,
          gallery: (() => {
            try {
              const arr = JSON.parse(product.images || "[]");
              return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
            } catch {
              return [];
            }
          })(),
          badge: product.badge,
          rating: product.rating,
          reviews_count: product.reviews_count,
          batch_no: product.batch_no,
          harvest_date: product.harvest_date,
          crocin: product.crocin,
          safranal: product.safranal,
          picrocrocin: product.picrocrocin,
          origin: product.origin,
          cod_enabled: product.cod_enabled,
          sort_order: product.sort_order,
          active: product.active,
          variants: product.variants.map((v) => ({
            label: v.label,
            price: v.price / 100,
          })),
        }}
      />
    </div>
  );
}

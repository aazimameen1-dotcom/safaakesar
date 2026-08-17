import Link from "next/link";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
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
          New Product
        </h1>
      </div>
      <ProductForm
        initial={{
          slug: "",
          name: "",
          category: "dry-fruits",
          short_desc: "",
          description: "",
          image: "",
          gallery: [],
          badge: "",
          rating: 4.8,
          reviews_count: 0,
          batch_no: "",
          harvest_date: "",
          crocin: "",
          safranal: "",
          picrocrocin: "",
          origin: "",
          cod_enabled: 1,
          sort_order: 99,
          active: 1,
          variants: [],
        }}
      />
    </div>
  );
}

import Link from "next/link";
import Icon from "@/components/Icon";
import { formatINR } from "@/lib/money";
import { getAllProducts } from "@/lib/queries";
import { deleteProductAction } from "../../actions";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  saffron: "Saffron",
  "dry-fruits": "Dry Fruits",
  wellness: "Wellness",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const { saved, deleted } = await searchParams;
  const products = getAllProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-walnut-ink">Products</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {products.length} products in the catalog.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps uppercase tracking-wider px-5 py-3 rounded transition-colors flex items-center gap-2"
        >
          <Icon name="add" className="text-[18px]" />
          New Product
        </Link>
      </div>

      {saved && (
        <p className="font-body-md text-sm text-trust-olive bg-trust-olive/10 border border-trust-olive/30 rounded p-3">
          Product saved.
        </p>
      )}
      {deleted && (
        <p className="font-body-md text-sm text-error bg-error-container/40 border border-error/20 rounded p-3">
          Product deleted.
        </p>
      )}

      <div className="bg-surface border border-outline-variant rounded overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="px-5 py-3 font-label-caps text-[10px] uppercase text-on-surface-variant">Product</th>
              <th className="px-3 py-3 font-label-caps text-[10px] uppercase text-on-surface-variant">Category</th>
              <th className="px-3 py-3 font-label-caps text-[10px] uppercase text-on-surface-variant">Variants</th>
              <th className="px-3 py-3 font-label-caps text-[10px] uppercase text-on-surface-variant">Price Range</th>
              <th className="px-3 py-3 font-label-caps text-[10px] uppercase text-on-surface-variant">Status</th>
              <th className="px-5 py-3 font-label-caps text-[10px] uppercase text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {products.map((p) => {
              const prices = p.variants.map((v) => v.price);
              return (
                <tr key={p.id} className="hover:bg-surface-container-low/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 rounded border border-outline-variant bg-surface-container overflow-hidden">
                        {p.image && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={p.image} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-body-md text-sm font-medium text-walnut-ink truncate">
                          {p.name}
                        </p>
                        <p className="font-label-caps text-[10px] uppercase text-on-surface-variant">
                          /{p.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-body-md text-sm text-on-surface-variant">
                    {CATEGORY_LABELS[p.category]}
                  </td>
                  <td className="px-3 py-3 font-body-md text-sm text-on-surface-variant">
                    {p.variants.map((v) => v.label).join(", ") || "—"}
                  </td>
                  <td className="tabular px-3 py-3 font-body-md text-sm text-walnut-ink">
                    {prices.length
                      ? prices.length === 1
                        ? formatINR(prices[0])
                        : `${formatINR(Math.min(...prices))} – ${formatINR(Math.max(...prices))}`
                      : "—"}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`font-label-caps text-[10px] uppercase rounded px-2 py-1 ${
                          p.active
                            ? "bg-trust-olive/15 text-trust-olive"
                            : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        {p.active ? "Live" : "Hidden"}
                      </span>
                      <span
                        className={`font-label-caps text-[10px] uppercase rounded px-2 py-1 ${
                          p.cod_enabled
                            ? "bg-tertiary-fixed/60 text-on-tertiary-fixed-variant"
                            : "bg-surface-container-highest text-on-surface-variant"
                        }`}
                      >
                        COD {p.cod_enabled ? "On" : "Off"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/product/${p.slug}`}
                        target="_blank"
                        className="p-2 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                        aria-label="View on storefront"
                      >
                        <Icon name="visibility" className="text-[18px]" />
                      </Link>
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-2 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                        aria-label="Edit product"
                      >
                        <Icon name="edit" className="text-[18px]" />
                      </Link>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="p-2 rounded text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors"
                          aria-label={`Delete ${p.name}`}
                        >
                          <Icon name="delete" className="text-[18px]" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

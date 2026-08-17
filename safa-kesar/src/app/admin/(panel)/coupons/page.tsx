import Icon from "@/components/Icon";
import { formatINR } from "@/lib/money";
import { getCoupons } from "@/lib/queries";
import { saveCouponAction, deleteCouponAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = getCoupons();

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Discount Coupons &amp; Promo Codes
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant">
            Create percentage or flat discounts for promotions and seasonal marketing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Active Coupons Table */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-headline-md text-lg font-bold text-on-surface">
            Active Promo Codes ({coupons.length})
          </h2>

          {coupons.length === 0 ? (
            <div className="bg-surface border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant text-sm">
              No promo codes created yet. Use the form to create your first coupon.
            </div>
          ) : (
            <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low text-xs uppercase font-label-md text-on-surface-variant">
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Discount</th>
                    <th className="px-4 py-3">Min Order</th>
                    <th className="px-4 py-3">Used</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-primary text-base">
                        {c.code}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-on-surface">
                        {c.discount_type === "percent"
                          ? `${c.discount_value}% OFF`
                          : `${formatINR(c.discount_value)} OFF`}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-on-surface-variant tabular">
                        {c.min_order_amount > 0 ? formatINR(c.min_order_amount) : "No minimum"}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-on-surface tabular">
                        {c.times_used} {c.usage_limit > 0 ? `/ ${c.usage_limit}` : "times"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-label-md uppercase font-bold ${
                            c.active
                              ? "bg-trust-olive/20 text-trust-olive"
                              : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          {c.active ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <form action={deleteCouponAction} className="inline-block">
                          <input type="hidden" name="id" value={c.id} />
                          <button
                            type="submit"
                            className="p-1 text-outline hover:text-error transition-colors"
                            aria-label={`Delete coupon ${c.code}`}
                          >
                            <Icon name="delete" className="text-lg" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Create / Edit Coupon Form */}
        <div className="lg:col-span-5 bg-surface border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-headline-md text-base font-bold text-on-surface flex items-center gap-2">
            <Icon name="add_circle" className="text-primary" /> Create New Promo Code
          </h2>

          <form action={saveCouponAction} className="space-y-4">
            <div>
              <label htmlFor="code" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                Coupon Code *
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                placeholder="e.g. HARVEST10 or KASHMIR500"
                className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg px-3.5 py-2.5 font-mono uppercase text-sm font-bold text-primary focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="discount_type" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                  Type *
                </label>
                <select
                  id="discount_type"
                  name="discount_type"
                  defaultValue="percent"
                  className="w-full border border-outline-variant bg-surface rounded-lg px-3 py-2 text-sm font-body-md"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label htmlFor="discount_value" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                  Discount Value *
                </label>
                <input
                  id="discount_value"
                  name="discount_value"
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 10 or 200"
                  className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg px-3 py-2 text-sm font-body-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="min_order_rupees" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                  Min Order (₹)
                </label>
                <input
                  id="min_order_rupees"
                  name="min_order_rupees"
                  type="number"
                  defaultValue="0"
                  placeholder="e.g. 1500"
                  className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg px-3 py-2 text-sm font-body-md"
                />
              </div>

              <div>
                <label htmlFor="max_discount_rupees" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                  Max Cap (₹)
                </label>
                <input
                  id="max_discount_rupees"
                  name="max_discount_rupees"
                  type="number"
                  defaultValue="0"
                  placeholder="0 = no cap"
                  className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg px-3 py-2 text-sm font-body-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="usage_limit" className="block font-label-md text-xs uppercase font-bold text-on-surface-variant mb-1">
                Usage Limit (0 for unlimited)
              </label>
              <input
                id="usage_limit"
                name="usage_limit"
                type="number"
                defaultValue="0"
                placeholder="e.g. 50 uses"
                className="w-full border border-outline-variant bg-surface-container-lowest rounded-lg px-3 py-2 text-sm font-body-md"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-body-md text-sm text-on-surface">
                <input
                  type="checkbox"
                  name="active"
                  defaultChecked
                  className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                />
                <span>Active and usable by customers at checkout</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold uppercase py-3 rounded-lg transition-colors shadow-sm"
            >
              Save Promo Code
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

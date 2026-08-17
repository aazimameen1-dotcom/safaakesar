import { getSettings } from "@/lib/queries";
import {
  saveSettingsAction,
  changePasswordAction,
} from "../../actions";
import PasswordForm from "./PasswordForm";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full border border-outline-variant bg-warm-ivory rounded px-3 py-2.5 font-body-md text-body-md text-walnut-ink focus:outline-none focus:border-primary";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  hint,
  span2,
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  type?: string;
  hint?: string;
  span2?: boolean;
}) {
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label htmlFor={name} className="block font-label-caps text-label-caps text-walnut-ink uppercase mb-2">
        {label}
      </label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} className={`${inputClass} ${type === "number" ? "tabular" : ""}`} />
      {hint && <p className="font-body-md text-xs text-on-surface-variant mt-1">{hint}</p>}
    </div>
  );
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const s = getSettings();

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-walnut-ink">Settings</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Store-wide content and configuration.
        </p>
      </div>

      {saved && (
        <p className="font-body-md text-sm text-trust-olive bg-trust-olive/10 border border-trust-olive/30 rounded p-3">
          Settings saved.
        </p>
      )}

      {/* Store settings */}
      <form action={saveSettingsAction} className="space-y-8">
        <section className="bg-surface border border-outline-variant rounded p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <h2 className="font-headline-md text-headline-md text-walnut-ink sm:col-span-2 mb-2">
            Storefront
          </h2>
          <Field
            label="Harvest Banner Text"
            name="harvest_banner"
            defaultValue={s.harvest_banner}
            span2
            hint="The thin bar at the very top of every page. Leave blank to hide."
          />
          <Field
            label="WhatsApp Number (with country code)"
            name="whatsapp_number"
            defaultValue={s.whatsapp_number}
            hint="Digits only, e.g. 919797756756"
          />
          <Field label="WhatsApp Button Label" name="whatsapp_label" defaultValue={s.whatsapp_label} />
          <div className="sm:col-span-2">
            <label
              htmlFor="cod_enabled"
              className="flex items-start gap-3 border border-outline-variant bg-warm-ivory rounded p-4 cursor-pointer transition-colors hover:border-primary"
            >
              <input
                type="checkbox"
                id="cod_enabled"
                name="cod_enabled"
                defaultChecked={s.cod_enabled}
                className="mt-0.5 h-4 w-4 accent-[#851a08]"
              />
              <span>
                <span className="block font-body-md text-body-md font-medium text-walnut-ink">
                  Cash on Delivery (COD)
                </span>
                <span className="block font-body-md text-sm text-on-surface-variant">
                  When off, customers can only pay online at checkout, and COD
                  orders are rejected by the server.
                </span>
              </span>
            </label>
          </div>
        </section>

        <section className="bg-surface border border-outline-variant rounded p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <h2 className="font-headline-md text-headline-md text-walnut-ink sm:col-span-2 mb-2">
            Shipping
          </h2>
          <Field
            label="Flat Shipping Fee (₹)"
            name="flat_shipping"
            defaultValue={s.flat_shipping / 100}
            type="number"
            hint="Charged when the order is below the free threshold."
          />
          <Field
            label="Free Shipping Threshold (₹)"
            name="free_shipping"
            defaultValue={s.free_shipping_threshold / 100}
            type="number"
            hint="Orders at or above this amount ship free."
          />
        </section>

        <section className="bg-surface border border-outline-variant rounded p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <h2 className="font-headline-md text-headline-md text-walnut-ink sm:col-span-2 mb-2">
            Contact &amp; Address
          </h2>
          <Field label="Store Address" name="store_address" defaultValue={s.store_address} span2 />
          <Field label="Phone" name="store_phone" defaultValue={s.store_phone} />
          <Field label="Email" name="store_email" defaultValue={s.store_email} />
        </section>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps uppercase tracking-wider px-8 py-3.5 rounded transition-colors"
        >
          Save Settings
        </button>
      </form>

      {/* Password */}
      <section className="bg-surface border border-outline-variant rounded p-6">
        <h2 className="font-headline-md text-headline-md text-walnut-ink mb-4">
          Admin Password
        </h2>
        <PasswordForm action={changePasswordAction} />
      </section>
    </div>
  );
}

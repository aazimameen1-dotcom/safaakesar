"use client";

import { useActionState } from "react";
import Icon from "@/components/Icon";

type State = { error?: string; success?: string } | undefined;
type Action = (
  prev: State,
  formData: FormData
) => Promise<{ error?: string; success?: string }>;

export default function PasswordForm({ action }: { action: Action }) {
  const [state, formAction, pending] = useActionState<State, FormData>(action, undefined);

  const inputClass =
    "w-full border border-outline-variant bg-warm-ivory rounded px-3 py-2.5 font-body-md text-body-md text-walnut-ink focus:outline-none focus:border-primary";

  return (
    <form action={formAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
      <div>
        <label htmlFor="current_password" className="block font-label-caps text-label-caps text-walnut-ink uppercase mb-2">
          Current Password
        </label>
        <input id="current_password" name="current_password" type="password" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="new_password" className="block font-label-caps text-label-caps text-walnut-ink uppercase mb-2">
          New Password
        </label>
        <input id="new_password" name="new_password" type="password" required minLength={6} className={inputClass} />
      </div>
      {state?.error && (
        <p className="sm:col-span-2 font-body-md text-sm text-error bg-error-container/40 border border-error/20 rounded p-3">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="sm:col-span-2 font-body-md text-sm text-trust-olive bg-trust-olive/10 border border-trust-olive/30 rounded p-3 flex items-center gap-2">
          <Icon name="check_circle" fill className="text-[16px]" />
          {state.success}
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="border border-walnut-ink text-walnut-ink hover:bg-surface-variant disabled:opacity-60 font-label-caps text-label-caps uppercase tracking-wider px-6 py-2.5 rounded transition-colors"
        >
          {pending ? "Updating…" : "Change Password"}
        </button>
      </div>
    </form>
  );
}

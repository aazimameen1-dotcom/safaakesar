"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "../actions";
import Icon from "@/components/Icon";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <main className="min-h-screen flex items-center justify-center px-margin-mobile bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-headline-md text-headline-md font-bold text-primary"
          >
            Safa Kesar
          </Link>
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mt-2">
            Store Administration
          </p>
        </div>

        <form
          action={formAction}
          className="bg-surface border border-outline-variant rounded p-8 space-y-5"
        >
          <div>
            <label
              htmlFor="password"
              className="block font-label-caps text-label-caps text-walnut-ink uppercase mb-2"
            >
              Admin Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
              className="w-full border border-outline-variant bg-warm-ivory rounded px-3 py-2.5 font-body-md text-body-md text-walnut-ink focus:outline-none focus:border-primary"
            />
          </div>
          {state?.error && (
            <p className="font-body-md text-sm text-error bg-error-container/40 border border-error/20 rounded p-3">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary font-label-caps text-label-caps uppercase tracking-wider px-8 py-3.5 rounded transition-colors flex items-center justify-center gap-2"
          >
            <Icon name="lock_open" className="text-[16px]" />
            {pending ? "Signing in…" : "Sign In"}
          </button>
          <p className="font-body-md text-xs text-on-surface-variant text-center pt-1">
            Default password: <code className="text-walnut-ink">admin123</code> — change
            it in Settings after your first sign-in.
          </p>
        </form>

        <p className="text-center mt-6">
          <Link
            href="/"
            className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary uppercase tracking-wider transition-colors"
          >
            ← Back to store
          </Link>
        </p>
      </div>
    </main>
  );
}

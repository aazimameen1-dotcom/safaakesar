import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminNav from "./AdminNav";
import { logoutAction } from "../actions";
import { isAdmin } from "@/lib/auth";
import Icon from "@/components/Icon";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <aside className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-outline-variant bg-surface md:sticky md:top-0 md:h-screen flex flex-col">
        <div className="px-5 py-5 border-b border-outline-variant flex items-center justify-between md:block">
          <div>
            <Link
              href="/admin"
              className="font-headline-md text-headline-md font-bold text-primary"
            >
              Safa Kesar
            </Link>
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
              Admin Panel
            </p>
          </div>
        </div>
        <div className="p-3 flex-1">
          <AdminNav />
        </div>
        <div className="p-3 border-t border-outline-variant flex flex-col gap-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
          >
            <Icon name="storefront" className="text-[18px]" />
            View Store
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant hover:bg-error-container/40 hover:text-error transition-colors"
            >
              <Icon name="logout" className="text-[18px]" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 px-margin-mobile md:px-10 py-8 md:py-10 max-w-[1200px] w-full">
        {children}
      </div>
    </div>
  );
}

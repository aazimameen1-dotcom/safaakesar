import Link from "next/link";
import Icon from "@/components/Icon";

export default function NotFound() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
      <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-6 text-primary">
        <Icon name="search_off" className="text-3xl" />
      </div>
      <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest mb-2">
        404 — Page Not Found
      </span>
      <h1 className="font-headline-lg text-headline-lg text-walnut-ink mb-4">
        The Harvest Couldn&apos;t Be Found
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-8">
        The page or product you are looking for might have been relocated, sold out, or does not exist.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/shop"
          className="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps uppercase px-6 py-3 rounded-full transition-colors"
        >
          Explore Products
        </Link>
        <Link
          href="/"
          className="border border-walnut-ink text-walnut-ink hover:bg-surface-variant font-label-caps text-label-caps uppercase px-6 py-3 rounded-full transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}

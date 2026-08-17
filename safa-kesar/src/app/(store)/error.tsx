"use client";

import { useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Store error boundary caught:", error);
  }, [error]);

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 flex flex-col items-center justify-center text-center min-h-[500px]">
      <div className="w-16 h-16 rounded-full bg-error-container/20 text-error flex items-center justify-center mb-6">
        <Icon name="warning" className="text-3xl" />
      </div>
      <h1 className="font-headline-lg text-headline-lg text-walnut-ink mb-3">
        Something went wrong
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-8">
        We encountered an unexpected error while loading this page. You can try refreshing or returning to our shop.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps uppercase px-6 py-3 rounded-full transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-walnut-ink text-walnut-ink hover:bg-surface-variant font-label-caps text-label-caps uppercase px-6 py-3 rounded-full transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
}

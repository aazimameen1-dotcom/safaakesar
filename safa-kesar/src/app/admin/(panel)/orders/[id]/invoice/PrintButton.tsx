"use client";

import Icon from "@/components/Icon";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold uppercase px-4 py-2 rounded-lg transition-colors shadow-sm"
    >
      <Icon name="print" className="text-base" /> Print Invoice
    </button>
  );
}

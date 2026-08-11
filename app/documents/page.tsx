"use client";

import { useEffect, useState } from "react";
import { DocumentTable } from "@/components/DocumentTable";
import { getDocuments } from "@/lib/document-store";
import { DocumentRecord } from "@/types";
import Link from "next/link";

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setDocs(getDocuments());
  }, []);

  const filtered =
    filter === "all"
      ? docs
      : filter === "eidas"
        ? docs.filter((d) => d.eidasRelevant)
        : docs.filter((d) => d.status === filter);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Documents</h1>
          <p className="text-slate-500 mt-1 text-sm">
            All ingested documents and processing status
          </p>
        </div>
        <Link
          href="/upload"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          Upload document
        </Link>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "completed", "processing", "review", "pending", "eidas"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              filter === f
                ? "bg-brand-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f === "eidas" ? "eIDAS relevant" : f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <DocumentTable documents={filtered} />
      </div>
    </div>
  );
}

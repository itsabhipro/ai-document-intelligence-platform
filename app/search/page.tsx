"use client";

import { useState } from "react";
import { searchDocuments } from "@/lib/document-store";
import { Search } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { documentId: string; documentName: string; snippet: string; score: number }[]
  >([]);
  const [searched, setSearched] = useState(false);

  const run = () => {
    setResults(searchDocuments(query));
    setSearched(true);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Search documents</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Full-text and field search across extracted content
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="Search by name, category, field, or content…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={run}
          className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
        >
          Search
        </button>
      </div>

      {searched && results.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-8">No matching documents.</p>
      )}

      <div className="space-y-3">
        {results.map((r) => (
          <Link
            key={r.documentId}
            href={`/documents/${r.documentId}`}
            className="block bg-white rounded-xl border border-slate-200 p-4 hover:border-brand-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-900 text-sm">{r.documentName}</span>
              <span className="text-xs text-slate-400">
                {Math.round(r.score * 100)}% match
              </span>
            </div>
            <p className="text-sm text-slate-500 line-clamp-2">{r.snippet}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

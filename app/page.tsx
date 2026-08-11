"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle2, AlertTriangle, Gauge } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { DocumentTable } from "@/components/DocumentTable";
import { getDocuments } from "@/lib/document-store";
import { getStats } from "@/lib/mock-data";
import { DocumentRecord } from "@/types";
import Link from "next/link";

export default function DashboardPage() {
  const [docs, setDocs] = useState<DocumentRecord[]>([]);

  useEffect(() => {
    setDocs(getDocuments());
  }, []);

  const stats = getStats(docs);
  const recent = docs.slice(0, 5);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">
          AI-powered document intelligence with classification, extraction, and eIDAS awareness
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total documents"
          value={stats.totalDocuments}
          icon={FileText}
          accent="blue"
        />
        <StatCard
          title="Processed today"
          value={stats.processedToday}
          icon={CheckCircle2}
          accent="green"
        />
        <StatCard
          title="Avg. confidence"
          value={`${stats.avgConfidence}%`}
          subtitle="Classification confidence"
          icon={Gauge}
          accent="purple"
        />
        <StatCard
          title="Pending review"
          value={stats.pendingReview}
          subtitle="Below confidence threshold"
          icon={AlertTriangle}
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recent documents</h2>
            <Link href="/documents" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View all →
            </Link>
          </div>
          <DocumentTable documents={recent} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">By category</h2>
          <div className="space-y-3">
            {Object.entries(stats.byCategory).length === 0 && (
              <p className="text-sm text-slate-400">No classified documents yet</p>
            )}
            {Object.entries(stats.byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 capitalize">{cat}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{
                          width: `${Math.min(100, (count / Math.max(stats.totalDocuments, 1)) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-700 w-6 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Pipeline
            </h3>
            <ol className="text-sm text-slate-600 space-y-1.5 list-decimal list-inside">
              <li>Ingest & preprocess</li>
              <li>OCR / layout analysis</li>
              <li>Classify document type</li>
              <li>Extract key fields</li>
              <li>eIDAS relevance flag</li>
              <li>Human review if needed</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

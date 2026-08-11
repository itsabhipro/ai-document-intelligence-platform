"use client";

import Link from "next/link";
import { DocumentRecord } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { formatBytes, formatDate, categoryLabel } from "@/lib/utils";
import { FileText, Shield } from "lucide-react";

export function DocumentTable({ documents }: { documents: DocumentRecord[] }) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">
        No documents yet. Upload one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            <th className="pb-3 font-medium">Document</th>
            <th className="pb-3 font-medium">Category</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Uploaded</th>
            <th className="pb-3 font-medium">Size</th>
            <th className="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-slate-50/80">
              <td className="py-3.5 pr-4">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900 flex items-center gap-1.5">
                      {doc.name}
                      {doc.eidasRelevant && (
                        <span title="eIDAS relevant">
                          <Shield className="h-3.5 w-3.5 text-violet-500" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{doc.mimeType}</div>
                  </div>
                </div>
              </td>
              <td className="py-3.5 pr-4">
                {doc.category ? (
                  <span className="text-slate-700">
                    {categoryLabel(doc.category)}
                    {doc.categoryConfidence != null && (
                      <span className="text-slate-400 ml-1">
                        ({Math.round(doc.categoryConfidence * 100)}%)
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="py-3.5 pr-4">
                <StatusBadge status={doc.status} />
              </td>
              <td className="py-3.5 pr-4 text-slate-600">{formatDate(doc.uploadedAt)}</td>
              <td className="py-3.5 pr-4 text-slate-600">{formatBytes(doc.size)}</td>
              <td className="py-3.5">
                <Link
                  href={`/documents/${doc.id}`}
                  className="text-brand-600 hover:text-brand-700 font-medium text-xs"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

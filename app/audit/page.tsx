"use client";

import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/document-store";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface FlatEvent {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details?: string;
  aiGenerated?: boolean;
  documentId: string;
  documentName: string;
}

export default function AuditPage() {
  const [events, setEvents] = useState<FlatEvent[]>([]);

  useEffect(() => {
    const docs = getDocuments();
    const all: FlatEvent[] = [];
    for (const d of docs) {
      for (const e of d.auditTrail) {
        all.push({
          ...e,
          documentId: d.id,
          documentName: d.name,
        });
      }
    }
    all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setEvents(all);
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Audit log</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Cross-document activity trail — AI actions are explicitly marked
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Document</th>
              <th className="px-4 py-3 font-medium">Actor</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/80">
                <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                  {formatDate(e.timestamp)}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-800">{e.action}</span>
                  {e.aiGenerated && (
                    <span className="ml-1.5 text-xs text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
                      AI
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/documents/${e.documentId}`}
                    className="text-brand-600 hover:underline"
                  >
                    {e.documentName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{e.actor}</td>
                <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                  {e.details || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <p className="text-center text-slate-400 py-10 text-sm">No audit events yet.</p>
        )}
      </div>
    </div>
  );
}

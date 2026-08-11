"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getDocument,
  processDocument,
  updateDocumentStatus,
} from "@/lib/document-store";
import { DocumentRecord } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import {
  formatBytes,
  formatDate,
  confidenceColor,
  categoryLabel,
  cn,
} from "@/lib/utils";
import {
  ArrowLeft,
  Shield,
  FileText,
  Loader2,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [doc, setDoc] = useState<DocumentRecord | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const reload = () => setDoc(getDocument(id) ?? null);

  useEffect(() => {
    reload();
  }, [id]);

  if (doc === undefined) {
    return (
      <div className="p-8 flex items-center justify-center text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="p-8">
        <p className="text-slate-600">Document not found.</p>
        <Link href="/documents" className="text-brand-600 text-sm mt-2 inline-block">
          ← Back to documents
        </Link>
      </div>
    );
  }

  const handleProcess = async () => {
    setBusy(true);
    await processDocument(doc.id);
    reload();
    setBusy(false);
  };

  const handleApprove = () => {
    updateDocumentStatus(doc.id, "completed");
    reload();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <button
        onClick={() => router.push("/documents")}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to documents
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5 text-slate-400" />
            <h1 className="text-xl font-semibold text-slate-900">{doc.name}</h1>
            {doc.eidasRelevant && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-medium">
                <Shield className="h-3 w-3" /> eIDAS
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            {formatBytes(doc.size)} · {doc.mimeType} · Uploaded {formatDate(doc.uploadedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={doc.status} />
          {(doc.status === "pending" || doc.status === "failed") && (
            <button
              onClick={handleProcess}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Process
            </button>
          )}
          {doc.status === "review" && (
            <button
              onClick={handleApprove}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
            >
              <CheckCircle className="h-4 w-4" /> Approve
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Classification & metadata</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Category</dt>
              <dd className="font-medium text-slate-800 capitalize">
                {doc.category ? categoryLabel(doc.category) : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Confidence</dt>
              <dd>
                {doc.categoryConfidence != null ? (
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      confidenceColor(doc.categoryConfidence)
                    )}
                  >
                    {Math.round(doc.categoryConfidence * 100)}%
                  </span>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Pages</dt>
              <dd className="text-slate-800">{doc.pageCount ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Language</dt>
              <dd className="text-slate-800 uppercase">{doc.language ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">eIDAS relevant</dt>
              <dd className="text-slate-800">{doc.eidasRelevant ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Extracted fields</h2>
          {!doc.fields?.length ? (
            <p className="text-sm text-slate-400">No fields extracted yet.</p>
          ) : (
            <div className="space-y-2">
              {doc.fields.map((f) => (
                <div
                  key={f.key}
                  className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
                >
                  <div>
                    <div className="text-xs text-slate-400 font-mono">{f.key}</div>
                    <div className="text-sm font-medium text-slate-800">{f.value}</div>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      confidenceColor(f.confidence)
                    )}
                  >
                    {Math.round(f.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <h2 className="font-semibold text-slate-900 mb-3">Extracted text (OCR)</h2>
          <pre className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 rounded-lg p-4 max-h-48 overflow-auto scrollbar-thin">
            {doc.extractedText || "No text extracted yet."}
          </pre>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <h2 className="font-semibold text-slate-900 mb-4">Audit trail</h2>
          <div className="space-y-3">
            {[...doc.auditTrail].reverse().map((e) => (
              <div key={e.id} className="flex gap-3 text-sm">
                <div className="w-36 shrink-0 text-xs text-slate-400 pt-0.5">
                  {formatDate(e.timestamp)}
                </div>
                <div>
                  <span className="font-medium text-slate-800">{e.action}</span>
                  {e.aiGenerated && (
                    <span className="ml-1.5 text-xs text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
                      AI
                    </span>
                  )}
                  <span className="text-slate-400 ml-2">by {e.actor}</span>
                  {e.details && (
                    <p className="text-slate-500 text-xs mt-0.5">{e.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

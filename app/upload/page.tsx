"use client";

import { UploadZone } from "@/components/UploadZone";

export default function UploadPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Upload document</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Documents are classified, OCR&apos;d, and key fields extracted. eIDAS-relevant
          types are flagged automatically.
        </p>
      </div>
      <UploadZone />
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <h3 className="font-medium text-slate-800 mb-2">Processing pipeline</h3>
        <ol className="list-decimal list-inside space-y-1 text-slate-500">
          <li>File stored securely (demo: browser localStorage)</li>
          <li>Layout analysis & OCR</li>
          <li>Document type classification</li>
          <li>Schema-based field extraction</li>
          <li>Confidence scoring & review routing</li>
          <li>Audit events logged (AI actions marked)</li>
        </ol>
      </div>
    </div>
  );
}

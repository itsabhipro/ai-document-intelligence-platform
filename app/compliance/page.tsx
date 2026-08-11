import { Shield, FileCheck, Eye, Scale, AlertCircle } from "lucide-react";

export default function CompliancePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Compliance & eIDAS</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Design considerations for electronic identification and trust services
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-8 flex gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <strong>Demo only.</strong> This platform demonstrates architecture patterns.
          Production systems that create or validate qualified electronic signatures or seals
          must use eIDAS-certified components and follow official regulatory requirements.
        </div>
      </div>

      <div className="grid gap-5">
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-violet-600" />
            <h2 className="font-semibold text-slate-900">eIDAS relevance detection</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Documents classified as <strong>identity</strong> or <strong>contract</strong> are
            automatically flagged as eIDAS-relevant. These trigger enhanced audit logging and
            can be routed to high-assurance workflows (e.g. human review, qualified signature
            validation against trusted lists).
          </p>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-5 w-5 text-brand-600" />
            <h2 className="font-semibold text-slate-900">AI transparency (EU AI Act)</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            Classification and extraction steps are marked as AI-generated in the audit trail.
            Users can see which decisions were automated versus human-approved — supporting
            Article 50 transparency obligations where applicable.
          </p>
          <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
            <li>AI actions tagged with an &quot;AI&quot; badge in audit events</li>
            <li>Confidence scores exposed for every extracted field</li>
            <li>Low-confidence results routed to human review</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="font-semibold text-slate-900">Auditability & integrity</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every document maintains an append-only style audit trail: upload, classification,
            extraction, eIDAS flags, and human approvals. In production this would be backed by
            immutable storage and optionally cryptographic hashing for non-repudiation.
          </p>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="h-5 w-5 text-slate-700" />
            <h2 className="font-semibold text-slate-900">Data handling principles</h2>
          </div>
          <ul className="text-sm text-slate-600 list-disc list-inside space-y-1.5">
            <li>Minimize retention of identity documents after processing</li>
            <li>Purpose limitation for extracted personal data</li>
            <li>Access control and role separation (operator vs reviewer)</li>
            <li>Support for data subject requests (export / erasure paths)</li>
            <li>Clear separation between demo storage and production secure backends</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

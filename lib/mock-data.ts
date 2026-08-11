import { DocumentRecord, ProcessingStats, AuditEvent } from "@/types";
import { v4 as uuid } from "uuid";

const now = Date.now();

function audit(
  action: string,
  actor: string,
  details?: string,
  aiGenerated = false
): AuditEvent {
  return {
    id: uuid(),
    timestamp: new Date(now - Math.random() * 86400000).toISOString(),
    action,
    actor,
    details,
    aiGenerated,
  };
}

export const SAMPLE_DOCUMENTS: DocumentRecord[] = [
  {
    id: "doc-001",
    name: "invoice-acme-2026-08.pdf",
    size: 245760,
    mimeType: "application/pdf",
    uploadedAt: new Date(now - 3600000).toISOString(),
    status: "completed",
    category: "invoice",
    categoryConfidence: 0.97,
    pageCount: 2,
    language: "en",
    eidasRelevant: false,
    extractedText:
      "INVOICE\nACME Corporation\nInvoice #: INV-2026-0842\nDate: 2026-08-01\nBill To: Contoso Ltd\nAmount Due: EUR 4,250.00\nDue Date: 2026-08-31\nVAT: 21%",
    fields: [
      { key: "invoice_number", value: "INV-2026-0842", confidence: 0.99 },
      { key: "vendor", value: "ACME Corporation", confidence: 0.98 },
      { key: "customer", value: "Contoso Ltd", confidence: 0.96 },
      { key: "amount", value: "EUR 4,250.00", confidence: 0.99 },
      { key: "due_date", value: "2026-08-31", confidence: 0.97 },
      { key: "vat_rate", value: "21%", confidence: 0.95 },
    ],
    auditTrail: [
      audit("uploaded", "user@contoso.com", "File uploaded via web UI"),
      audit("classified", "system", "Category: invoice (97%)", true),
      audit("extracted", "system", "6 fields extracted", true),
      audit("completed", "system", "Processing finished"),
    ],
  },
  {
    id: "doc-002",
    name: "service-agreement-q3.pdf",
    size: 512000,
    mimeType: "application/pdf",
    uploadedAt: new Date(now - 7200000).toISOString(),
    status: "completed",
    category: "contract",
    categoryConfidence: 0.94,
    pageCount: 12,
    language: "en",
    eidasRelevant: true,
    extractedText:
      "SERVICE AGREEMENT\nThis Agreement is entered into as of 1 July 2026 between Provider SA and Client BV.\nTerm: 24 months\nGoverning Law: Netherlands\nElectronic signatures under eIDAS permitted.",
    fields: [
      { key: "party_a", value: "Provider SA", confidence: 0.96 },
      { key: "party_b", value: "Client BV", confidence: 0.95 },
      { key: "effective_date", value: "2026-07-01", confidence: 0.98 },
      { key: "term_months", value: "24", confidence: 0.93 },
      { key: "governing_law", value: "Netherlands", confidence: 0.91 },
      { key: "eidas_signatures", value: "permitted", confidence: 0.89 },
    ],
    auditTrail: [
      audit("uploaded", "legal@client.eu", "Contract upload"),
      audit("classified", "system", "Category: contract (94%)", true),
      audit("eidas_flag", "system", "Document marked eIDAS-relevant", true),
      audit("extracted", "system", "6 fields extracted", true),
      audit("completed", "system"),
    ],
  },
  {
    id: "doc-003",
    name: "passport-scan-john-doe.jpg",
    size: 890000,
    mimeType: "image/jpeg",
    uploadedAt: new Date(now - 10800000).toISOString(),
    status: "review",
    category: "identity",
    categoryConfidence: 0.91,
    pageCount: 1,
    language: "en",
    eidasRelevant: true,
    extractedText:
      "PASSPORT\nSurname: DOE\nGiven names: JOHN MICHAEL\nNationality: NLD\nDate of birth: 15 MAR 1988\nDocument No: NL1234567",
    fields: [
      { key: "document_type", value: "Passport", confidence: 0.99 },
      { key: "surname", value: "DOE", confidence: 0.97 },
      { key: "given_names", value: "JOHN MICHAEL", confidence: 0.94 },
      { key: "nationality", value: "NLD", confidence: 0.98 },
      { key: "date_of_birth", value: "1988-03-15", confidence: 0.92 },
      { key: "document_number", value: "NL1234567", confidence: 0.88 },
    ],
    auditTrail: [
      audit("uploaded", "kyc@fintech.eu"),
      audit("classified", "system", "Category: identity (91%)", true),
      audit("eidas_flag", "system", "Identity document — high assurance path", true),
      audit("extracted", "system", "6 fields; low confidence on document_number", true),
      audit("review_required", "system", "Confidence threshold not met for document_number"),
    ],
  },
  {
    id: "doc-004",
    name: "receipt-office-supplies.pdf",
    size: 102400,
    mimeType: "application/pdf",
    uploadedAt: new Date(now - 14400000).toISOString(),
    status: "completed",
    category: "receipt",
    categoryConfidence: 0.99,
    pageCount: 1,
    language: "en",
    eidasRelevant: false,
    extractedText: "RECEIPT\nStaples\nDate: 2026-08-10\nTotal: EUR 87.40\nPayment: Card",
    fields: [
      { key: "merchant", value: "Staples", confidence: 0.99 },
      { key: "date", value: "2026-08-10", confidence: 0.98 },
      { key: "total", value: "EUR 87.40", confidence: 0.99 },
      { key: "payment_method", value: "Card", confidence: 0.97 },
    ],
    auditTrail: [
      audit("uploaded", "finance@contoso.com"),
      audit("classified", "system", "Category: receipt (99%)", true),
      audit("extracted", "system", "4 fields", true),
      audit("completed", "system"),
    ],
  },
  {
    id: "doc-005",
    name: "iso-certificate-2026.pdf",
    size: 320000,
    mimeType: "application/pdf",
    uploadedAt: new Date(now - 18000000).toISOString(),
    status: "processing",
    category: "certificate",
    categoryConfidence: 0.86,
    pageCount: 3,
    language: "en",
    eidasRelevant: false,
    auditTrail: [
      audit("uploaded", "quality@contoso.com"),
      audit("classified", "system", "Category: certificate (86%)", true),
      audit("processing", "system", "OCR in progress"),
    ],
  },
  {
    id: "doc-006",
    name: "client-letter-august.pdf",
    size: 156000,
    mimeType: "application/pdf",
    uploadedAt: new Date(now - 20000000).toISOString(),
    status: "pending",
    eidasRelevant: false,
    auditTrail: [audit("uploaded", "ops@contoso.com")],
  },
];

export function getStats(docs: DocumentRecord[]): ProcessingStats {
  const byCategory: Record<string, number> = {};
  let confidenceSum = 0;
  let confidenceCount = 0;
  let pendingReview = 0;
  const today = new Date().toDateString();
  let processedToday = 0;

  for (const d of docs) {
    if (d.category) {
      byCategory[d.category] = (byCategory[d.category] || 0) + 1;
    }
    if (d.categoryConfidence != null) {
      confidenceSum += d.categoryConfidence;
      confidenceCount++;
    }
    if (d.status === "review") pendingReview++;
    if (new Date(d.uploadedAt).toDateString() === today) processedToday++;
  }

  return {
    totalDocuments: docs.length,
    processedToday,
    avgConfidence: confidenceCount ? Math.round((confidenceSum / confidenceCount) * 100) : 0,
    pendingReview,
    byCategory,
  };
}

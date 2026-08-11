"use client";

import { DocumentRecord, DocumentCategory, ExtractedField } from "@/types";
import { SAMPLE_DOCUMENTS } from "./mock-data";
import { v4 as uuid } from "uuid";

const STORAGE_KEY = "aidoc_documents";

function load(): DocumentRecord[] {
  if (typeof window === "undefined") return SAMPLE_DOCUMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DOCUMENTS));
      return SAMPLE_DOCUMENTS;
    }
    return JSON.parse(raw) as DocumentRecord[];
  } catch {
    return SAMPLE_DOCUMENTS;
  }
}

function save(docs: DocumentRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function getDocuments(): DocumentRecord[] {
  return load().sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export function getDocument(id: string): DocumentRecord | undefined {
  return load().find((d) => d.id === id);
}

export function addDocument(file: File): DocumentRecord {
  const docs = load();
  const record: DocumentRecord = {
    id: `doc-${uuid().slice(0, 8)}`,
    name: file.name,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
    uploadedAt: new Date().toISOString(),
    status: "pending",
    auditTrail: [
      {
        id: uuid(),
        timestamp: new Date().toISOString(),
        action: "uploaded",
        actor: "current-user",
        details: `Uploaded ${file.name} (${file.size} bytes)`,
      },
    ],
  };
  docs.unshift(record);
  save(docs);
  return record;
}

const CATEGORIES: DocumentCategory[] = [
  "invoice",
  "contract",
  "identity",
  "receipt",
  "form",
  "certificate",
  "correspondence",
  "other",
];

function inferCategory(name: string): { category: DocumentCategory; confidence: number } {
  const n = name.toLowerCase();
  if (n.includes("invoice") || n.includes("inv-")) return { category: "invoice", confidence: 0.92 + Math.random() * 0.07 };
  if (n.includes("contract") || n.includes("agreement")) return { category: "contract", confidence: 0.9 + Math.random() * 0.08 };
  if (n.includes("passport") || n.includes("id-") || n.includes("identity")) return { category: "identity", confidence: 0.88 + Math.random() * 0.1 };
  if (n.includes("receipt")) return { category: "receipt", confidence: 0.94 + Math.random() * 0.05 };
  if (n.includes("cert")) return { category: "certificate", confidence: 0.85 + Math.random() * 0.1 };
  if (n.includes("form")) return { category: "form", confidence: 0.87 + Math.random() * 0.08 };
  return { category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)], confidence: 0.7 + Math.random() * 0.2 };
}

function mockFields(category: DocumentCategory): ExtractedField[] {
  switch (category) {
    case "invoice":
      return [
        { key: "invoice_number", value: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`, confidence: 0.95 + Math.random() * 0.04 },
        { key: "amount", value: `EUR ${(Math.random() * 5000 + 100).toFixed(2)}`, confidence: 0.94 + Math.random() * 0.05 },
        { key: "date", value: "2026-08-11", confidence: 0.96 },
        { key: "vendor", value: "Extracted Vendor Ltd", confidence: 0.91 },
      ];
    case "contract":
      return [
        { key: "party_a", value: "Party A SA", confidence: 0.93 },
        { key: "party_b", value: "Party B BV", confidence: 0.92 },
        { key: "effective_date", value: "2026-07-01", confidence: 0.95 },
        { key: "term_months", value: "12", confidence: 0.88 },
      ];
    case "identity":
      return [
        { key: "document_type", value: "ID Document", confidence: 0.97 },
        { key: "document_number", value: `ID${Math.floor(1e6 + Math.random() * 9e6)}`, confidence: 0.85 + Math.random() * 0.1 },
        { key: "surname", value: "EXTRACTED", confidence: 0.9 },
      ];
    case "receipt":
      return [
        { key: "merchant", value: "Merchant Name", confidence: 0.96 },
        { key: "total", value: `EUR ${(Math.random() * 200 + 5).toFixed(2)}`, confidence: 0.98 },
        { key: "date", value: "2026-08-11", confidence: 0.97 },
      ];
    default:
      return [
        { key: "title", value: "Document Title", confidence: 0.8 + Math.random() * 0.15 },
        { key: "date", value: "2026-08-11", confidence: 0.85 },
      ];
  }
}

export async function processDocument(id: string): Promise<DocumentRecord | undefined> {
  const docs = load();
  const idx = docs.findIndex((d) => d.id === id);
  if (idx < 0) return undefined;

  const doc = { ...docs[idx] };
  doc.status = "processing";
  doc.auditTrail = [
    ...doc.auditTrail,
    {
      id: uuid(),
      timestamp: new Date().toISOString(),
      action: "processing",
      actor: "system",
      details: "OCR and classification started",
      aiGenerated: true,
    },
  ];
  docs[idx] = doc;
  save(docs);

  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

  const { category, confidence } = inferCategory(doc.name);
  const fields = mockFields(category);
  const minConf = Math.min(...fields.map((f) => f.confidence));
  const needsReview = minConf < 0.9 || confidence < 0.9;
  const eidasRelevant = category === "identity" || category === "contract";

  doc.status = needsReview ? "review" : "completed";
  doc.category = category;
  doc.categoryConfidence = confidence;
  doc.fields = fields;
  doc.pageCount = 1 + Math.floor(Math.random() * 5);
  doc.language = "en";
  doc.eidasRelevant = eidasRelevant;
  doc.extractedText = `Extracted content from ${doc.name}\n\nCategory: ${category}\nProcessed by AI Document Intelligence Platform.\n[Simulated OCR output for demo purposes]`;
  doc.auditTrail = [
    ...doc.auditTrail,
    {
      id: uuid(),
      timestamp: new Date().toISOString(),
      action: "classified",
      actor: "system",
      details: `Category: ${category} (${Math.round(confidence * 100)}%)`,
      aiGenerated: true,
    },
    {
      id: uuid(),
      timestamp: new Date().toISOString(),
      action: "extracted",
      actor: "system",
      details: `${fields.length} fields extracted`,
      aiGenerated: true,
    },
  ];
  if (eidasRelevant) {
    doc.auditTrail.push({
      id: uuid(),
      timestamp: new Date().toISOString(),
      action: "eidas_flag",
      actor: "system",
      details: "Document flagged as eIDAS-relevant (identity/trust service context)",
      aiGenerated: true,
    });
  }
  if (needsReview) {
    doc.auditTrail.push({
      id: uuid(),
      timestamp: new Date().toISOString(),
      action: "review_required",
      actor: "system",
      details: "One or more fields below confidence threshold — human review recommended",
    });
  } else {
    doc.auditTrail.push({
      id: uuid(),
      timestamp: new Date().toISOString(),
      action: "completed",
      actor: "system",
      details: "Processing completed successfully",
    });
  }

  docs[idx] = doc;
  save(docs);
  return doc;
}

export function updateDocumentStatus(id: string, status: DocumentRecord["status"]): void {
  const docs = load();
  const idx = docs.findIndex((d) => d.id === id);
  if (idx < 0) return;
  docs[idx] = {
    ...docs[idx],
    status,
    auditTrail: [
      ...docs[idx].auditTrail,
      {
        id: uuid(),
        timestamp: new Date().toISOString(),
        action: status === "completed" ? "approved" : status,
        actor: "current-user",
        details: `Status set to ${status}`,
      },
    ],
  };
  save(docs);
}

export function searchDocuments(query: string): { documentId: string; documentName: string; snippet: string; score: number }[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const docs = load();
  const results: { documentId: string; documentName: string; snippet: string; score: number }[] = [];

  for (const d of docs) {
    let score = 0;
    const parts: string[] = [];
    if (d.name.toLowerCase().includes(q)) {
      score += 0.4;
      parts.push(d.name);
    }
    if (d.category?.includes(q)) {
      score += 0.2;
      parts.push(`category: ${d.category}`);
    }
    if (d.extractedText?.toLowerCase().includes(q)) {
      score += 0.3;
      const idx = d.extractedText.toLowerCase().indexOf(q);
      parts.push(d.extractedText.slice(Math.max(0, idx - 40), idx + q.length + 40));
    }
    if (d.fields) {
      for (const f of d.fields) {
        if (f.key.includes(q) || f.value.toLowerCase().includes(q)) {
          score += 0.25;
          parts.push(`${f.key}: ${f.value}`);
        }
      }
    }
    if (score > 0) {
      results.push({
        documentId: d.id,
        documentName: d.name,
        snippet: parts[0] || d.name,
        score: Math.min(1, score),
      });
    }
  }
  return results.sort((a, b) => b.score - a.score);
}

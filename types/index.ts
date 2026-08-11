export type DocumentStatus = "pending" | "processing" | "completed" | "failed" | "review";

export type DocumentCategory =
  | "invoice"
  | "contract"
  | "identity"
  | "receipt"
  | "form"
  | "certificate"
  | "correspondence"
  | "other";

export interface ExtractedField {
  key: string;
  value: string;
  confidence: number;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export interface DocumentRecord {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  status: DocumentStatus;
  category?: DocumentCategory;
  categoryConfidence?: number;
  extractedText?: string;
  fields?: ExtractedField[];
  pageCount?: number;
  language?: string;
  eidasRelevant?: boolean;
  auditTrail: AuditEvent[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details?: string;
  aiGenerated?: boolean;
}

export interface ProcessingStats {
  totalDocuments: number;
  processedToday: number;
  avgConfidence: number;
  pendingReview: number;
  byCategory: Record<string, number>;
}

export interface SearchResult {
  documentId: string;
  documentName: string;
  snippet: string;
  score: number;
  fieldMatches?: string[];
}

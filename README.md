# AI-Powered Document Intelligence Platform

Intelligent document processing (IDP) platform with OCR simulation, classification, key-field extraction, semantic search, and **eIDAS / EU AI Act** compliance considerations.

**Live demo pattern:** Deploy on Vercel · Portfolio project by [Abhishek Kumar](https://github.com/itsabhipro)

---

## Features

| Capability | Description |
|------------|-------------|
| **Document ingestion** | Drag-and-drop upload (PDF, images, DOCX) |
| **Classification** | Auto-detect invoice, contract, identity, receipt, certificate, etc. |
| **Field extraction** | Schema-based key-value extraction with confidence scores |
| **OCR text** | Full-text extraction view (demo pipeline) |
| **Human review** | Low-confidence documents routed to review queue |
| **Search** | Search across names, categories, fields, and extracted text |
| **eIDAS awareness** | Identity & contract docs flagged for high-assurance handling |
| **Audit trail** | Per-document and global logs; AI actions explicitly marked |
| **Transparency** | Confidence scores + AI badges (EU AI Act Article 50 style) |

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + Lucide icons
- Client-side document store (localStorage) for zero-backend demo
- Designed to plug into Azure AI Document Intelligence / real OCR APIs later

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

---

## Architecture (demo)

```
Upload → Pending → Processing (OCR + classify + extract)
                 → Completed | Review (low confidence)
Identity / Contract → eIDAS flag + enhanced audit
```

Production mapping:

- Storage → Azure Blob / S3  
- OCR & extraction → Azure AI Document Intelligence / equivalent  
- Identity → Entra ID / OAuth  
- Audit → immutable log store  

---

## Compliance notes

This is a **demonstration** of architecture patterns for:

- eIDAS-relevant document detection  
- AI transparency (labelled automated decisions)  
- Auditability and human-in-the-loop review  

**Not** a certified trust service. Production e-signature / qualified certificate flows require eIDAS-certified components.

---

## Project structure

```
app/
  page.tsx              # Dashboard
  documents/            # List + detail
  upload/               # Upload zone
  search/               # Full-text search
  compliance/           # eIDAS & AI Act notes
  audit/                # Global audit log
components/             # UI components
lib/                    # Store, mock data, utils
types/                  # Shared TypeScript types
```

---

## License

Portfolio / demonstration purposes.

---

Built by [itsabhipro](https://github.com/itsabhipro) · Deployed on Vercel

"use client";

import { useCallback, useState } from "react";
import { Upload, FileUp, Loader2 } from "lucide-react";
import { addDocument, processDocument } from "@/lib/document-store";
import { useRouter } from "next/navigation";

export function UploadZone() {
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setBusy(true);
      setMessage(null);
      try {
        const file = files[0];
        const record = addDocument(file);
        setMessage(`Uploaded ${file.name}. Processing…`);
        await processDocument(record.id);
        setMessage(`Processed ${file.name} successfully.`);
        setTimeout(() => router.push(`/documents/${record.id}`), 600);
      } catch {
        setMessage("Upload failed. Please try again.");
      } finally {
        setBusy(false);
      }
    },
    [router]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragging
            ? "border-brand-500 bg-brand-50"
            : "border-slate-300 bg-white hover:border-slate-400"
        }`}
      >
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.tiff,.tif,.docx"
          className="absolute inset-0 opacity-0 cursor-pointer"
          disabled={busy}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          {busy ? (
            <Loader2 className="h-10 w-10 text-brand-500 animate-spin" />
          ) : (
            <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
              {dragging ? (
                <FileUp className="h-7 w-7 text-brand-600" />
              ) : (
                <Upload className="h-7 w-7 text-brand-600" />
              )}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-slate-900">
              {busy ? "Processing document…" : "Drop a document here or click to browse"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              PDF, PNG, JPG, TIFF, DOCX — max demo size unlimited (client-side)
            </p>
          </div>
        </div>
      </div>
      {message && (
        <p className="mt-3 text-sm text-slate-600 text-center">{message}</p>
      )}
    </div>
  );
}

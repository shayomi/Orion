"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Search, Plus, ArrowLeft, X } from "lucide-react";
import DocumentGenerator from "./document-generator";

interface Doc {
  id: string;
  name: string;
  type: string;
  status: string;
  content: string | null;
  createdAt: string;
}

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "info" | "default" | "outline" }
> = {
  ready: { label: "Ready", variant: "success" },
  draft: { label: "Draft", variant: "warning" },
  generating: { label: "Generating", variant: "info" },
  signed: { label: "Signed", variant: "success" },
  expired: { label: "Expired", variant: "default" },
};

function DocViewer({ doc, onClose }: { doc: Doc; onClose: () => void }) {
  const handleDownload = () => {
    if (!doc.content) return;
    const blob = new Blob([doc.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.name.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{doc.name}</h2>
            <p className="text-xs text-gray-400">{doc.type} · {new Date(doc.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="w-3.5 h-3.5" /> Download
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          {doc.content ? (
            <div className="prose prose-sm max-w-none text-gray-800 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_p]:text-sm [&_p]:leading-relaxed">
              {doc.content.split("\n").map((line, i) => {
                if (line.startsWith("## ")) return <h2 key={i}>{line.replace("## ", "")}</h2>;
                if (line.startsWith("### ")) return <h3 key={i} className="text-sm font-semibold mt-4">{line.replace("### ", "")}</h3>;
                if (line.startsWith("- ")) return <li key={i} className="ml-4 list-disc text-sm">{line.replace("- ", "")}</li>;
                if (line.trim() === "") return <br key={i} />;
                return <p key={i}>{line}</p>;
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No content available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DocumentList() {
  const [mode, setMode] = useState<"list" | "generate" | "view">("list");
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewDoc, setViewDoc] = useState<Doc | null>(null);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  if (mode === "generate") {
    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setMode("list")}
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-gray-600">Back to documents</span>
        </div>
        <DocumentGenerator
          onDocGenerated={() => {
            fetchDocs();
          }}
        />
      </div>
    );
  }

  if (mode === "view" && viewDoc) {
    return (
      <DocViewer
        doc={viewDoc}
        onClose={() => {
          setMode("list");
          setViewDoc(null);
        }}
      />
    );
  }

  const filtered = docs.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-72 focus-within:border-indigo-300 transition-colors">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>
        <Button size="md" onClick={() => setMode("generate")}>
          <Plus className="w-4 h-4" /> Generate Document
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-gray-400">Loading documents...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-500">
                {docs.length === 0 ? "No documents yet" : "No documents found"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {docs.length === 0
                  ? "Generate your first legal document"
                  : "Try adjusting your search"}
              </p>
              {docs.length === 0 && (
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => setMode("generate")}
                >
                  <Plus className="w-3.5 h-3.5" /> Generate Document
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((doc) => {
                const status = statusConfig[doc.status] || statusConfig.draft;
                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {doc.type} · {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button
                        onClick={() => {
                          setViewDoc(doc);
                          setMode("view");
                        }}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (!doc.content) return;
                          const blob = new Blob([doc.content], { type: "text/markdown" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${doc.name.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

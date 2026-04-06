"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Trash2, Search, Plus } from "lucide-react";
import { mockDocuments } from "@/lib/mock-data";

const filters = ["All", "Incorporation", "Tax", "Equity", "General"];

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "info" | "default" | "outline" }
> = {
  ready: { label: "Ready", variant: "success" },
  draft: { label: "Draft", variant: "warning" },
  pending_review: { label: "Pending Review", variant: "info" },
};

export default function DocumentList() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = mockDocuments.filter((doc) => {
    const matchesFilter = activeFilter === "All" || doc.type === activeFilter;
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Header actions */}
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
        <Button size="md">
          <Plus className="w-4 h-4" /> Generate Document
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-lg w-fit">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeFilter === f
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Document list */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-500">No documents found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((doc) => {
                const status = statusConfig[doc.status];
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
                        {doc.type} · {doc.createdAt} · {doc.size}
                      </p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
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

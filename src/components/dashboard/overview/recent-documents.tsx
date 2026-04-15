import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentDoc {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: Date;
}

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "info" | "default" }> = {
  ready: { label: "Ready", variant: "success" },
  draft: { label: "Draft", variant: "warning" },
  generating: { label: "Generating", variant: "info" },
  signed: { label: "Signed", variant: "success" },
  expired: { label: "Expired", variant: "default" },
};

export default function RecentDocuments({ docs }: { docs: RecentDoc[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Documents</CardTitle>
          <Link href="/dashboard/documents">
            <Button variant="ghost" size="sm">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {docs.length === 0 ? (
          <div className="text-center py-6">
            <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No documents yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Generate your first legal document to get started
            </p>
            <Link href="/dashboard/documents">
              <Button size="sm" className="mt-3">
                <Plus className="w-3.5 h-3.5" /> Generate Document
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {docs.map((doc) => {
              const status = statusConfig[doc.status] || statusConfig.draft;
              return (
                <Link
                  key={doc.id}
                  href="/dashboard/documents"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {doc.type} · {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { Topbar } from "@/components/layout/topbar";
import DocumentList from "@/components/dashboard/documents/document-list";

export default function DocumentsPage() {
  return (
    <div>
      <Topbar title="Documents" subtitle="Generated and stored legal documents" />
      <div className="p-6">
        <DocumentList />
      </div>
    </div>
  );
}

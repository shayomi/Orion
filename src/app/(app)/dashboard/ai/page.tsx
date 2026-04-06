import { Topbar } from "@/components/layout/topbar";
import AiChat from "@/components/dashboard/ai/ai-chat";

export default function AIPage() {
  return (
    <div className="flex flex-col h-screen">
      <Topbar title="AI Assistant" subtitle="Orion Legal Co-pilot" />
      <AiChat />
    </div>
  );
}

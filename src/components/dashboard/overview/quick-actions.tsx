import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Sparkles, FileText } from "lucide-react";

const actions = [
  {
    href: "/dashboard/workflows",
    icon: GitBranch,
    label: "Continue Workflow",
    sub: "Incorporation Flow",
  },
  {
    href: "/dashboard/ai",
    icon: Sparkles,
    label: "Ask AI",
    sub: "Legal co-pilot",
  },
  {
    href: "/dashboard/documents",
    icon: FileText,
    label: "Generate Document",
    sub: "AI-powered drafts",
  },
];

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <button className="w-full p-4 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left">
                  <Icon className="w-5 h-5 text-indigo-500 mb-2" />
                  <p className="text-sm font-medium text-gray-900">{action.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{action.sub}</p>
                </button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

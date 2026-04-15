import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Info, Zap } from "lucide-react";
import Link from "next/link";

interface Issue {
  id: string;
  title: string;
  severity: string;
  domain: string;
  isResolved: boolean;
}

const severityConfig: Record<string, { icon: typeof AlertTriangle; bg: string; iconClass: string }> = {
  critical: { icon: AlertTriangle, bg: "bg-red-50 border-red-100", iconClass: "text-red-600" },
  high: { icon: AlertTriangle, bg: "bg-amber-50 border-amber-100", iconClass: "text-amber-600" },
  medium: { icon: Info, bg: "bg-blue-50 border-blue-100", iconClass: "text-blue-600" },
  low: { icon: CheckCircle2, bg: "bg-gray-50 border-gray-100", iconClass: "text-gray-500" },
  info: { icon: Info, bg: "bg-gray-50 border-gray-100", iconClass: "text-gray-500" },
};

export default function AlertsPanel({ issues }: { issues: Issue[] }) {
  // Show top 5 by severity
  const severityOrder = ["critical", "high", "medium", "low", "info"];
  const sorted = [...issues]
    .sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity))
    .slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Alerts</CardTitle>
          <Zap className="w-4 h-4 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No active issues</p>
            <p className="text-xs text-gray-400 mt-1">
              Run a health check to assess your legal standing
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((issue) => {
              const config = severityConfig[issue.severity] || severityConfig.info;
              const Icon = config.icon;
              return (
                <div
                  key={issue.id}
                  className={`p-3.5 rounded-lg border ${config.bg}`}
                >
                  <div className="flex items-start gap-2.5">
                    <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${config.iconClass}`} />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{issue.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 capitalize">
                        {issue.severity} · {issue.domain.replace("_", " ")}
                      </p>
                      <Link
                        href="/dashboard/ai"
                        className="text-xs text-indigo-600 font-medium mt-1.5 hover:underline inline-block"
                      >
                        Ask AI for help →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

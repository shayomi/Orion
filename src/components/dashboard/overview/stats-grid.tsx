import { Card, CardContent } from "@/components/ui/card";
import { FileText, AlertTriangle, TrendingUp, Shield } from "lucide-react";

interface StatsGridProps {
  documentCount: number;
  issueCount: number;
  criticalCount: number;
  riskScore: number | null;
}

export default function StatsGrid({
  documentCount,
  issueCount,
  criticalCount,
  riskScore,
}: StatsGridProps) {
  const scoreLabel =
    riskScore === null
      ? "Not assessed"
      : riskScore >= 80
        ? "Strong"
        : riskScore >= 60
          ? "Good — room to improve"
          : riskScore >= 40
            ? "Needs attention"
            : "At risk";

  const stats = [
    {
      label: "Documents",
      value: String(documentCount),
      sub: documentCount === 0 ? "Generate your first" : `${documentCount} generated`,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Active Issues",
      value: String(issueCount),
      sub: issueCount === 0 ? "All clear" : `${criticalCount} critical/high`,
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Critical Actions",
      value: String(criticalCount),
      sub: criticalCount === 0 ? "No urgent items" : "Requires attention",
      icon: Shield,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Legal Health",
      value: riskScore !== null ? String(riskScore) : "—",
      sub: scoreLabel,
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
                </div>
                <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

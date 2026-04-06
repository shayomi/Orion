import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, FileText, Clock, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StatCard = {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  color: string;
  bg: string;
};

const statCards: StatCard[] = [
  {
    label: "Active Workflows",
    value: "1",
    sub: "1 in progress",
    icon: GitBranch,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    label: "Documents",
    value: "5",
    sub: "2 drafts pending",
    icon: FileText,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Pending Actions",
    value: "2",
    sub: "Requires attention",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Legal Health",
    value: "72",
    sub: "Good — room to improve",
    icon: TrendingUp,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {statCards.map((stat) => {
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

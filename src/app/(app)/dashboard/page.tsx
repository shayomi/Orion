import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  GitBranch,
  FileText,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import {
  mockUser,
  mockOrganization,
  mockWorkflows,
  mockAlerts,
} from "@/lib/mock-data";

const statCards = [
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

export default function DashboardPage() {
  const activeWorkflow = mockWorkflows.find((w) => w.status === "in_progress");
  const currentStep = activeWorkflow?.steps.find((s) => s.status === "in_progress");

  return (
    <div>
      <Topbar
        title="Overview"
        subtitle={mockOrganization.name}
      />

      <div className="p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-indigo-200 text-sm font-medium mb-1">Good morning</p>
              <h2 className="text-xl font-semibold">
                {mockUser.name.split(" ")[0]}, here&apos;s your startup at a glance
              </h2>
              <p className="text-indigo-200 text-sm mt-2">
                {mockOrganization.name} · {mockOrganization.structure} · {mockOrganization.jurisdiction}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{mockOrganization.riskScore}</div>
              <div className="text-indigo-200 text-xs mt-0.5">Legal Health Score</div>
            </div>
          </div>
          <div className="mt-4 h-1.5 bg-indigo-500 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${mockOrganization.riskScore}%` }}
            />
          </div>
        </div>

        {/* Stats */}
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

        <div className="grid grid-cols-3 gap-6">
          {/* Active Workflow */}
          <div className="col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Workflow</CardTitle>
                    <p className="text-sm text-gray-400 mt-0.5">{activeWorkflow?.title}</p>
                  </div>
                  <Badge variant="info">In Progress</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>{activeWorkflow?.progress}% complete</span>
                    <span>
                      {activeWorkflow?.steps.filter((s) => s.status === "completed").length}/
                      {activeWorkflow?.steps.length} steps
                    </span>
                  </div>
                  <Progress value={activeWorkflow?.progress ?? 0} />
                </div>

                <div className="space-y-2.5">
                  {activeWorkflow?.steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.status === "completed"
                            ? "bg-emerald-500"
                            : step.status === "in_progress"
                            ? "bg-indigo-600"
                            : "bg-gray-100"
                        }`}
                      >
                        {step.status === "completed" && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                        {step.status === "in_progress" && (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        )}
                        {step.status === "pending" && (
                          <div className="w-2 h-2 bg-gray-300 rounded-full" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          step.status === "completed"
                            ? "text-gray-400 line-through"
                            : step.status === "in_progress"
                            ? "text-gray-900 font-medium"
                            : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </span>
                      {step.status === "in_progress" && (
                        <Badge variant="info" className="ml-auto">Current</Badge>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Next: <span className="text-gray-900 font-medium">{currentStep?.title}</span>
                  </p>
                  <Link href="/dashboard/workflows">
                    <Button size="sm">
                      Continue <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <Link href="/dashboard/workflows">
                    <button className="w-full p-4 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group text-left">
                      <GitBranch className="w-5 h-5 text-indigo-500 mb-2" />
                      <p className="text-sm font-medium text-gray-900">Continue Workflow</p>
                      <p className="text-xs text-gray-400 mt-0.5">Incorporation Flow</p>
                    </button>
                  </Link>
                  <Link href="/dashboard/ai">
                    <button className="w-full p-4 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group text-left">
                      <Sparkles className="w-5 h-5 text-indigo-500 mb-2" />
                      <p className="text-sm font-medium text-gray-900">Ask AI</p>
                      <p className="text-xs text-gray-400 mt-0.5">Legal co-pilot</p>
                    </button>
                  </Link>
                  <Link href="/dashboard/documents">
                    <button className="w-full p-4 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group text-left">
                      <FileText className="w-5 h-5 text-indigo-500 mb-2" />
                      <p className="text-sm font-medium text-gray-900">Generate Document</p>
                      <p className="text-xs text-gray-400 mt-0.5">AI-powered drafts</p>
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Alerts</CardTitle>
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3.5 rounded-lg border ${
                        alert.type === "warning"
                          ? "bg-amber-50 border-amber-100"
                          : alert.type === "success"
                          ? "bg-emerald-50 border-emerald-100"
                          : "bg-blue-50 border-blue-100"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {alert.type === "warning" && (
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        )}
                        {alert.type === "success" && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        )}
                        {alert.type === "info" && (
                          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{alert.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{alert.description}</p>
                          {alert.action && (
                            <button className="text-xs text-indigo-600 font-medium mt-1.5 hover:underline">
                              {alert.action} →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

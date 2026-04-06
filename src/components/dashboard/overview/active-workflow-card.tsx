import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { mockWorkflows } from "@/lib/mock-data";

export default function ActiveWorkflowCard() {
  const activeWorkflow = mockWorkflows.find((w) => w.status === "in_progress");
  const currentStep = activeWorkflow?.steps.find((s) => s.status === "in_progress");

  return (
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
  );
}

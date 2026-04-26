"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  Lock,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Play,
} from "lucide-react";
import { PLACEHOLDER_WORKFLOWS } from "@/lib/data/workflows";
import { cn } from "@/lib/utils";

export default function WorkflowList() {
  const [expanded, setExpanded] = useState<string>("wf_01");

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {PLACEHOLDER_WORKFLOWS.filter((w) => w.status !== "locked").length} workflows available ·{" "}
        {PLACEHOLDER_WORKFLOWS.filter((w) => w.status === "in_progress").length} in progress
      </p>

      {PLACEHOLDER_WORKFLOWS.map((workflow) => {
        const isExpanded = expanded === workflow.id;
        const isLocked = workflow.status === "locked";

        return (
          <Card key={workflow.id} className={cn(isLocked && "opacity-70")}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {isLocked ? (
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        workflow.status === "in_progress" ? "bg-indigo-100" : "bg-gray-100"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          workflow.status === "in_progress" ? "bg-indigo-600" : "bg-gray-400"
                        }`}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{workflow.title}</CardTitle>
                      {workflow.status === "in_progress" && <Badge variant="info">Active</Badge>}
                      {workflow.status === "pending" && <Badge variant="outline">Not started</Badge>}
                      {workflow.status === "locked" && <Badge variant="default">Locked</Badge>}
                    </div>
                    <CardDescription>{workflow.description}</CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  {!isLocked && (
                    <button
                      onClick={() => setExpanded(isExpanded ? "" : workflow.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  {workflow.status === "in_progress" && (
                    <Button size="sm">
                      Continue <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  {workflow.status === "pending" && (
                    <Button size="sm" variant="outline">
                      <Play className="w-3 h-3" /> Start
                    </Button>
                  )}
                  {isLocked && (
                    <Button size="sm" variant="outline" disabled>
                      <Lock className="w-3 h-3" /> Locked
                    </Button>
                  )}
                </div>
              </div>

              {workflow.status === "in_progress" && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>{workflow.progress}% complete</span>
                    <span>
                      {workflow.steps.filter((s) => s.status === "completed").length} of{" "}
                      {workflow.steps.length} steps done
                    </span>
                  </div>
                  <Progress value={workflow.progress} />
                </div>
              )}
            </CardHeader>

            {isExpanded && !isLocked && workflow.steps.length > 0 && (
              <CardContent>
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  {workflow.steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-3">
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : step.status === "in_progress" ? (
                        <div className="w-4 h-4 rounded-full border-2 border-indigo-500 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                        </div>
                      ) : (
                        <Circle className="w-4 h-4 text-gray-200 flex-shrink-0" />
                      )}
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
                        <span className="ml-auto text-xs text-indigo-600 font-medium">
                          In progress
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}

            {isLocked && (
              <CardContent>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Unlock with Fund Package</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Available from $2,499 · Includes SAFE drafting & fundraising support
                      </p>
                    </div>
                    <Button size="sm" variant="secondary">
                      Upgrade
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

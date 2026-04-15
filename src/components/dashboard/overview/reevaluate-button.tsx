"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";

interface ReevalResult {
  overallScore: number;
  previousScore: number;
  scoreChange: number;
  riskLevel: string;
  commentary: string;
  summary: string;
  generatedDocCount: number;
}

export default function ReevaluateButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReevalResult | null>(null);
  const [error, setError] = useState("");

  const handleReevaluate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/health-check/reevaluate", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Re-evaluation failed");
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const improved = result.scoreChange > 0;
    const unchanged = result.scoreChange === 0;
    const TrendIcon = improved ? TrendingUp : unchanged ? Minus : TrendingDown;
    const trendColor = improved
      ? "text-emerald-600"
      : unchanged
        ? "text-gray-500"
        : "text-red-600";
    const trendBg = improved
      ? "bg-emerald-50 border-emerald-200"
      : unchanged
        ? "bg-gray-50 border-gray-200"
        : "bg-red-50 border-red-200";

    return (
      <Card className="overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-semibold text-gray-900">
                Legal Health Re-evaluation
              </h3>
            </div>
            <button
              onClick={() => setResult(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Score comparison */}
          <div className="flex items-center gap-6 mb-5">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Previous</p>
              <p className="text-2xl font-bold text-gray-400">{result.previousScore}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300" />
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">New Score</p>
              <p className="text-2xl font-bold text-gray-900">{result.overallScore}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${trendBg}`}>
              <TrendIcon className={`w-4 h-4 ${trendColor}`} />
              <span className={`text-sm font-bold ${trendColor}`}>
                {result.scoreChange > 0 ? "+" : ""}
                {result.scoreChange}
              </span>
            </div>
          </div>

          {/* Commentary */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
            <p className="text-sm text-indigo-900 leading-relaxed">
              {result.commentary}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Based on {result.generatedDocCount} document{result.generatedDocCount !== 1 ? "s" : ""} generated
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setResult(null)}>
                Dismiss
              </Button>
              <Link href="/dashboard/documents">
                <Button size="sm">
                  Keep improving <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Re-evaluate Legal Health</p>
            <p className="text-xs text-gray-400">
              Run a fresh AI assessment including your generated documents
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleReevaluate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Analysing...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Re-evaluate
            </>
          )}
        </Button>
      </div>
      {error && (
        <div className="px-5 pb-4">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </Card>
  );
}

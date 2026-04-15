const stageLabels: Record<string, string> = {
  idea: "Idea stage",
  pre_seed: "Pre-seed",
  seed: "Seed",
  series_a: "Series A",
  series_b: "Series B",
  growth: "Growth",
};

interface WelcomeBannerProps {
  firstName: string;
  startupName: string | null;
  jurisdiction: string | null;
  stage: string | null;
  riskScore: number | null;
}

export default function WelcomeBanner({
  firstName,
  startupName,
  jurisdiction,
  stage,
  riskScore,
}: WelcomeBannerProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const details = [startupName, stage ? stageLabels[stage] || stage : null, jurisdiction]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 text-white">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-indigo-200 text-sm font-medium mb-1">{greeting}</p>
          <h2 className="text-xl font-semibold">
            {firstName}, here&apos;s your startup at a glance
          </h2>
          {details && (
            <p className="text-indigo-200 text-sm mt-2">{details}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">{riskScore ?? "—"}</div>
          <div className="text-indigo-200 text-xs mt-0.5">Legal Health Score</div>
        </div>
      </div>
      {riskScore !== null && (
        <div className="mt-4 h-1.5 bg-indigo-500 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${riskScore}%` }}
          />
        </div>
      )}
    </div>
  );
}

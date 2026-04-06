import { mockUser, mockOrganization } from "@/lib/mock-data";

export default function WelcomeBanner() {
  return (
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
  );
}

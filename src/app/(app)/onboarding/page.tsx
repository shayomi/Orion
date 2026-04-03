"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "What are you building?" },
  { id: 2, title: "Where are you incorporating?" },
  { id: 3, title: "What's your funding status?" },
  { id: 4, title: "Tell us about your team" },
];

const categories = [
  "SaaS", "Marketplace", "Fintech", "Healthcare", "E-commerce", "AI/ML", "Consumer", "Deep Tech",
];
const jurisdictions = [
  "Delaware, USA", "Wyoming, USA", "United Kingdom", "Canada", "Cayman Islands", "Singapore", "Ireland", "Other",
];
const fundingStages = [
  { value: "bootstrapped", label: "Bootstrapped", desc: "Self-funded, no external investment" },
  { value: "raising", label: "Raising pre-seed", desc: "Actively looking for first check" },
  { value: "pre_seed", label: "Pre-seed raised", desc: "Have some funding, building MVP" },
  { value: "seed", label: "Seed raised", desc: "Have seed funding, scaling" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<Record<number, string | number>>({});
  const [companyName, setCompanyName] = useState("");
  const [teamSize, setTeamSize] = useState(2);

  const next = () => {
    if (step < 4) setStep(step + 1);
    else router.push("/dashboard");
  };
  const back = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">O</span>
        </div>
        <span className="text-base font-semibold text-gray-900 tracking-tight">Orion</span>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s) => (
          <div key={s.id} className="flex items-center gap-2">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                s.id < step
                  ? "bg-indigo-600 text-white"
                  : s.id === step
                  ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300"
                  : "bg-gray-100 text-gray-400"
              )}
            >
              {s.id < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
            </div>
            {s.id < 4 && (
              <div className={`w-12 h-px ${s.id < step ? "bg-indigo-400" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
        <div className="mb-6">
          <p className="text-xs text-gray-400 font-medium mb-1">Step {step} of {steps.length}</p>
          <h2 className="text-xl font-semibold text-gray-900">{steps[step - 1].title}</h2>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Company name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. TechStartup Inc."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelected({ ...selected, 1: cat })}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-medium border transition-colors",
                      selected[1] === cat
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-700"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="grid grid-cols-2 gap-2">
            {jurisdictions.map((j) => (
              <button
                key={j}
                onClick={() => setSelected({ ...selected, 2: j })}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium border text-left transition-colors",
                  selected[2] === j
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "border-gray-200 text-gray-700 hover:border-indigo-300"
                )}
              >
                {j}
              </button>
            ))}
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-3">
            {fundingStages.map((fs) => (
              <button
                key={fs.value}
                onClick={() => setSelected({ ...selected, 3: fs.value })}
                className={cn(
                  "w-full px-4 py-3.5 rounded-lg border text-left transition-colors",
                  selected[3] === fs.value
                    ? "bg-indigo-50 border-indigo-300"
                    : "border-gray-200 hover:border-indigo-200"
                )}
              >
                <p className={`text-sm font-semibold ${selected[3] === fs.value ? "text-indigo-700" : "text-gray-900"}`}>
                  {fs.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{fs.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-3">
                Number of founders: <span className="text-indigo-600 font-semibold">{teamSize}</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Solo founder</span>
                <span>10+</span>
              </div>
            </div>
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-sm font-semibold text-indigo-900">
                {teamSize > 1
                  ? `With ${teamSize} founders, you'll need a co-founder agreement.`
                  : "As a solo founder, we'll focus on IP protection and advisors."}
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                Orion will guide you through the right steps for your team structure.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button
              onClick={back}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}
          <Button onClick={next}>
            {step === 4 ? "Launch your dashboard" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Sparkles, GitBranch, FileText, CheckCircle2, Zap, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Legal Assistant",
    description:
      "Context-aware legal guidance that understands your startup's stage, jurisdiction, and goals. Ask anything — get actionable answers.",
  },
  {
    icon: GitBranch,
    title: "Workflow Engine",
    description:
      "Step-by-step legal journeys for incorporation, fundraising, and beyond. Never wonder what to do next.",
  },
  {
    icon: FileText,
    title: "Document Generation",
    description:
      "AI-generated SAFEs, NDAs, founder agreements, and more — in minutes, not days.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Set up your profile",
    description: "Tell Orion about your startup — jurisdiction, stage, and structure. Takes 2 minutes.",
  },
  {
    step: "02",
    title: "Follow your roadmap",
    description: "Orion generates a personalized legal roadmap based on your startup's needs.",
  },
  {
    step: "03",
    title: "Act with confidence",
    description: "Execute each step with AI guidance, auto-generated docs, and expert support.",
  },
];

const socialProof = [
  { metric: "500+", label: "Startups incorporated" },
  { metric: "$120M+", label: "Funding closed by clients" },
  { metric: "48 hrs", label: "Avg. incorporation time" },
  { metric: "4.9/5", label: "Founder satisfaction" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-medium text-indigo-700 mb-6">
          <Zap className="w-3 h-3" />
          Now with AI-powered legal guidance
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-5 max-w-3xl mx-auto">
          Your Legal Operating System for Startups
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
          Orion combines AI guidance, automated workflows, and expert legal services to help
          founders build on solid legal ground — from day one.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            View demo dashboard
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">No credit card required · Setup in 2 minutes</p>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-gray-100 py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8 text-center">
          {socialProof.map((item) => (
            <div key={item.label}>
              <p className="text-2xl font-bold text-gray-900">{item.metric}</p>
              <p className="text-sm text-gray-500 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Everything your startup needs — legally
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Orion is not a document tool. It&apos;s a stateful legal system that understands your startup.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 border-y border-gray-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">How Orion works</h2>
          </div>
          <div className="grid grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div className="text-4xl font-bold text-indigo-100 mb-4">{step.step}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Orion */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
              Built for founders, not lawyers
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Traditional legal tech gives you static documents. Orion gives you a living legal
              system that grows with your startup — understanding your context, flagging risks, and
              guiding your next move.
            </p>
            <ul className="space-y-3">
              {[
                "Context-aware AI that knows your startup",
                "Dynamic workflows, not static checklists",
                "Real legal support when you need humans",
                "Flat-fee pricing — no billable hour surprises",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 p-8">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Orion AI</p>
                  <p className="text-sm text-gray-800">
                    Your 83(b) election must be filed within 30 days of receiving restricted shares. Based on your incorporation date, you have{" "}
                    <strong>12 days remaining</strong>.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Risk Alert</p>
                  <p className="text-sm text-gray-800">
                    No co-founder IP assignment on file. This could block your Series A.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Milestone</p>
                  <p className="text-sm text-gray-800">
                    Delaware C-Corp incorporated ✓ — ready for SAFE rounds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Start building on solid ground
          </h2>
          <p className="text-indigo-200 mb-8">
            Join hundreds of founders who trust Orion to handle their legal foundation.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

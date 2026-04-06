import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Shield, Users } from "lucide-react";

const bullets = [
  "Multi-jurisdiction support — UK, US, Nigeria & Free Zones",
  "Deal structuring and full fundraising support",
  "Flat-fee packages — no surprise billing",
  "AI co-pilot for guidance, not just document generation",
];

export default function WhyOrionSection() {
  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
              A legal partner, not just a document tool
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Orion is not a traditional law firm and not a generic AI tool. We combine structured
              legal services with expert support and an AI layer that keeps you informed — so you
              can make better decisions at every stage.
            </p>
            <ul className="space-y-3">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-indigo-600 font-medium text-sm hover:text-indigo-700 transition-colors"
              >
                View packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <AiPreviewCards />
        </div>
      </div>
    </section>
  );
}

function AiPreviewCards() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 p-8">
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Orion AI</p>
            <p className="text-sm text-gray-800">
              Your SAFE needs a post-money valuation cap. At your target of £500k on a £3M cap,
              your dilution is approximately <strong>14.3%</strong> — here&apos;s how that affects
              your next round.
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
              No vesting schedule on founder shares. Investors will flag this during due
              diligence — let&apos;s fix it before your raise.
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
              UK Ltd incorporated ✓ — share structure confirmed. Ready to issue founder shares
              and begin fundraising.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

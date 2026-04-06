import { Building2, TrendingUp, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Pillar = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const pillars: Pillar[] = [
  {
    icon: Building2,
    title: "Startup Setup & Structuring",
    description:
      "Incorporate in the UK, US, or Nigeria (including Free Zones). Set up founder agreements, share structure, and governance — built to hold up when investors look closely.",
  },
  {
    icon: TrendingUp,
    title: "Fundraising & Deal Support",
    description:
      "Structure deals, review term sheets, close SAFE and convertible rounds, and navigate due diligence. We help founders actually close investment, not just manage paperwork.",
  },
  {
    icon: Sparkles,
    title: "Ongoing Legal + AI Co-pilot",
    description:
      "Continuous support for contracts, compliance, and regulatory matters — with an AI assistant that helps you understand what to do next and when to bring in an expert.",
  },
];

export default function PillarsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Everything founders need, legally
        </h2>
        <p className="text-gray-500 mt-3 max-w-lg mx-auto">
          Orion covers the full startup lifecycle — from setting up your company to raising
          capital and operating at scale.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{pillar.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{pillar.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

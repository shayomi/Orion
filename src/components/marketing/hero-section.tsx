import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-medium text-indigo-700 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
        Legal guidance for every stage of your startup
      </div>
      <h1 className="text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-5 max-w-3xl mx-auto">
        The legal platform built for startup founders
      </h1>
      <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
        From incorporating your company to closing your first investment round — Orion combines
        structured legal services, deal support, and an AI co-pilot to help you build with
        confidence.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/health-check"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Free Legal Health Check <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          See our packages
        </Link>
      </div>
      <p className="text-xs text-gray-400 mt-4">
        No signup required · 5 minutes · Instant results
      </p>
    </section>
  );
}

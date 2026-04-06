import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="bg-indigo-600 py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Get your legal foundation right</h2>
        <p className="text-indigo-200 mb-8">
          Join founders building in the UK, US, and Nigeria who trust Orion to handle the legal
          side — so they can focus on building.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
        >
          Get started <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

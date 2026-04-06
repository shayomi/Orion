import Link from "next/link";
import { ArrowRight } from "lucide-react";

const packages = [
  {
    name: "Launch",
    tagline: "Incorporate and structure your company",
    featured: false,
  },
  {
    name: "Fund",
    tagline: "Structure your raise and close your round",
    featured: true,
  },
  {
    name: "Scale",
    tagline: "Full legal operations as you grow",
    featured: false,
  },
];

export default function PackagesTeaser() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-center">
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
        Three packages, built for where you are
      </h2>
      <p className="text-gray-500 max-w-lg mx-auto mb-10">
        Launch your company, raise your round, or get full legal operations in place. Pick the
        package that fits your stage.
      </p>
      <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className={`p-6 rounded-2xl border ${
              pkg.featured
                ? "border-indigo-300 bg-indigo-50"
                : "border-gray-200 bg-white"
            }`}
          >
            {pkg.featured && (
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-bold text-gray-900 mt-1">{pkg.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{pkg.tagline}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          See full pricing <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

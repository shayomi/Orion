import { CheckCircle2, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/data/services";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
          Three packages, built for your stage
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          From setting up your company to closing your first round — flat-fee pricing with no
          hourly surprises. Pick the package that fits where you are.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {SERVICES.map((service) => (
          <div
            key={service.id}
            className={`relative bg-white rounded-2xl border p-8 ${
              service.popular
                ? "border-indigo-300 shadow-lg"
                : "border-gray-100 shadow-sm"
            }`}
          >
            {service.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{service.description}</p>
              <div className="mt-5">
                <span className="text-4xl font-bold text-gray-900">
                  ${service.price.toLocaleString()}
                </span>
                <span className="text-gray-400 text-sm ml-1">one-time</span>
              </div>
            </div>

            <Link
              href="/signup"
              className={`block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors mb-6 ${
                service.popular
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {service.cta} {service.cta !== "Contact Us" && <ArrowRight className="inline w-3.5 h-3.5 ml-1" />}
            </Link>

            <ul className="space-y-3">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* FAQ teaser */}
      <div className="text-center mt-14 space-y-2">
        <p className="text-gray-500 text-sm">
          Not sure which package is right for you?{" "}
          <a href="#" className="text-indigo-600 font-medium hover:underline">
            Talk to our team
          </a>
        </p>
        <p className="text-xs text-gray-400">
          We support founders in the UK, US, Nigeria, and Free Zones.
        </p>
      </div>
    </div>
  );
}

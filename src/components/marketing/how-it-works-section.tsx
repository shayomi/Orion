const steps = [
  {
    step: "01",
    title: "Tell us about your startup",
    description:
      "Share your stage, jurisdiction, and goals. Orion maps out exactly what legal steps you need — and in what order.",
  },
  {
    step: "02",
    title: "Follow a structured path",
    description:
      "Work through guided legal journeys for incorporation, fundraising, or ongoing operations. No guesswork, no confusion.",
  },
  {
    step: "03",
    title: "Close deals and scale",
    description:
      "Move from setup to investment rounds with expert legal support and an AI co-pilot that keeps you informed at every step.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">How Orion works</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            A simple, guided process — so you always know where you stand and what comes next.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="text-4xl font-bold text-indigo-100 mb-4">{step.step}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

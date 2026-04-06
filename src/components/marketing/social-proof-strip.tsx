const stats = [
  { metric: "200+", label: "Startups structured" },
  { metric: "$80M+", label: "Deals supported" },
  { metric: "3", label: "Jurisdictions covered" },
  { metric: "4.9/5", label: "Founder satisfaction" },
];

export default function SocialProofStrip() {
  return (
    <section className="border-y border-gray-100 py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8 text-center">
        {stats.map((item) => (
          <div key={item.label}>
            <p className="text-2xl font-bold text-gray-900">{item.metric}</p>
            <p className="text-sm text-gray-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

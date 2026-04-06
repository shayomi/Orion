const jurisdictions = [
  "United Kingdom",
  "United States",
  "Nigeria",
  "Lagos Free Zone",
  "Lekki Free Zone",
];

export default function JurisdictionsStrip() {
  return (
    <section className="border-y border-gray-100 py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-5">
          Incorporation &amp; structuring in
        </p>
        <div className="flex items-center justify-center flex-wrap gap-3">
          {jurisdictions.map((name) => (
            <span
              key={name}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

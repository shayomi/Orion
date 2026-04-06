import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">O</span>
          </div>
          <span className="text-base font-semibold text-gray-900 tracking-tight">Orion</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Services & Pricing
          </Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">O</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">Orion</span>
          </div>
          <p className="text-xs text-gray-400">
            © 2025 Orion. Legal platform for startups. UK · US · Nigeria.
          </p>
        </div>
      </footer>
    </div>
  );
}

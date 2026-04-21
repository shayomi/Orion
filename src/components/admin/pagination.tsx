import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}

export function Pagination({
  page,
  totalPages,
  total,
  basePath,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    if (searchParams) {
      for (const [k, v] of Object.entries(searchParams)) {
        if (v) params.set(k, v);
      }
    }
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const linkBase =
    "inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors";
  const activeClass = "bg-indigo-600 text-white border-indigo-600";
  const inactiveClass =
    "border-gray-200 text-gray-700 hover:bg-gray-50 bg-white";
  const disabledClass =
    "border-gray-100 text-gray-300 bg-gray-50 pointer-events-none";

  // Show up to 7 page buttons with ellipsis
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-xs text-gray-500">
        {total} result{total !== 1 ? "s" : ""}
      </p>
      <div className="flex items-center gap-1">
        <Link
          href={buildHref(page - 1)}
          className={cn(linkBase, hasPrev ? inactiveClass : disabledClass)}
          aria-disabled={!hasPrev}
          tabIndex={hasPrev ? 0 : -1}
        >
          Prev
        </Link>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} className="px-1 text-xs text-gray-400">
              ...
            </span>
          ) : (
            <Link
              key={p}
              href={buildHref(p)}
              className={cn(linkBase, p === page ? activeClass : inactiveClass)}
            >
              {p}
            </Link>
          )
        )}

        <Link
          href={buildHref(page + 1)}
          className={cn(linkBase, hasNext ? inactiveClass : disabledClass)}
          aria-disabled={!hasNext}
          tabIndex={hasNext ? 0 : -1}
        >
          Next
        </Link>
      </div>
    </div>
  );
}

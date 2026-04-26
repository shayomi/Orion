"use client";

import { useSidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <main
      className={cn(
        "min-h-screen transition-[margin] duration-200 ease-out",
        collapsed ? "md:ml-16" : "md:ml-60"
      )}
    >
      {children}
    </main>
  );
}

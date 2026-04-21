"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  GitBranch,
  FileText,
  Package,
  Settings,
  Building2,
  Users,
  Shield,
  UserCog,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const memberNavItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Assistant", href: "/dashboard/ai", icon: Sparkles },
  { label: "Workflows", href: "/dashboard/workflows", icon: GitBranch },
  { label: "Documents", href: "/dashboard/documents", icon: FileText },
  { label: "Expert Help", href: "/dashboard/referrals", icon: Users },
  { label: "Services", href: "/dashboard/services", icon: Package },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminNavItems = [
  { label: "Overview", href: "/admin", icon: Shield },
  { label: "AI Assistant", href: "/dashboard/ai", icon: Sparkles },
  { label: "Manage Users", href: "/admin/users", icon: UserCog },
  { label: "Assessments", href: "/admin/assessments", icon: ClipboardList },
];

interface SidebarProps {
  user: {
    name: string;
    email: string;
    role: "member" | "admin";
    status: "active" | "suspended";
  };
  startup: { name: string; stage: string | null } | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const stageLabels: Record<string, string> = {
  idea: "Idea stage",
  pre_seed: "Pre-seed",
  seed: "Seed",
  series_a: "Series A",
  series_b: "Series B",
  growth: "Growth",
};

export function Sidebar({ user, startup }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = user.role === "admin" && user.status === "active";
  const navItems = isAdmin ? adminNavItems : memberNavItems;

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-100 flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link
          href={isAdmin ? "/admin" : "/dashboard"}
          className="flex items-center gap-2.5"
        >
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">O</span>
          </div>
          <span className="text-base font-semibold text-gray-900 tracking-tight">
            Orion{isAdmin ? " Admin" : ""}
          </span>
        </Link>
      </div>

      {/* Org badge — only for members */}
      {!isAdmin && (
        <div className="px-3 py-3 border-b border-gray-100">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {startup?.name || "My Startup"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {startup?.stage
                  ? stageLabels[startup.stage] || startup.stage
                  : "Startup"}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isExactMatch = item.href === "/dashboard" || item.href === "/admin";
          const isActive = isExactMatch
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isActive ? "text-indigo-600" : "text-gray-400"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-gray-100">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">
              {getInitials(user.name)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}

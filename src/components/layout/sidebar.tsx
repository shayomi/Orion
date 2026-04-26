"use client";

import { useState, useEffect, createContext, useContext } from "react";
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
  Inbox,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Sidebar context ────────────────────────────────────

interface UserInfo {
  name: string;
  email: string;
}

const SidebarContext = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  userInfo: UserInfo | null;
}>({ open: false, setOpen: () => {}, collapsed: false, setCollapsed: () => {}, userInfo: null });

export function useSidebar() {
  return useContext(SidebarContext);
}

// ─── Nav items ──────────────────────────────────────────

const memberNavItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "AI Assistant", href: "/dashboard/ai", icon: Sparkles },
  { label: "Workflows", href: "/dashboard/workflows", icon: GitBranch },
  { label: "Documents", href: "/dashboard/documents", icon: FileText },
  { label: "Expert Help", href: "/dashboard/referrals", icon: Users },
  { label: "Services", href: "/dashboard/services", icon: Package },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminNavItems = [
  { label: "Overview", href: "/admin", icon: Shield, exact: true },
  { label: "AI Assistant", href: "/dashboard/ai", icon: Sparkles },
  { label: "Manage Users", href: "/admin/users", icon: UserCog },
  { label: "Assessments", href: "/admin/assessments", icon: ClipboardList, exact: true },
  { label: "Submissions", href: "/admin/assessments/submissions", icon: Inbox },
];

// ─── Types ──────────────────────────────────────────────

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

// ─── Active state logic ─────────────────────────────────

function getBestMatch(
  pathname: string,
  items: typeof adminNavItems
): string | null {
  let best: (typeof items)[0] | null = null;
  for (const item of items) {
    if (item.exact && pathname === item.href) return item.href;
    if (!item.exact && (pathname === item.href || pathname.startsWith(item.href + "/"))) {
      if (!best || item.href.length > best.href.length) {
        best = item;
      }
    }
  }
  return best?.href ?? null;
}

// ─── Sidebar content (shared between desktop and mobile) ─

function SidebarContent({
  user,
  startup,
  onNavigate,
  collapsed = false,
}: SidebarProps & { onNavigate?: () => void; collapsed?: boolean }) {
  const pathname = usePathname();
  const isAdmin = user.role === "admin" && user.status === "active";
  const navItems = isAdmin ? adminNavItems : memberNavItems;
  const activeHref = getBestMatch(pathname, navItems);

  return (
    <>
      {/* Logo */}
      <div className={cn("py-5 border-b border-indigo-100/40", collapsed ? "px-3" : "px-5")}>
        <Link
          href={isAdmin ? "/admin" : "/dashboard"}
          className="flex items-center gap-2.5"
          onClick={onNavigate}
        >
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">O</span>
          </div>
          {!collapsed && (
            <span className="text-base font-semibold text-gray-900 tracking-tight">
              Orion{isAdmin ? " Admin" : ""}
            </span>
          )}
        </Link>
      </div>

      {/* Org badge — only for members */}
      {!isAdmin && !collapsed && (
        <div className="px-3 py-3 border-b border-indigo-100/40">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-indigo-50/40 hover:bg-indigo-50/70 transition-colors"
            onClick={onNavigate}
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

      {/* Collapsed org icon */}
      {!isAdmin && collapsed && (
        <div className="px-3 py-3 border-b border-indigo-100/40 flex justify-center">
          <Link
            href="/dashboard/settings"
            className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center hover:bg-indigo-100/60 transition-colors"
            onClick={onNavigate}
            title={startup?.name || "My Startup"}
          >
            <Building2 className="w-4 h-4 text-indigo-600" />
          </Link>
        </div>
      )}

      {/* Nav */}
      <nav className={cn("flex-1 py-3 space-y-0.5 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeHref === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2",
                isActive
                  ? "bg-indigo-100/70 text-indigo-700"
                  : "text-gray-600 hover:bg-indigo-50/60 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isActive ? "text-indigo-600" : "text-gray-400"
                )}
              />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className={cn("py-3 border-t border-indigo-100/40", collapsed ? "px-2" : "px-3")}>
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center rounded-lg hover:bg-gray-50/80 transition-colors",
            collapsed ? "justify-center px-2 py-2" : "gap-3 px-2 py-2"
          )}
          onClick={onNavigate}
          title={collapsed ? user.name : undefined}
        >
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">
              {getInitials(user.name)}
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          )}
        </Link>
      </div>
    </>
  );
}

// ─── Main exported component ────────────────────────────

export function SidebarProvider({
  children,
  userName,
  userEmail,
}: {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const userInfo = userName ? { name: userName, email: userEmail || "" } : null;

  // Close mobile on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, collapsed, setCollapsed, userInfo }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({ user, startup }: SidebarProps) {
  const { open, setOpen, collapsed, setCollapsed } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex fixed left-0 top-0 h-full bg-[#f8f7ff] border-r border-indigo-100/50 flex-col z-30 transition-[width] duration-200 ease-out",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <SidebarContent user={user} startup={startup} collapsed={collapsed} />
        {/* Collapse toggle */}
        <div className={cn("py-2 border-t border-indigo-100/40", collapsed ? "px-2" : "px-3")}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex items-center rounded-lg text-gray-400 hover:bg-gray-50/80 hover:text-gray-600 transition-colors text-sm",
              collapsed ? "justify-center w-full px-2 py-2" : "gap-3 px-3 py-2 w-full"
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4" />
                <span className="text-xs font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile slide-out */}
      <aside
        className={cn(
          "md:hidden fixed left-0 top-0 h-full w-72 bg-[#f8f7ff] border-r border-indigo-100/50 flex flex-col z-50 transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100/80 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent
          user={user}
          startup={startup}
          onNavigate={() => setOpen(false)}
        />
      </aside>
    </>
  );
}

// ─── Mobile menu button (used in topbar) ────────────────

export function MobileMenuButton() {
  const { setOpen } = useSidebar();

  return (
    <button
      onClick={() => setOpen(true)}
      className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100/80 hover:text-gray-700 transition-colors"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}

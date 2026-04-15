"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Settings, LogOut, Building2, User } from "lucide-react";
import { logOut } from "@/app/actions/auth";

interface TopbarProps {
  title: string;
  subtitle?: string;
  userInitials?: string;
  userName?: string;
  userEmail?: string;
  startupName?: string;
  startupStage?: string | null;
}

const stageLabels: Record<string, string> = {
  idea: "Idea stage",
  pre_seed: "Pre-seed",
  seed: "Seed",
  series_a: "Series A",
  series_b: "Series B",
  growth: "Growth",
};

export function Topbar({
  title,
  subtitle,
  userInitials = "U",
  userName = "User",
  userEmail = "",
  startupName,
  startupStage,
}: TopbarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <header className="h-14 border-b border-gray-100 bg-white px-6 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-700 transition-colors"
          >
            <span className="text-white text-xs font-semibold">{userInitials}</span>
          </button>

          {open && (
            <div className="absolute right-0 top-10 w-64 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">{userInitials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Startup info */}
              {startupName && (
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{startupName}</p>
                      {startupStage && (
                        <p className="text-xs text-gray-400 truncate">
                          {stageLabels[startupStage] || startupStage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="py-1">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-gray-400" />
                  Settings
                </Link>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 py-1">
                <form action={logOut}>
                  <button
                    type="submit"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

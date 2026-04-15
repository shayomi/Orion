"use client";

import { useEffect, useRef } from "react";
import { persistHealthCheck } from "@/app/actions/health-check";

/**
 * Drop this into any authenticated page (e.g. dashboard layout).
 * If the user has a guest health check in localStorage, it persists
 * the results to the database and clears localStorage.
 */
export function PersistGuestCheck() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const stored = localStorage.getItem("orion_health_check");
    if (!stored) return;

    persistHealthCheck(stored)
      .then((res) => {
        if (res.success) {
          localStorage.removeItem("orion_health_check");
        }
      })
      .catch(() => {
        // Silently fail — will retry on next dashboard load
      });
  }, []);

  return null;
}

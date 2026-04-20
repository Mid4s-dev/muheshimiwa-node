"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    void fetch("/api/analytics/visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      // Silently ignore analytics errors.
    });
  }, [pathname]);

  return null;
}

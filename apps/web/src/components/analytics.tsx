"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Tells the server which page was opened. No cookies, nothing stored on the
 * visitor's device, and nothing is sent if their browser asks not to be tracked.
 */
export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!pathname || navigator.doNotTrack === "1") return;
    // The referring site only matters for the first page of a visit.
    const body = JSON.stringify({ path: pathname, referrer: first.current ? document.referrer : "" });
    first.current = false;
    if (!navigator.sendBeacon?.("/api/track", body)) {
      void fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => undefined);
    }
  }, [pathname]);

  return null;
}

/** Marks this browser as yours, so your own visits don't count. Rendered in the admin. */
export function NoTrack() {
  useEffect(() => {
    document.cookie = "no_track=1; path=/; max-age=31536000; samesite=lax";
  }, []);
  return null;
}

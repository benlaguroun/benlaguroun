"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Re-checks the page every few seconds for a short while. Used on the thank-you
 * page when the payment provider's confirmation hasn't arrived yet, so buyers
 * see their access appear without having to reload.
 */
export function AutoRefresh({ every = 3000, times = 20 }: { every?: number; times?: number }) {
  const router = useRouter();
  useEffect(() => {
    let runs = 0;
    const id = setInterval(() => {
      runs += 1;
      router.refresh();
      if (runs >= times) clearInterval(id);
    }, every);
    return () => clearInterval(id);
  }, [router, every, times]);
  return null;
}

"use client";

import { useEffect, useRef } from "react";

/**
 * Two effects driven by one mouse listener:
 *  1. A soft light that trails the cursor across the whole page.
 *  2. For any element with the .spot class, sets --mx/--my so its CSS
 *     spotlight and glowing border follow the pointer.
 * Disabled on touch screens and when the system asks for reduced motion.
 */
export function CursorGlow() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    let target: Element | null = null;

    const paint = () => {
      frame = 0;
      glow.current?.style.setProperty("--cx", `${x}px`);
      glow.current?.style.setProperty("--cy", `${y}px`);
      const card = target?.closest<HTMLElement>(".spot");
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${x - r.left}px`);
        card.style.setProperty("--my", `${y - r.top}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      target = e.target as Element | null;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={glow} className="cursor-glow" aria-hidden />;
}

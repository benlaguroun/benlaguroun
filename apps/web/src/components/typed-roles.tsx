"use client";

import { useEffect, useState } from "react";

/** Types out each role in turn, deletes it, then moves to the next. */
export function TypedRoles({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(roles[0] ?? "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const full = roles[index] ?? "";

    let delay = deleting ? 35 : 70;
    if (!deleting && text === full) delay = 1700;
    if (deleting && text === "") delay = 350;

    const id = setTimeout(() => {
      if (!deleting && text === full) return setDeleting(true);
      if (deleting && text === "") {
        setDeleting(false);
        return setIndex((i) => (i + 1) % roles.length);
      }
      setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1));
    }, delay);

    return () => clearTimeout(id);
  }, [text, deleting, index, roles]);

  return (
    <span className="inline-flex min-h-[1.6em] items-center gap-1 font-mono text-sm text-aqua sm:text-base" dir="auto">
      <span aria-live="off">{text}</span>
      <span className="caret" aria-hidden />
    </span>
  );
}

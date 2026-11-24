"use client";

import { useTransition } from "react";
import { markLessonComplete } from "@/app/actions";
import type { Dict } from "@/i18n/dictionaries";
import { Check } from "./icons";

export function CompleteLessonButton({
  lessonId,
  courseSlug,
  done,
  t,
}: {
  lessonId: string;
  courseSlug: string;
  done: boolean;
  t: Dict["learn"];
}) {
  const [pending, start] = useTransition();

  if (done) {
    return (
      <span className="chip">
        <Check className="h-3.5 w-3.5" /> {t.completed}
      </span>
    );
  }

  return (
    <button
      type="button"
      className="btn btn-primary"
      disabled={pending}
      onClick={() => start(() => markLessonComplete(lessonId, courseSlug))}
    >
      {pending ? t.saving : t.complete}
    </button>
  );
}

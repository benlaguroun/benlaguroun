"use client";

import { useTransition } from "react";
import { markLessonComplete } from "@/app/actions";

export function CompleteLessonButton({
  lessonId,
  courseSlug,
  done,
}: {
  lessonId: string;
  courseSlug: string;
  done: boolean;
}) {
  const [pending, start] = useTransition();

  if (done) {
    return <span className="chip">✓ Completed</span>;
  }

  return (
    <button
      type="button"
      className="btn-dark"
      disabled={pending}
      onClick={() => start(() => markLessonComplete(lessonId, courseSlug))}
    >
      {pending ? "Saving…" : "Mark as complete"}
    </button>
  );
}

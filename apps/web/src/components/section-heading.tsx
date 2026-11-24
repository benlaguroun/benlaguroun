import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  body,
  href,
  hrefLabel,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display mt-2 text-3xl font-semibold sm:text-4xl">{title}</h2>
        {body && <p className="mt-3 text-muted">{body}</p>}
      </div>
      {href && (
        <Link href={href} className="text-sm font-semibold text-accent hover:underline">
          {hrefLabel ?? "See all"} →
        </Link>
      )}
    </div>
  );
}

export function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <section className="border-b border-line">
      <div className="wrap py-14 sm:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-3 max-w-3xl text-4xl font-semibold sm:text-5xl">{title}</h1>
        {body && <p className="mt-4 max-w-2xl text-lg text-muted">{body}</p>}
      </div>
    </section>
  );
}

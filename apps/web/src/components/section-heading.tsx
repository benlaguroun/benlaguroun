import Link from "next/link";
import { Arrow } from "./icons";
import { Reveal } from "./reveal";

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
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="display mt-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
        {body && <p className="mt-3 text-mute">{body}</p>}
      </div>
      {href && (
        <Link href={href} className="flex items-center gap-1.5 text-sm font-semibold text-aqua hover:underline">
          {hrefLabel} <Arrow />
        </Link>
      )}
    </Reveal>
  );
}

export function PageIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <section className="border-b border-line">
      <div className="wrap py-16 sm:py-24">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display mt-4 max-w-3xl text-4xl font-semibold sm:text-6xl">
            <span className="text-gradient">{title}</span>
          </h1>
          {body && <p className="mt-5 max-w-2xl text-lg text-mute">{body}</p>}
        </Reveal>
      </div>
    </section>
  );
}

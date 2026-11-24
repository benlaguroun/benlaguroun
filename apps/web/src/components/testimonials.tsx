import { localize } from "@/i18n/content";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

type Item = { id: string; name: string; role: string | null; quote: string; translations: unknown };

/** Client quotes. Renders nothing until you have published at least one. */
export function Testimonials({ items, locale, t }: { items: Item[]; locale: Locale; t: Dict["testimonials"] }) {
  if (items.length === 0) return null;

  return (
    <section className="wrap pt-28">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} />
      <div className={`grid gap-5 ${items.length === 1 ? "mx-auto max-w-2xl" : items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {items.map((raw, i) => {
          const item = localize(raw, locale);
          return (
            <Reveal key={item.id} delay={i * 100}>
              <figure className="glass flex h-full flex-col p-7">
                <span aria-hidden className="display text-5xl leading-none text-gradient">“</span>
                <blockquote className="mt-2 flex-1 leading-relaxed" dir="auto">{item.quote}</blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <p className="font-semibold">{item.name}</p>
                  {item.role && <p className="mt-0.5 text-sm text-mute">{item.role}</p>}
                </figcaption>
              </figure>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

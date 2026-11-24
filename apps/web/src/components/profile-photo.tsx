import Image from "next/image";
import { site } from "@/config/site";
import { getProfilePhoto } from "@/lib/profile";

/**
 * Shows apps/web/public/profile.(jpg|png|webp). Until that file exists it
 * shows a gradient monogram so the layout never looks broken.
 */
export function ProfilePhoto({ alt, priority = false }: { alt: string; priority?: boolean }) {
  const src = getProfilePhoto();

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={800}
        height={1000}
        priority={priority}
        sizes="(min-width: 1024px) 420px, 80vw"
        className="h-full w-full object-cover"
      />
    );
  }

  const initials = site.name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2);

  return (
    <div
      role="img"
      aria-label={alt}
      className="grid h-full w-full place-items-center bg-gradient-to-br from-iris/40 via-panel to-aqua/30"
    >
      <span className="display text-8xl font-semibold text-white/80">{initials}</span>
    </div>
  );
}

import Image from "next/image";
import type { ProjectImage } from "@/lib/content";
import { cn } from "@/lib/utils";

interface ScreenshotFrameProps {
  image: ProjectImage;
  /** Caption shown in the window bar (decorative). */
  label: string;
  sizes: string;
  /** CSS aspect-ratio override; defaults to the screenshot's own ratio so nothing is cropped. */
  aspect?: string;
  className?: string;
  priority?: boolean;
}

/**
 * A browser-style window around a REAL screenshot from the portfolio PDF.
 * The window bar is purely decorative: it carries a plain caption, not a fake URL.
 * The image is nudged 1.2% so a scrollbar captured at the screenshot's right edge is cropped away.
 */
export function ScreenshotFrame({ image, label, sizes, aspect, className, priority }: ScreenshotFrameProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl bg-white shadow-frame ring-1 ring-black/10", className)}>
      <div aria-hidden="true" className="flex h-7 items-center gap-1.5 bg-[#e8e5dc] px-3">
        <span className="size-2 rounded-full bg-deepsea" />
        <span className="size-2 rounded-full bg-seaglass" />
        <span className="size-2 rounded-full bg-aqua" />
        <span className="eyebrow ml-2 truncate text-[10px] text-ink-muted">{label}</span>
      </div>
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: aspect ?? `${image.width} / ${image.height}` }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{
            objectPosition: image.objectPosition ?? "0% 0%",
            transform: "scale(1.012)",
            transformOrigin: "0 0",
          }}
        />
      </div>
    </div>
  );
}

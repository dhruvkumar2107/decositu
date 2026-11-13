import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const DEFAULT_LOGO = "/images/logo.png";

export function Logo({
  src = DEFAULT_LOGO,
  light = false,
  compact = false,
  className,
}: {
  /** Logo image URL, managed from Admin → Site images. */
  src?: string;
  /** Placed on a dark background: the logo sits on a soft ivory plate so it stays legible. */
  light?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Decoritu home"
      className={cn(
        "inline-flex items-center",
        light && "rounded-sm bg-ivory px-4 py-3",
        className,
      )}
    >
      <Image
        src={src || DEFAULT_LOGO}
        alt="Decoritu — Walkin for New Ideas"
        width={0}
        height={0}
        sizes="(max-width: 1024px) 160px, 220px"
        priority={!light}
        className={cn(
          "w-auto max-w-[220px] object-contain",
          light ? "h-20" : compact ? "h-[50px]" : "h-[58px] lg:h-[64px]",
        )}
      />
    </Link>
  );
}

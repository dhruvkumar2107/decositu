import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  light = false,
  compact = false,
  className,
}: {
  light?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Decoritu home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
          light ? "border-ivory/50" : "border-ink/30",
        )}
      >
        <span className={cn("h-1.5 w-1.5 rotate-45", light ? "bg-ivory" : "bg-olive")} />
      </span>
      <span
        className={cn(
          "font-display uppercase leading-none",
          compact ? "text-[1.35rem] tracking-[0.18em]" : "text-[1.65rem] tracking-[0.21em] md:text-[1.8rem]",
          light ? "text-ivory" : "text-ink",
        )}
      >
        Decoritu
      </span>
    </Link>
  );
}

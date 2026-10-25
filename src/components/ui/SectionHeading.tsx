import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  actionHref,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: string;
  actionHref?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className={cn("eyebrow mb-4", light ? "text-ivory/60" : "text-muted")}>{eyebrow}</p>
        )}
        <h2
          className={cn(
            "display text-[2.45rem] leading-[0.95] sm:text-5xl lg:text-[3.6rem]",
            light ? "text-ivory" : "text-ink",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-4 max-w-xl text-sm leading-7",
              light ? "text-ivory/70" : "text-muted",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && actionHref && (
        <Link
          href={actionHref}
          className={cn(
            "link-underline inline-flex shrink-0 items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em]",
            light ? "text-ivory" : "text-ink",
          )}
        >
          {action}
          <ArrowRight size={14} strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}

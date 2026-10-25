import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CategoryTile({
  href,
  image,
  eyebrow,
  title,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  href: string;
  image: string;
  eyebrow?: string;
  title: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("group relative block overflow-hidden bg-cream", className)}
    >
      <Image
        src={image}
        alt={title}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-charcoal/5 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-ivory md:p-6">
        <div>
          {eyebrow && <p className="eyebrow mb-1.5 text-ivory/65">{eyebrow}</p>}
          <h3 className="font-display text-2xl leading-none md:text-[1.8rem]">{title}</h3>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ivory/40 transition-all duration-300 group-hover:rotate-45 group-hover:bg-ivory group-hover:text-ink">
          <ArrowUpRight size={15} strokeWidth={1.4} />
        </span>
      </div>
    </Link>
  );
}

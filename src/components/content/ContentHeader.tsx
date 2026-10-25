import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function ContentHeader({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="border-b border-line bg-paper">
      <div className="container-luxe py-10 md:py-14">
        <nav className="flex flex-wrap items-center gap-2 text-[0.63rem] uppercase tracking-[0.12em] text-muted" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-ink">Home</Link>
          <ChevronRight size={11} />
          <span className="text-ink">{title}</span>
        </nav>

        <div className={image ? "mt-8 grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16" : "mt-8 max-w-3xl"}>
          <div>
            <p className="eyebrow text-muted">{eyebrow}</p>
            <h1 className="display mt-4 text-[3rem] leading-[0.92] sm:text-[4rem] lg:text-[4.8rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted">{description}</p>
          </div>
          {image && (
            <div className="relative hidden h-[220px] overflow-hidden bg-cream sm:block lg:h-[260px]">
              <Image
                src={image}
                alt={imageAlt ?? title}
                fill
                priority
                sizes="(max-width: 1024px) 40vw, 34vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/10" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

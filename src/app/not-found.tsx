import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container-luxe grid items-center gap-10 py-16 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:py-24">
      <div>
        <p className="eyebrow text-muted">404 · A turn in the hallway</p>
        <h1 className="display mt-4 text-[4.2rem] leading-[0.88] sm:text-[5.4rem]">
          Nothing here,<br />only quiet.
        </h1>
        <p className="mt-5 max-w-md text-sm leading-7 text-muted">
          The page you were looking for may have moved, sold out or never existed. Let us guide you
          back to something worth seeing.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">Return home <ArrowRight size={14} /></Link>
          <Link href="/collections/bestsellers" className="btn btn-outline">Browse bestsellers</Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted">
          <Link href="/collections/bedding" className="hover:text-ink">Bedding</Link>
          <Link href="/collections/curtains" className="hover:text-ink">Curtains</Link>
          <Link href="/collections/rugs" className="hover:text-ink">Rugs</Link>
          <Link href="/contact" className="hover:text-ink">Contact</Link>
        </div>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <Image
          src="/images/story-craft.jpg"
          alt="A quiet moment in the Decoritu studio"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/10" />
      </div>
    </section>
  );
}

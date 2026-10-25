"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
  badge,
}: {
  images: string[];
  name: string;
  badge?: string | null;
}) {
  const gallery = useMemo(() => [...new Set(images.filter(Boolean))], [images]);
  const [active, setActive] = useState(0);
  const [origin, setOrigin] = useState("50% 50%");
  const [zooming, setZooming] = useState(false);
  const current = gallery[active] ?? gallery[0];

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div className="lg:grid lg:grid-cols-[72px_1fr] lg:gap-4">
      <div className="order-2 mt-3 flex gap-2 overflow-x-auto hide-scrollbar lg:order-1 lg:mt-0 lg:flex-col lg:overflow-visible">
        {gallery.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              "relative aspect-[4/5] w-16 shrink-0 overflow-hidden border transition-all sm:w-[70px]",
              active === index ? "border-ink" : "border-transparent opacity-60 hover:opacity-100",
            )}
            aria-label={`View image ${index + 1} of ${gallery.length}`}
            aria-current={active === index}
          >
            <Image src={image} alt="" fill sizes="72px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="order-1 lg:order-2">
        <div
          className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-cream"
          onMouseMove={handleMove}
          onMouseEnter={() => setZooming(true)}
          onMouseLeave={() => {
            setZooming(false);
            setOrigin("50% 50%");
          }}
        >
          {current && (
            <Image
              src={current}
              alt={`${name} — view ${active + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-transform duration-500 ease-out"
              style={{
                transformOrigin: origin,
                transform: zooming ? "scale(1.65)" : "scale(1)",
              }}
            />
          )}
          <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
            {badge && (
              <span className="bg-ivory/95 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-ink backdrop-blur">
                {badge}
              </span>
            )}
          </div>
          <span className="pointer-events-none absolute bottom-4 right-4 hidden items-center gap-1.5 bg-ivory/90 px-2.5 py-1.5 text-[0.58rem] uppercase tracking-[0.12em] text-ink opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 lg:flex">
            <Maximize2 size={11} /> Hover to zoom
          </span>
        </div>
        <p className="mt-2 text-center text-[0.62rem] uppercase tracking-[0.14em] text-muted lg:hidden">
          {active + 1} / {gallery.length}
        </p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Droplets, Sun, Wind } from "lucide-react";
import { ContentHeader } from "@/components/content/ContentHeader";

export const metadata: Metadata = {
  title: "Care guide",
  description: "How to wash, dry and care for cotton, linen, rugs, cushions and brass so they age beautifully.",
  alternates: { canonical: "/care-guide" },
};

const materials = [
  {
    name: "Cotton bedding & dohars",
    note: "Softens with every wash",
    wash: "Machine wash cold on a gentle cycle with a mild liquid detergent. Wash lights and darks separately for the first few washes.",
    dry: "Line dry in shade or tumble on low. Shake out before drying to reduce creasing.",
    care: "Warm iron while slightly damp. Avoid bleach, fabric softener and over-drying, which weaken fibres.",
  },
  {
    name: "Linen",
    note: "Made to crease, meant to relax",
    wash: "Wash cold on a gentle cycle with room to move. Do not overload the machine. Use half the usual detergent.",
    dry: "Hang to dry in shade. Linen dries quickly; remove it while still slightly damp.",
    care: "Iron on medium heat while damp, or embrace the natural texture. Never wring or bleach.",
  },
  {
    name: "Curtains & sheers",
    note: "Dust little and often",
    wash: "Vacuum gently with a brush attachment every few weeks. Wash separately in cold water on a delicate cycle, after removing hooks.",
    dry: "Hang immediately while damp so the weight of the fabric pulls out creases. Avoid direct sun for long periods.",
    care: "Steam rather than iron sheer panels. Test any spot treatment on a hidden hem first.",
  },
  {
    name: "Cushion covers",
    note: "Protect embroidery and trims",
    wash: "Turn inside out and close zips. Hand wash or use a delicate cold cycle, ideally in a mesh bag.",
    dry: "Dry flat in shade, reshaping by hand. Do not tumble dry embellished covers.",
    care: "Iron on the reverse, avoiding embroidery and tassels. Rotate cushions to wear evenly.",
  },
  {
    name: "Rugs",
    note: "A little attention goes far",
    wash: "Vacuum without the beater bar. Rotate the rug every few months so traffic wears evenly. Blot spills immediately; never rub.",
    dry: "Lift damp edges and dry flat with good airflow. Avoid prolonged direct sunlight, which can fade natural dyes.",
    care: "Use a quality rug pad. For deep cleaning, choose a professional rug cleaner familiar with hand-woven pieces.",
  },
  {
    name: "Brass & wood objects",
    note: "Patina is part of the story",
    wash: "Dust with a soft dry cloth. Wipe brass with a damp cloth and dry immediately; polish only if you prefer a bright finish.",
    dry: "Keep wood away from standing water and direct heat. Use coasters under glasses and vases.",
    care: "Refresh wood occasionally with a thin layer of natural wax. Avoid silicone polishes and abrasive cleaners.",
  },
];

export default function CareGuidePage() {
  return (
    <>
      <ContentHeader
        eyebrow="The care edit"
        title="Better with time."
        description="Natural materials are not meant to stay untouched. With a little care, cotton softens, linen relaxes and brass deepens into a warm patina. Here is how we look after ours."
        image="/images/bedding-04.jpg"
        imageAlt="Textured natural bedding in warm light"
      />

      <section className="border-b border-line bg-paper">
        <div className="container-luxe grid gap-8 py-10 sm:grid-cols-3">
          {[
            { icon: Droplets, title: "Wash less", text: "Air between uses. Spot clean where you can. Gentle, less frequent washing keeps fibres strong." },
            { icon: Sun, title: "Dry in shade", text: "Direct sun can fade natural dyes. Shade and airflow are kinder than heat." },
            { icon: Wind, title: "Let it breathe", text: "Store clean and completely dry. Avoid sealed plastic, which traps moisture." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon size={18} className="mt-0.5 shrink-0 text-olive" strokeWidth={1.4} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em]">{item.title}</p>
                <p className="mt-1.5 text-[0.65rem] leading-5 text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="container-luxe py-12 lg:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-muted">By material</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">A practical guide.</h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Always check the care label on your piece first. When in doubt, choose the gentler option
            or ask us before treating a mark.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {materials.map((material, index) => (
            <article key={material.name} className="border border-line bg-paper p-5 sm:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl">{material.name}</h3>
                <span className="text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-olive">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.1em] text-muted">{material.note}</p>
              <dl className="mt-4 space-y-3 border-t border-line pt-4">
                {[
                  ["Wash", material.wash],
                  ["Dry", material.dry],
                  ["Keep", material.care],
                ].map(([label, text]) => (
                  <div key={label}>
                    <dt className="text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-muted">{label}</dt>
                    <dd className="mt-1 text-[0.68rem] leading-5 text-muted">{text}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>

        <div className="mt-12 grid items-center gap-8 border border-line bg-charcoal p-6 text-ivory sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <p className="eyebrow text-ivory/75">A note on small marks</p>
            <h2 className="display mt-3 text-4xl">When something goes wrong.</h2>
            <p className="mt-4 max-w-lg text-xs leading-6 text-ivory/80">
              Blot, do not rub. Test any cleaning method on a hidden area. For set-in marks, delicate
              embroidery or hand-woven rugs, professional cleaning is almost always the safer choice.
              If a piece arrives with a fault, contact us within 48 hours and keep the packaging.
            </p>
            <Link href="/contact" className="btn btn-light mt-6">Ask our care team</Link>
          </div>
          <div className="relative h-[260px] overflow-hidden bg-ivory/10 sm:h-[300px]">
            <Image src="/images/story-craft.jpg" alt="Hand finishing a natural textile" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            <div className="absolute inset-0 bg-charcoal/15" />
          </div>
        </div>
      </div>
    </>
  );
}

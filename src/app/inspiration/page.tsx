import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Inspiration",
  description: "Room notes, palettes and quiet ideas for making a home feel considered — from the Decoritu studio.",
  alternates: { canonical: "/inspiration" },
};

const rooms = [
  {
    id: "bedroom",
    chapter: "Chapter one",
    title: "The bedroom",
    subtitle: "Softness, layered slowly.",
    image: "/images/room-bedroom.jpg",
    secondary: "/images/bedding-07.jpg",
    body: [
      "A bedroom does not need much. Good light, a bed dressed in something that feels lovely against the skin, and a surface beside it for the book you are actually reading.",
      "We like to begin with one colour and let texture do the rest: a washed cotton sheet, a linen dohar, a cushion with a little weight. Leave the floor mostly bare. Let the room stay quiet.",
    ],
    palette: ["#efe7da", "#c8b39a", "#7d7566"],
    paletteNames: ["Warm ivory", "Oat linen", "Soft stone"],
    links: [
      { label: "Shop bedding", href: "/collections/bedding" },
      { label: "Shop dohars", href: "/collections/dohars" },
    ],
  },
  {
    id: "living-room",
    chapter: "Chapter two",
    title: "The living room",
    subtitle: "A room that holds people.",
    image: "/images/room-living.jpg",
    secondary: "/images/cushions-03.jpg",
    body: [
      "The living room is the room that has to work a little harder. It holds the everyday and the occasion: tea, conversation, a film, a late dinner that runs long.",
      "Start with a rug that grounds the seating. Add cushions in a mix of scales rather than a single matched set. A throw left within reach is an invitation. Nothing needs to be precious.",
    ],
    palette: ["#e3d6c4", "#8d6b52", "#4c5040"],
    paletteNames: ["Sand", "Warm clay", "Olive"],
    links: [
      { label: "Shop rugs", href: "/collections/rugs" },
      { label: "Shop cushions", href: "/collections/cushions" },
    ],
  },
  {
    id: "dining-room",
    chapter: "Chapter three",
    title: "The dining room",
    subtitle: "Everyday occasions.",
    image: "/images/room-dining.jpg",
    secondary: "/images/dining-03.jpg",
    body: [
      "A dining table is a generous thing. It asks for very little: a cloth that softens the surface, glassware you actually use, and light that falls low and warm.",
      "We prefer table linen in unbleached cotton and stonewashed tones, layered with simple ceramics. Keep the centre uncluttered. The best centrepiece is usually the people.",
    ],
    palette: ["#f1ece2", "#b8a68f", "#6d5c48"],
    paletteNames: ["Chalk", "Parchment", "Walnut"],
    links: [
      { label: "Shop table linen", href: "/collections/table-linen" },
      { label: "Shop home décor", href: "/collections/home-decor" },
    ],
  },
];

const notes = [
  {
    title: "Begin with light",
    text: "Notice where the morning and evening light falls. Arrange the room around it before choosing a single colour.",
  },
  {
    title: "Choose fewer, better",
    text: "One beautiful object will do more than five ordinary ones. Leave space for each piece to be seen.",
  },
  {
    title: "Let texture lead",
    text: "When the palette is quiet, texture carries the room. Mix matte and sheen, coarse and fine, soft and firm.",
  },
  {
    title: "Live with it first",
    text: "Buy the essentials, then wait. Rooms become interesting when they are allowed to accumulate slowly.",
  },
];

export default function InspirationPage() {
  return (
    <>
      <section className="relative min-h-[68vh] overflow-hidden bg-charcoal text-ivory">
        <Image
          src="/images/hero-living.jpg"
          alt="A warm living room layered with natural textiles"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/45 to-charcoal/10" />
        <div className="container-luxe relative flex min-h-[68vh] flex-col justify-end pb-14 pt-28 lg:pb-20">
          <p className="eyebrow text-ivory/75">The Decoritu approach · Room notes</p>
          <h1 className="display mt-4 max-w-3xl text-[3.6rem] leading-[0.9] sm:text-[5rem] lg:text-[6.4rem]">
            Rooms that exhale.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-ivory/70">
            A home is not a showroom. It is a place that should feel like yours — layered slowly,
            with things you genuinely like to live with.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="container-luxe grid gap-8 py-14 lg:grid-cols-[0.6fr_1.4fr] lg:gap-24 lg:py-20">
          <div>
            <p className="eyebrow text-muted">A note from the studio</p>
            <p className="mt-5 font-display text-5xl leading-[0.95]">A room is a feeling.</p>
          </div>
          <div className="max-w-2xl space-y-4 text-sm leading-7 text-muted">
            <p>
              We are drawn to rooms that feel lived in rather than fussed over. A bed that looks
              slept in. A table with a book left on it. Fabric that creases and softens and remembers
              the shape of the people who use it.
            </p>
            <p>
              The pieces we choose are not loud. They are the sort that become part of the background
              of a life, then quietly turn into the things you would miss. That is the standard we
              hold every product to.
            </p>
          </div>
        </div>
      </section>

      {rooms.map((room, index) => (
        <section key={room.id} id={room.id} className="scroll-mt-24 border-b border-line py-14 lg:py-24">
          <div className="container-luxe">
            <div className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}>
              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                  <Image
                    src={room.image}
                    alt={`${room.title} styled with natural textures`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-3 hidden h-[38%] w-[42%] overflow-hidden border-4 border-ivory bg-cream sm:block lg:-right-8">
                  <Image
                    src={room.secondary}
                    alt={`Detail from ${room.title}`}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="lg:px-4">
                <p className="eyebrow text-muted">{room.chapter}</p>
                <h2 className="display mt-3 text-[3.2rem] leading-[0.9] sm:text-[4rem]">{room.title}</h2>
                <p className="mt-2 font-display text-2xl italic text-olive">{room.subtitle}</p>
                <div className="mt-5 space-y-3 text-sm leading-7 text-muted">
                  {room.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>

                <div className="mt-7">
                  <p className="text-[0.57rem] font-semibold uppercase tracking-[0.11em] text-muted">Palette</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    {room.palette.map((colour, colourIndex) => (
                      <span key={colour} className="flex items-center gap-2 text-[0.6rem] text-muted">
                        <span className="h-4 w-4 rounded-full border border-line" style={{ backgroundColor: colour }} />
                        {room.paletteNames[colourIndex]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  {room.links.map((link) => (
                    <Link key={link.href} href={link.href} className="btn btn-outline">
                      {link.label} <ArrowRight size={13} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="border-b border-line bg-cream/45">
        <div className="container-luxe py-14 lg:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow text-muted">Four quiet rules</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">The considered details.</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {notes.map((note, index) => (
              <div key={note.title} className="border-t border-ink/25 pt-4">
                <span className="text-[0.55rem] font-semibold tracking-[0.12em] text-olive">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-2 font-display text-2xl">{note.title}</p>
                <p className="mt-2 text-[0.68rem] leading-5 text-muted">{note.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoal text-ivory">
        <div className="container-luxe grid items-center gap-10 py-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20 lg:py-20">
          <div>
            <p className="eyebrow text-ivory/75">Made to be lived with</p>
            <h2 className="display mt-4 text-[3rem] leading-[0.92] sm:text-[4rem]">
              Begin with one good thing.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-ivory/80">
              You do not need to furnish a whole room at once. Start with the piece you will touch
              every day — the sheet you sleep on, the rug under your feet, the curtain that softens
              the morning light.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/collections/bestsellers" className="btn btn-light">The bestsellers edit</Link>
              <Link href="/collections/new-arrivals" className="btn btn-ghost-light">New arrivals</Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-ivory/10">
            <Image src="/images/story-craft.jpg" alt="The hands and craft behind Decoritu textiles" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}

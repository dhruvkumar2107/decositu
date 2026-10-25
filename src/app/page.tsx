import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Quote,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getSettings, shippingConfig } from "@/lib/settings";
import {
  getBestsellers,
  getCategories,
  getNewArrivals,
  getProductsByCategorySlug,
} from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryTile } from "@/components/shop/CategoryTile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Price } from "@/components/ui/Price";
import { Stars } from "@/components/ui/Stars";
import { Reveal } from "@/components/ui/Reveal";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { formatPrice } from "@/lib/utils";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, categories, bestsellers, newArrivals, bedding, dohars, cushions, rugs, reviews] =
    await Promise.all([
      getSettings(),
      getCategories(),
      getBestsellers(4),
      getNewArrivals(4),
      getProductsByCategorySlug("bedding", 3),
      getProductsByCategorySlug("dohars", 3),
      getProductsByCategorySlug("cushions", 2),
      getProductsByCategorySlug("rugs", 2),
      prisma.review
        .findMany({
          where: { status: "APPROVED" },
          include: {
            user: { select: { name: true } },
            product: { select: { name: true, slug: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 3,
        })
        .catch(() => []),
    ]);

  const bySlug = new Map(categories.map((category) => [category.slug, category]));
  const shipping = shippingConfig(settings);
  const returnWindow = Number(settings.returnWindow) || 7;

  return (
    <>
      <section className="relative isolate flex min-h-[660px] items-end overflow-hidden bg-charcoal sm:min-h-[720px] lg:h-[calc(100svh-114px)] lg:max-h-[940px]">
        <Image
          src="/images/hero-living.jpg"
          alt="A sunlit contemporary living room with layered natural textures"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-center md:block"
        />
        <Image
          src="/images/hero-mobile.jpg"
          alt="A softly styled bedroom in warm natural tones"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[52%_45%] md:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-charcoal/18 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent to-charcoal/10" />

        <div className="container-luxe relative z-10 pb-12 pt-28 text-ivory sm:pb-16 md:pb-20 lg:pb-24">
          <div className="max-w-[820px]">
            <p className="eyebrow animate-fade-up mb-6 text-ivory/70 [animation-delay:80ms]">
              {settings.heroEyebrow}
            </p>
            <h1 className="display animate-fade-up max-w-[11ch] text-[3.65rem] leading-[0.86] text-ivory [animation-delay:160ms] sm:text-[5rem] md:text-[6.4rem] lg:text-[7.5rem]">
              {settings.heroTitle}
            </h1>
            <p className="animate-fade-up mt-6 max-w-md text-sm leading-7 text-ivory/78 [animation-delay:240ms] md:text-[0.95rem]">
              {settings.heroSubtitle}
            </p>
            <div className="animate-fade-up mt-8 flex flex-col gap-3 [animation-delay:320ms] sm:flex-row sm:items-center">
              <Link href="/collections/bestsellers" className="btn btn-light">
                Shop the collection
                <ArrowRight size={14} strokeWidth={1.6} />
              </Link>
              <Link href="/collections/new-arrivals" className="btn btn-ghost-light">
                Explore new arrivals
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 right-8 hidden items-center gap-3 text-[0.6rem] uppercase tracking-[0.2em] text-ivory/55 xl:flex">
          <span style={{ writingMode: "vertical-rl" }}>Scroll to explore</span>
          <span className="h-14 w-px bg-ivory/35" />
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="container-luxe grid grid-cols-2 divide-x divide-line md:grid-cols-4">
          {[
            { icon: Leaf, title: "Considered fabrics", text: "Natural textures, chosen to age well" },
            { icon: Truck, title: "Complimentary shipping", text: shipping.threshold > 0 ? `On orders over ${formatPrice(shipping.threshold)}` : "On all orders" },
            { icon: RotateCcw, title: `Easy ${returnWindow}-day returns`, text: "On unused, original-condition pieces" },
            { icon: ShieldCheck, title: "Secure checkout", text: "COD and verified online payments" },
          ].map((item, index) => (
            <div
              key={item.title}
              className={`flex items-start gap-3 px-4 py-5 md:px-7 md:py-6 ${index > 1 ? "border-t border-line md:border-t-0" : ""}`}
            >
              <item.icon size={18} strokeWidth={1.35} className="mt-0.5 shrink-0 text-olive" />
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.09em]">{item.title}</p>
                <p className="mt-1 text-[0.68rem] leading-5 text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-luxe py-20 md:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Begin with a room"
            title="Find your room's next chapter."
            description="Layers that work together without trying too hard — for the bedroom, the living room and every corner in between."
            action="Shop all collections"
            actionHref="/collections/bestsellers"
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-12 md:auto-rows-[210px] lg:auto-rows-[228px]">
          {bySlug.get("bedding") && (
            <CategoryTile
              href="/collections/bedding"
              image={bySlug.get("bedding")!.image}
              eyebrow="The bedroom"
              title="Bedding"
              priority
              sizes="(max-width: 768px) 100vw, 58vw"
              className="col-span-2 h-[390px] md:col-span-7 md:row-span-2 md:h-auto"
            />
          )}
          {bySlug.get("curtains") && (
            <CategoryTile
              href="/collections/curtains"
              image={bySlug.get("curtains")!.image}
              eyebrow="Light, softened"
              title="Curtains"
              sizes="(max-width: 768px) 50vw, 36vw"
              className="col-span-1 h-[235px] md:col-span-5 md:h-auto"
            />
          )}
          {bySlug.get("cushions") && (
            <CategoryTile
              href="/collections/cushions"
              image={bySlug.get("cushions")!.image}
              eyebrow="The finishing layer"
              title="Cushions"
              sizes="(max-width: 768px) 50vw, 36vw"
              className="col-span-1 h-[235px] md:col-span-5 md:h-auto"
            />
          )}
          {bySlug.get("dohars") && (
            <CategoryTile
              href="/collections/dohars"
              image={bySlug.get("dohars")!.image}
              eyebrow="Softly layered"
              title="Dohars & quilts"
              sizes="(max-width: 768px) 50vw, 30vw"
              className="col-span-1 h-[215px] md:col-span-4 md:h-auto"
            />
          )}
          {bySlug.get("rugs") && (
            <CategoryTile
              href="/collections/rugs"
              image={bySlug.get("rugs")!.image}
              eyebrow="Underfoot"
              title="Rugs"
              sizes="(max-width: 768px) 50vw, 30vw"
              className="col-span-1 h-[215px] md:col-span-4 md:h-auto"
            />
          )}
          {bySlug.get("sofa-covers") && (
            <CategoryTile
              href="/collections/sofa-covers"
              image={bySlug.get("sofa-covers")!.image}
              eyebrow="Liveable luxury"
              title="Sofa covers"
              sizes="(max-width: 768px) 50vw, 30vw"
              className="col-span-1 h-[215px] md:col-span-4 md:h-auto"
            />
          )}
          {bySlug.get("table-linen") && (
            <CategoryTile
              href="/collections/table-linen"
              image={bySlug.get("table-linen")!.image}
              eyebrow="Gather well"
              title="Table linen"
              sizes="(max-width: 768px) 50vw, 45vw"
              className="col-span-1 h-[215px] md:col-span-6 md:h-auto"
            />
          )}
          {bySlug.get("home-decor") && (
            <CategoryTile
              href="/collections/home-decor"
              image={bySlug.get("home-decor")!.image}
              eyebrow="The final detail"
              title="Décor"
              sizes="(max-width: 768px) 100vw, 45vw"
              className="col-span-2 h-[235px] md:col-span-6 md:h-auto"
            />
          )}
        </div>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <div className="container-luxe">
          <Reveal>
            <SectionHeading
              eyebrow="Most loved"
              title="The pieces you come back to."
              description="Quietly popular, generously used, and made to live with every day."
              action="Shop bestsellers"
              actionHref="/collections/bestsellers"
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-14 md:grid-cols-4 md:gap-x-6">
            {bestsellers.map((product, index) => (
              <Reveal key={product.id} delay={index * 70}>
                <ProductCard product={product} priority={index < 2} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/collections/bestsellers" className="btn btn-outline">
              View all bestsellers
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-luxe py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-7">
            <div className="relative min-h-[430px] overflow-hidden bg-cream sm:min-h-[560px] lg:min-h-[670px]">
              <Image
                src="/images/campaign-bedding.jpg"
                alt="Layered neutral bedding with soft morning light"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
              <div className="absolute bottom-5 left-5 bg-ivory/92 px-5 py-4 backdrop-blur">
                <p className="eyebrow text-muted">The bedding edit</p>
                <p className="mt-1.5 font-display text-2xl">Softness, considered.</p>
              </div>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={100}>
            <p className="eyebrow text-muted">The art of layering</p>
            <h2 className="display mt-5 text-[2.8rem] leading-[0.94] sm:text-[3.6rem] lg:text-[4.2rem]">
              A bed, made for slower mornings.
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-muted">
              Begin with a breathable cotton sheet, add a light dohar, then finish with cushions that
              make you want to linger. Our bedding is chosen for the way it feels after the third wash,
              not just the first.
            </p>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {[
                ["01", "Long-staple cotton and washed linen"],
                ["02", "Handblock prints in small, considered runs"],
                ["03", "Sizes made for Indian beds and everyday living"],
              ].map(([number, text]) => (
                <div key={number} className="flex items-center gap-5 py-4">
                  <span className="font-display text-lg text-clay">{number}</span>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href="/collections/bedding" className="btn btn-primary">
                Shop bedding
                <ArrowRight size={14} />
              </Link>
              {bedding[0] && (
                <Link href={`/products/${bedding[0].slug}`} className="link-underline text-[0.68rem] font-semibold uppercase tracking-[0.14em]">
                  Meet the Noor set
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="container-luxe">
          <Reveal>
            <SectionHeading
              eyebrow="Just arrived"
              title="The new-season edit."
              description="Fresh layers, softer colours and a few pieces made to quietly change a room."
              action="Shop new arrivals"
              actionHref="/collections/new-arrivals"
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-14 md:grid-cols-4 md:gap-x-6">
            {newArrivals.map((product, index) => (
              <Reveal key={product.id} delay={index * 70}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-olive-deep text-ivory">
        <div className="grid lg:grid-cols-2">
          <div className="order-2 flex items-center px-6 py-16 sm:px-12 lg:order-1 lg:px-16 lg:py-24 xl:px-24">
            <div className="max-w-lg">
              <Reveal>
                <p className="eyebrow text-ivory/75">Window styling</p>
                <h2 className="display mt-5 text-[2.9rem] leading-[0.92] text-ivory sm:text-5xl lg:text-[4.3rem]">
                  Let the light in, softly.
                </h2>
                <p className="mt-6 text-sm leading-7 text-ivory/80">
                  A curtain changes more than a window. It changes the hour, the temperature and the
                  feeling of a room. Layer a sheer with a blackout, or let linen filter the afternoon
                  into something gentler.
                </p>
                <div className="mt-8 space-y-3 border-y border-ivory/15 py-6">
                  {["Sheers for filtered daylight", "Blackouts for cooler, quieter bedrooms", "Linen drapes with a beautiful, weighted fall"].map((item) => (
                    <p key={item} className="flex items-start gap-3 text-sm text-ivory/75">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-clay" />
                      {item}
                    </p>
                  ))}
                </div>
                <Link href="/collections/curtains" className="btn btn-light mt-8">
                  Explore curtains
                  <ArrowRight size={14} />
                </Link>
              </Reveal>
            </div>
          </div>
          <Reveal className="order-1 lg:order-2" delay={100}>
            <div className="relative min-h-[420px] sm:min-h-[560px] lg:h-full lg:min-h-[720px]">
              <Image
                src="/images/campaign-curtains.jpg"
                alt="Soft curtains diffusing natural light in a quiet room"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-olive-deep/30 to-transparent" />
              <div className="absolute bottom-6 right-6 bg-ivory/92 px-5 py-3 text-ink backdrop-blur">
                <p className="eyebrow text-muted">Aria sheers</p>
                <p className="mt-1 text-sm">Light, held gently.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-luxe py-20 md:py-28">
        <div className="overflow-hidden bg-sand/55">
          <div className="grid lg:grid-cols-2">
            <Reveal>
              <div className="relative min-h-[420px] sm:min-h-[540px] lg:h-full lg:min-h-[660px]">
                <Image
                  src="/images/dohar-02.jpg"
                  alt="A lightweight quilt layered on a bed"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal className="flex items-center px-6 py-12 sm:px-12 lg:px-14" delay={100}>
              <div className="w-full max-w-lg">
                <p className="eyebrow text-muted">Dohars, quilts & blankets</p>
                <h2 className="display mt-4 text-[2.8rem] leading-[0.94] sm:text-[3.5rem]">
                  The right weight for every night.
                </h2>
                <p className="mt-5 text-sm leading-7 text-muted">
                  Light cotton for humid evenings. A little more fill for the cooler months. Layer,
                  fold and leave one at the end of the bed for whoever needs it.
                </p>
                <div className="mt-7 divide-y divide-ink/10">
                  {dohars.slice(0, 3).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group flex items-center gap-4 py-4"
                    >
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-cream">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium transition-colors group-hover:text-olive">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-[0.68rem] text-muted">{product.sizes.join(" · ")}</p>
                      </div>
                      <Price price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
                    </Link>
                  ))}
                </div>
                <Link href="/collections/dohars" className="link-underline mt-6 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.15em]">
                  Shop dohars & quilts <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <div className="container-luxe">
          <Reveal>
            <SectionHeading
              eyebrow="The finishing layers"
              title="Small things, quietly transformative."
              description="A cushion, a rug, a softer place to sit. The pieces that make a room feel finished — without ever feeling done."
              action="Shop all décor"
              actionHref="/collections/home-decor"
            />
          </Reveal>
          <div className="mt-12 grid gap-3 md:grid-cols-12 md:auto-rows-[280px]">
            {bySlug.get("cushions") && (
              <Reveal className="md:col-span-4">
                <Link href="/collections/cushions" className="group relative block h-[300px] overflow-hidden bg-cream md:h-full">
                  <Image src="/images/cushions-01.jpg" alt="Textured cushion covers" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 to-transparent" />
                  <div className="absolute bottom-5 left-5 text-ivory">
                    <p className="eyebrow text-ivory/60">Soft accents</p>
                    <p className="mt-1 font-display text-3xl">Cushions</p>
                  </div>
                </Link>
              </Reveal>
            )}
            {bySlug.get("rugs") && (
              <Reveal className="md:col-span-5" delay={70}>
                <Link href="/collections/rugs" className="group relative block h-[300px] overflow-hidden bg-cream md:h-full">
                  <Image src="/images/rugs-01.jpg" alt="Handwoven natural rug" fill sizes="(max-width: 768px) 100vw, 42vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 to-transparent" />
                  <div className="absolute bottom-5 left-5 text-ivory">
                    <p className="eyebrow text-ivory/60">Underfoot</p>
                    <p className="mt-1 font-display text-3xl">Rugs</p>
                  </div>
                </Link>
              </Reveal>
            )}
            <Reveal className="md:col-span-3" delay={140}>
              <Link href="/collections/sofa-covers" className="group relative block h-[300px] overflow-hidden bg-cream md:h-full">
                <Image src="/images/sofa-01.jpg" alt="A soft neutral sofa cover" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 to-transparent" />
                <div className="absolute bottom-5 left-5 text-ivory">
                  <p className="eyebrow text-ivory/60">Easy layering</p>
                  <p className="mt-1 font-display text-3xl">Sofa covers</p>
                </div>
              </Link>
            </Reveal>
          </div>
          <div className="mt-8 grid gap-8 border-t border-line pt-8 md:grid-cols-3">
            {cushions.slice(0, 1).concat(rugs.slice(0, 2)).map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="group flex items-center justify-between gap-6">
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.14em] text-muted">{product.categoryName}</p>
                  <p className="mt-1 font-display text-xl transition-colors group-hover:text-olive">{product.name}</p>
                </div>
                <ArrowUpRight size={16} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe py-20 md:py-28">
        <Reveal>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-muted">A room is a feeling</p>
              <h2 className="display mt-4 text-[2.8rem] leading-[0.94] sm:text-5xl lg:text-[4.2rem]">
                Spaces to live in, slowly.
              </h2>
            </div>
            <Link href="/inspiration" className="link-underline inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.15em]">
              Room inspiration <ArrowRight size={14} />
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
          {[
            {
              title: "The bedroom",
              text: "Quiet layers, softer light and nothing that asks for attention.",
              image: "/images/room-bedroom.jpg",
              href: "/inspiration#bedroom",
            },
            {
              title: "The living room",
              text: "A place for long conversations, low light and an extra cushion.",
              image: "/images/room-living.jpg",
              href: "/inspiration#living-room",
            },
            {
              title: "The dining room",
              text: "Warm textures and a table that is always ready for one more.",
              image: "/images/room-dining.jpg",
              href: "/inspiration#dining-room",
            },
          ].map((room, index) => (
            <Reveal key={room.title} delay={index * 80}>
              <Link href={room.href} className="group block">
                <div className="image-hover relative aspect-[4/5] overflow-hidden bg-cream">
                  <Image
                    src={room.image}
                    alt={room.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                    <p className="font-display text-3xl">{room.title}</p>
                    <p className="mt-1 text-[0.7rem] uppercase tracking-[0.16em] text-ivory/60">
                      Explore the edit <ArrowRight size={12} className="ml-1 inline" />
                    </p>
                  </div>
                </div>
                <p className="mt-4 max-w-sm text-sm leading-6 text-muted">{room.text}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative flex min-h-[500px] items-center overflow-hidden bg-charcoal md:min-h-[600px]">
        <Image
          src="/images/campaign-festive.jpg"
          alt="A warm, celebratory living room styled with natural textures"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/45" />
        <div className="container-luxe relative z-10 py-20 text-center text-ivory">
          <Reveal>
            <p className="eyebrow text-ivory/65">The festive edit</p>
            <h2 className="display mx-auto mt-5 max-w-3xl text-[3.2rem] leading-[0.9] text-ivory sm:text-6xl md:text-[5rem]">
              Gather in a warmer kind of light.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-ivory/75">
              Considered pieces for hosting, gifting and making the everyday feel a little more special.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/collections/home-decor" className="btn btn-light">
                Shop the festive edit
              </Link>
              <Link href="/collections/bestsellers" className="btn btn-ghost-light">
                Explore bestsellers
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line bg-ivory py-20 md:py-24">
        <div className="container-luxe grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          <Reveal>
            <p className="eyebrow text-muted">Loved in real homes</p>
            <h2 className="display mt-5 text-[2.8rem] leading-[0.94] sm:text-[3.7rem]">
              Words worth keeping.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted">
              Every review published here comes from a signed-in Decoritu account and is moderated
              before it appears. No invented ratings, no borrowed praise.
            </p>
            <Link href="/collections/bestsellers" className="btn btn-outline mt-7">
              Find something to love
              <ArrowRight size={14} />
            </Link>
          </Reveal>
          <Reveal delay={100}>
            {reviews.length ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {reviews.map((review) => (
                  <article key={review.id} className="border border-line bg-paper p-5">
                    <Quote size={18} className="text-clay" />
                    <p className="mt-4 text-sm leading-6">“{review.body}”</p>
                    <div className="mt-5 border-t border-line pt-4">
                      <Stars rating={review.rating} size={11} />
                      <p className="mt-2 text-[0.7rem] font-medium">{review.user.name}</p>
                      <Link href={`/products/${review.product.slug}`} className="text-[0.63rem] text-muted hover:text-olive">
                        {review.product.name}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="border border-line bg-paper p-8 sm:p-10">
                <Quote size={28} className="text-clay/70" />
                <p className="mt-6 font-display text-3xl leading-[1.08] sm:text-[2.4rem]">
                  “Our review wall opens with our first customers.”
                </p>
                <p className="mt-4 max-w-lg text-sm leading-7 text-muted">
                  We would rather show nothing than show something invented. If you have shopped with
                  us, your verified review can be the first to appear.
                </p>
                <div className="mt-6 flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">
                  <ShieldCheck size={15} className="text-olive" /> Verified purchases only
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="container-luxe grid items-stretch gap-0 bg-paper lg:grid-cols-2">
          <div className="relative min-h-[360px] lg:min-h-[560px]">
            <Image
              src="/images/story-craft.jpg"
              alt="Natural textures and considered details in a Decoritu home"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-center px-6 py-12 sm:px-12 lg:px-16">
            <div className="w-full max-w-md">
              <p className="eyebrow text-muted">The Decoritu letter</p>
              <h2 className="display mt-4 text-[2.7rem] leading-[0.94] sm:text-[3.4rem]">
                A slower kind of inbox.
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted">
                New collections, thoughtful room notes and the occasional story from the people who
                make our pieces. Sent with care, never too often.
              </p>
              <div className="mt-7">
                <NewsletterForm />
              </div>
              <p className="mt-5 text-[0.65rem] leading-5 text-muted">
                By joining, you agree to our privacy policy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-luxe py-16 md:py-20">
        <Reveal>
          <div className="grid gap-8 border-y border-line py-10 md:grid-cols-[1.2fr_2fr] md:items-center">
            <p className="display max-w-md text-[2rem] leading-[1.05] sm:text-[2.5rem]">
              We believe a home should feel collected, not decorated.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                ["Considered sourcing", "Natural materials and small runs, chosen for how they age."],
                ["Made for living", "Beautiful enough to keep, practical enough to use every day."],
                ["Honest by design", "Clear pricing, real availability and no invented promises."],
              ].map(([title, text]) => (
                <div key={title}>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em]">{title}</p>
                  <p className="mt-2 text-[0.72rem] leading-6 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

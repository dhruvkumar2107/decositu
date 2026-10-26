import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCollection } from "@/lib/products";
import { getSettings, shippingConfig } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";
import { CatalogClient } from "@/components/shop/CatalogClient";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return { title: "Collection not found" };

  return {
    title: collection.title,
    description: collection.description,
    openGraph: {
      title: `${collection.title} | Decoritu`,
      description: collection.description,
      images: [{ url: collection.image }],
    },
    alternates: { canonical: `/collections/${collection.slug}` },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [collection, settings] = await Promise.all([getCollection(slug), getSettings()]);
  if (!collection) notFound();
  const shipping = shippingConfig(settings);

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="container-luxe py-10 md:py-14">
          <nav className="flex flex-wrap items-center gap-2 text-[0.63rem] uppercase tracking-[0.12em] text-muted" aria-label="Breadcrumb">
            <Breadcrumb items={[
              { label: "Home", href: "/" },
              { label: collection.isCategory ? "Collections" : "The edit", href: collection.isCategory ? "/collections" : "/" },
              { label: collection.title, href: `/collections/${collection.slug}`, current: true },
            ]} />
          </nav>

          <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
            <div>
              <p className="eyebrow text-muted">
                {collection.isCategory ? "The collection" : "Curated by Decoritu"}
              </p>
              <h1 className="display mt-4 max-w-3xl text-[3.2rem] leading-[0.9] sm:text-[4.2rem] lg:text-[5.2rem]">
                {collection.title}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted">{collection.description}</p>
              <p className="mt-5 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted">
                {collection.products.length} {collection.products.length === 1 ? "piece" : "pieces"}
                <span className="mx-2 text-line">|</span>
                {shipping.threshold > 0
                  ? `Complimentary shipping over ${formatPrice(shipping.threshold)}`
                  : "Complimentary shipping on all orders"}
              </p>
            </div>
            <div className="relative hidden h-[180px] overflow-hidden bg-cream sm:block lg:h-[230px]">
              <Image
                src={collection.image}
                alt={collection.title}
                fill
                priority
                sizes="(max-width: 1024px) 35vw, 34vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/10" />
            </div>
          </div>
        </div>
      </section>

      <CatalogClient products={collection.products} />
    </>
  );
}

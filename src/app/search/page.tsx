import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { searchProducts, getBestsellers } from "@/lib/products";
import { CatalogClient } from "@/components/shop/CatalogClient";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Decoritu collection of bedding, curtains, dohars, cushions and home décor.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const products = query ? await searchProducts(query, 32) : [];
  const bestsellers = query ? [] : await getBestsellers(4);

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="container-luxe py-12 md:py-16">
          <Breadcrumb items={[
  { label: "Home", href: "/" },
  { label: `Search for “${query}”`, href: `/search?q=${query}`, current: true },
]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow text-muted">Search the edit</p>
              <h1 className="display mt-4 text-[3rem] leading-[0.92] sm:text-[4.2rem]">
                {query ? <>Results for “{query}”</> : "What are you looking for?"}
              </h1>
              {query && (
                <p className="mt-4 text-sm text-muted">
                  {products.length} {products.length === 1 ? "piece" : "pieces"} found
                </p>
              )}
            </div>
            <form action="/search" className="flex items-center gap-3 border-b border-ink/35 pb-3">
              <Search size={20} className="shrink-0 text-olive" />
              <input
                name="q"
                defaultValue={query}
                placeholder="Search for a material, room or piece"
                className="min-w-0 flex-1 bg-transparent font-display text-2xl outline-none placeholder:text-muted/55"
                aria-label="Search products"
              />
              <button type="submit" className="text-[0.66rem] font-semibold uppercase tracking-[0.15em]">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {query ? (
        products.length ? (
          <CatalogClient products={products} />
        ) : (
          <section className="container-luxe py-20 text-center md:py-28">
            <p className="font-display text-5xl">Nothing found for “{query}”.</p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">
              Try a broader term like “cotton”, “curtains” or “cushions”. Or begin with our most-loved pieces.
            </p>
            <Link href="/collections/bestsellers" className="btn btn-primary mt-7">
              Shop bestsellers
            </Link>
          </section>
        )
      ) : (
        <section className="container-luxe py-16 md:py-24">
          <SectionHeading
            eyebrow="A good place to begin"
            title="The most-loved pieces."
            description="Search by name, material or room — or start with the pieces our customers return to."
            action="Shop all bestsellers"
            actionHref="/collections/bestsellers"
          />
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

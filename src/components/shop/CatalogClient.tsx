"use client";

import { useMemo, useState } from "react";
import { Check, SlidersHorizontal, X } from "lucide-react";
import type { ProductCardData } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { cn, swatchColor } from "@/lib/utils";

const priceRanges = [
  { id: "under-2000", label: "Under ₹2,000", min: 0, max: 199999 },
  { id: "2000-4000", label: "₹2,000 – ₹4,000", min: 200000, max: 400000 },
  { id: "4000-8000", label: "₹4,000 – ₹8,000", min: 400001, max: 800000 },
  { id: "above-8000", label: "₹8,000 & above", min: 800001, max: Number.MAX_SAFE_INTEGER },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Popularity" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Rating" },
];

export function CatalogClient({ products }: { products: ProductCardData[] }) {
  const [prices, setPrices] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [ratedOnly, setRatedOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const allColors = useMemo(
    () => [...new Set(products.flatMap((product) => product.colors))].sort(),
    [products],
  );
  const allSizes = useMemo(
    () => [...new Set(products.flatMap((product) => product.sizes))].sort(),
    [products],
  );

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      if (prices.length) {
        const selected = priceRanges.filter((range) => prices.includes(range.id));
        if (!selected.some((range) => product.price >= range.min && product.price <= range.max)) {
          return false;
        }
      }
      if (colors.length && !product.colors.some((color) => colors.includes(color))) return false;
      if (sizes.length && !product.sizes.some((size) => sizes.includes(size))) return false;
      if (inStockOnly && !product.inStock) return false;
      if (ratedOnly && (product.rating ?? 0) < 4) return false;
      return true;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === "popular") return Number(b.isBestseller) - Number(a.isBestseller);
      return products.indexOf(a) - products.indexOf(b);
    });
  }, [products, prices, colors, sizes, inStockOnly, ratedOnly, sort]);

  const activeCount = prices.length + colors.length + sizes.length + Number(inStockOnly) + Number(ratedOnly);

  function toggle(value: string, current: string[], setter: (items: string[]) => void) {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function clearAll() {
    setPrices([]);
    setColors([]);
    setSizes([]);
    setInStockOnly(false);
    setRatedOnly(false);
  }

  const filterContent = (
    <div className="space-y-8">
      <FilterGroup title="Price">
        <div className="space-y-3">
          {priceRanges.map((range) => (
            <CheckRow
              key={range.id}
              checked={prices.includes(range.id)}
              onChange={() => toggle(range.id, prices, setPrices)}
              label={range.label}
            />
          ))}
        </div>
      </FilterGroup>

      {allColors.length > 0 && (
        <FilterGroup title="Colour">
          <div className="flex flex-wrap gap-2.5">
            {allColors.map((color) => {
              const active = colors.includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggle(color, colors, setColors)}
                  aria-pressed={active}
                  title={color}
                  className={cn(
                    "group relative flex h-8 w-8 items-center justify-center rounded-full border transition-all",
                    active ? "border-olive ring-1 ring-olive ring-offset-2" : "border-line hover:border-olive",
                  )}
                >
                  <span
                    className="h-5 w-5 rounded-full border border-ink/10"
                    style={{ backgroundColor: swatchColor(color) }}
                  />
                  {active && <Check size={10} className="absolute text-ink mix-blend-difference" />}
                </button>
              );
            })}
          </div>
          {colors.length > 0 && (
            <p className="mt-2 text-[0.68rem] text-muted">{colors.join(", ")}</p>
          )}
        </FilterGroup>
      )}

      {allSizes.length > 0 && (
        <FilterGroup title="Size">
          <div className="flex flex-wrap gap-2">
            {allSizes.map((size) => {
              const active = sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggle(size, sizes, setSizes)}
                  aria-pressed={active}
                  className={cn(
                    "border px-3 py-1.5 text-[0.68rem] transition-colors",
                    active
                      ? "border-charcoal bg-charcoal text-ivory"
                      : "border-line hover:border-charcoal",
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Availability">
        <div className="space-y-3">
          <CheckRow checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} label="In stock only" />
          <CheckRow checked={ratedOnly} onChange={() => setRatedOnly(!ratedOnly)} label="Rated 4★ & above" />
        </div>
      </FilterGroup>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-[0.67rem] font-semibold uppercase tracking-[0.13em] underline underline-offset-4"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container-luxe pb-20 pt-10 md:pb-28 md:pt-14">
      <div className="grid gap-10 lg:grid-cols-[230px_1fr] lg:gap-12 xl:grid-cols-[250px_1fr] xl:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto pr-2 hide-scrollbar">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <p className="text-[0.67rem] font-semibold uppercase tracking-[0.16em]">Refine</p>
              <span className="text-[0.65rem] text-muted">{activeCount ? `${activeCount} on` : "All"}</span>
            </div>
            <div className="pt-7">{filterContent}</div>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="inline-flex items-center gap-2 border border-line px-3.5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] lg:hidden"
              >
                <SlidersHorizontal size={14} />
                Filter {activeCount > 0 && `(${activeCount})`}
              </button>
              <p className="text-[0.7rem] text-muted">
                {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
              </p>
            </div>
            <label className="flex items-center gap-2 text-[0.68rem] text-muted">
              <span className="hidden sm:inline">Sort by</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="border-0 bg-transparent py-1 text-[0.7rem] font-medium text-ink focus:outline-none"
                aria-label="Sort products"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {filtered.length > 0 ? (
            <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center border border-line px-6 text-center">
              <p className="font-display text-4xl">Nothing quite matches.</p>
              <p className="mt-3 max-w-sm text-sm text-muted">
                Try removing a filter, or explore the full collection.
              </p>
              {activeCount > 0 && (
                <button type="button" onClick={clearAll} className="btn btn-outline mt-6">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/35 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
          />
          <div className="animate-slide-in absolute inset-y-0 right-0 flex w-[92%] max-w-[380px] flex-col bg-ivory shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
                Refine {activeCount > 0 && `(${activeCount})`}
              </p>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{filterContent}</div>
            <div className="border-t border-line p-4">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="btn btn-primary w-full"
              >
                Show {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-[0.64rem] font-semibold uppercase tracking-[0.16em]">{title}</h3>
      {children}
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[0.76rem] text-ink/80">
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
          checked ? "border-olive bg-olive text-ivory" : "border-line bg-transparent",
        )}
      >
        {checked && <Check size={10} strokeWidth={2.5} />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}

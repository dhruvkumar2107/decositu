"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ProductCardData } from "@/lib/products";

const collectionSuggestions = [
  { label: "Bedsheets", href: "/collections/bedding" },
  { label: "Curtains", href: "/collections/curtains" },
  { label: "Dohars", href: "/collections/dohars" },
  { label: "Cushions", href: "/collections/cushions" },
  { label: "Rugs", href: "/collections/rugs" },
  { label: "Home decor", href: "/collections/home-decor-2025" },
  { label: "Bags", href: "/collections/bags" },
];

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [suggestions, setSuggestions] = useState<(typeof collectionSuggestions)[0][]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products?q=${encodeURIComponent(
          trimmed,
        )}&limit=6`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search failed");
        const data = (await response.json()) as { products: ProductCardData[] };
        setResults(data.products);
        setSuggestions([]);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setResults([]);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions(collectionSuggestions.filter((s) =>
        s.label.toLowerCase().includes(trimmed.toLowerCase()),
      ));
      return;
    }
    setSuggestions([]);
  }, [query, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Search Decoritu">
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/35 backdrop-blur-[3px]"
        onClick={onClose}
        aria-label="Close search"
      />
      <div className="animate-fade-up relative max-h-[92vh] overflow-y-auto border-b border-line bg-ivory shadow-2xl">
        <div className="container-luxe py-6 md:py-9">
          <div className="flex items-center justify-between gap-4">
            <span className="eyebrow text-muted">Search the collection</span>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:bg-charcoal hover:text-ivory"
              aria-label="Close search"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          <form action="/search" className="mt-5 flex items-center gap-4 border-b border-ink/30 pb-4 md:mt-8">
            <Search size={26} strokeWidth={1.2} className="shrink-0 text-olive" />
            <input
              ref={inputRef}
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for curtains, cushions, quiet luxury…"
              className="min-w-0 flex-1 bg-transparent font-display text-2xl outline-none placeholder:text-muted/60 sm:text-3xl md:text-4xl"
              autoComplete="off"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="hidden items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] sm:inline-flex"
            >
              Search <ArrowRight size={14} />
            </button>
          </form>

          {query.trim().length < 2 ? (
            <div className="mt-8 grid gap-10 md:grid-cols-[1fr_1.2fr]">
              <div>
                <p className="eyebrow mb-4 text-muted">Popular right now</p>
                <div className="flex flex-wrap gap-2.5">
                  {suggestions.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="border border-line px-4 py-2 text-xs transition-colors hover:border-olive hover:bg-olive hover:text-ivory"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden border-l border-line pl-10 md:block">
                <p className="display text-2xl">Looking for something made for your room?</p>
                <p className="mt-2 max-w-sm text-sm text-muted">
                  Browse the full edit, or begin with a room and let the layers follow.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-7">
              {loading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index}>
                      <div className="skeleton aspect-[4/5]" />
                      <div className="skeleton mt-3 h-3 w-4/5" />
                      <div className="skeleton mt-2 h-3 w-2/5" />
                    </div>
                  ))}
                </div>
              ) : results.length ? (
                <div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="group block"
                      >
                        <div className="image-hover relative aspect-[4/5] bg-cream">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                            className="object-cover"
                          />
                        </div>
                        <p className="mt-3 text-[0.7rem] uppercase tracking-[0.1em] text-muted">
                          {product.categoryName}
                        </p>
                        <p className="mt-1 text-sm leading-tight transition-colors group-hover:text-olive">
                          {product.name}
                        </p>
                        <p className="mt-1 text-sm font-medium">{formatPrice(product.price)}</p>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-7 border-t border-line pt-5 text-center">
                    <Link
                      href={`/search?q=${encodeURIComponent(query.trim())}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em]"
                    >
                      View all results <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="font-display text-3xl">No pieces found for “{query.trim()}”</p>
                  <p className="mx-auto mt-3 max-w-md text-sm text-muted">
                    Try a material, a room or a category. Our full edit is always a good place to begin.
                  </p>
                  <Link href="/collections/bestsellers" onClick={onClose} className="btn btn-outline mt-6">
                    Explore bestsellers
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductDetailData } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

type RecentProduct = {
  slug: string;
  name: string;
  image: string;
  price: number;
  categoryName: string;
};

const KEY = "decoritu-recently-viewed-v1";

export function RecentlyViewed({ product }: { product: ProductDetailData }) {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    const current: RecentProduct = {
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      categoryName: product.categoryName,
    };

    let previous: RecentProduct[] = [];
    try {
      const stored = window.localStorage.getItem(KEY);
      const parsed = stored ? (JSON.parse(stored) as RecentProduct[]) : [];
      if (Array.isArray(parsed)) previous = parsed;
    } catch {
      previous = [];
    }

    setItems(previous.filter((item) => item.slug !== product.slug).slice(0, 4));
    window.localStorage.setItem(
      KEY,
      JSON.stringify([current, ...previous.filter((item) => item.slug !== product.slug)].slice(0, 8)),
    );
  }, [product]);

  if (!items.length) return null;

  return (
    <section className="border-t border-line py-14 md:py-20">
      <div className="container-luxe">
        <p className="eyebrow text-muted">Recently viewed</p>
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
          {items.map((item) => (
            <Link key={item.slug} href={`/products/${item.slug}`} className="group flex gap-3">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-cream">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="min-w-0 py-1">
                <p className="text-[0.56rem] uppercase tracking-[0.12em] text-muted">{item.categoryName}</p>
                <p className="mt-1 text-xs font-medium leading-5 transition-colors group-hover:text-olive">
                  {item.name}
                </p>
                <p className="mt-1 text-xs">{formatPrice(item.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

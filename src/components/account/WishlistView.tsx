"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Trash2 } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { Price } from "@/components/ui/Price";

export function WishlistView() {
  const { wishlist, removeWishlist, isReady } = useStore();

  if (!isReady) {
    return (
      <div className="container-luxe py-16 md:py-24">
        <div className="skeleton h-12 w-64" />
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="space-y-3">
              <div className="skeleton aspect-[4/5]" />
              <div className="skeleton h-4 w-2/3" />
              <div className="skeleton h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="container-luxe py-20 text-center md:py-32">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-line">
          <Heart size={28} strokeWidth={1.2} className="text-olive" />
        </div>
        <p className="eyebrow mt-6 text-muted">Saved pieces</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">A place for what catches your eye.</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-muted">
          Save pieces as you browse and return when the room feels ready.
        </p>
        <Link href="/collections/bestsellers" className="btn btn-primary mt-8">
          Browse the collection <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-12 md:py-20">
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-muted">Saved pieces</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Your quiet shortlist.</h1>
        <p className="mt-3 text-xs text-muted">
          {wishlist.length} {wishlist.length === 1 ? "piece" : "pieces"} saved on this device
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
        {wishlist.map((item) => (
          <article key={item.productId} className="group">
            <Link href={`/products/${item.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-cream">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  removeWishlist(item.productId);
                }}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-ivory/90 backdrop-blur transition-colors hover:bg-wine hover:text-ivory"
                aria-label={`Remove ${item.name} from saved pieces`}
              >
                <Trash2 size={14} />
              </button>
            </Link>
            <div className="mt-3">
              <p className="text-[0.57rem] uppercase tracking-[0.12em] text-muted">{item.categoryName}</p>
              <Link href={`/products/${item.slug}`}>
                <h2 className="mt-1 font-display text-xl leading-tight transition-colors hover:text-olive">
                  {item.name}
                </h2>
              </Link>
              <div className="mt-1.5">
                <Price price={item.price} compareAtPrice={item.compareAtPrice} />
              </div>
              <Link
                href={`/products/${item.slug}`}
                className="mt-3 inline-flex text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-olive"
              >
                Choose options
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
        <p className="text-xs text-muted">Saved pieces are stored on this device.</p>
        <Link href="/collections/bestsellers" className="btn btn-outline">
          Continue browsing
        </Link>
      </div>
    </div>
  );
}

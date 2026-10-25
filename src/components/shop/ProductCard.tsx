"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { ProductCardData } from "@/lib/products";
import { useStore } from "@/components/providers/StoreProvider";
import { cn, swatchColor } from "@/lib/utils";
import { Price } from "@/components/ui/Price";
import { Stars } from "@/components/ui/Stars";

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductCardData;
  priority?: boolean;
}) {
  const { addItem, toggleWishlist, isWishlisted, isReady } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const saved = isReady && isWishlisted(product.id);
  const hasSecondImage = Boolean(product.hoverImage && product.hoverImage !== product.image);

  function handleAdd() {
    if (!product.defaultVariant || !product.inStock) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.defaultVariant.image,
      variantId: product.defaultVariant.id,
      variantLabel: `${product.defaultVariant.size} / ${product.defaultVariant.color}`,
      size: product.defaultVariant.size,
      color: product.defaultVariant.color,
      sku: product.defaultVariant.sku,
      unitPrice: product.defaultVariant.price,
      compareAtPrice: product.compareAtPrice,
      stock: product.defaultVariant.stock,
    });
  }

  function handleWishlist() {
    toggleWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      categoryName: product.categoryName,
    });
  }

  return (
    <article
      className="group"
      onMouseEnter={() => hasSecondImage && setIsHovered(true)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <Link href={`/products/${product.slug}`} aria-label={product.name} className="block h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700 ease-out group-hover:scale-[1.025]",
              hasSecondImage && isHovered && "group-hover:opacity-0",
            )}
          />
          {hasSecondImage && isHovered && (
            <Image
              src={product.hoverImage}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.025] group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.discount > 0 && (
            <span className="bg-clay px-2.5 py-1 text-[0.57rem] font-semibold uppercase tracking-[0.12em] text-ivory">
              {product.discount}% off
            </span>
          )}
          {product.badge && (
            <span className="bg-ivory/95 px-2.5 py-1 text-[0.57rem] font-semibold uppercase tracking-[0.12em] text-ink backdrop-blur">
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-charcoal/90 px-2.5 py-1 text-[0.57rem] font-semibold uppercase tracking-[0.12em] text-ivory">
              Sold out
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={saved ? `Remove ${product.name} from saved pieces` : `Save ${product.name}`}
          aria-pressed={saved}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-ink backdrop-blur transition-all hover:bg-ivory hover:text-clay"
        >
          <Heart size={16} strokeWidth={1.5} className={cn(saved && "fill-clay text-clay")} />
        </button>

        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-sm:translate-y-0 max-sm:opacity-100">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock || !product.defaultVariant}
            className="flex w-full items-center justify-center gap-2 bg-ivory/95 px-4 py-3 text-[0.63rem] font-semibold uppercase tracking-[0.14em] backdrop-blur transition-colors hover:bg-charcoal hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={14} />
            {product.inStock ? "Quick add" : "Sold out"}
          </button>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.15em] text-muted">
              {product.categoryName}
            </p>
            <h3 className="mt-1.5 text-[0.92rem] font-medium leading-snug">
              <Link href={`/products/${product.slug}`} className="transition-colors hover:text-olive">
                {product.name}
              </Link>
            </h3>
          </div>
          {product.colors.length > 0 && (
            <div className="mt-1 flex shrink-0 items-center gap-1">
              {product.colors.slice(0, 3).map((color) => (
                <span
                  key={color}
                  title={color}
                  className="h-2.5 w-2.5 rounded-full border border-ink/10"
                  style={{ backgroundColor: swatchColor(color) }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <Price price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
          {product.rating !== null && (
            <Stars rating={product.rating} count={product.reviewCount} size={11} />
          )}
        </div>
      </div>
    </article>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import { formatPrice, bulkDiscount } from "@/lib/utils";

const BULK_DISCOUNT_THRESHOLD = 299900;
const BULK_DISCOUNT_AMOUNT = 20000;

export function CartView({
  shippingThreshold,
  shippingFee,
}: {
  shippingThreshold: number;
  shippingFee: number;
}) {
  const { cart, subtotal, updateQuantity, removeItem, isReady, cartCount } = useStore();

  if (!isReady) {
    return (
      <div className="container-luxe py-16 md:py-24">
        <div className="skeleton h-12 w-52" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_0.7fr]">
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="skeleton h-40" />
            ))}
          </div>
          <div className="skeleton h-72" />
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="container-luxe py-20 text-center md:py-32">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-line">
          <ShoppingBag size={28} strokeWidth={1.2} className="text-olive" />
        </div>
        <p className="eyebrow mt-6 text-muted">Your bag</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">A little room for something beautiful.</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-muted">
          Your bag is empty for now. Begin with a soft layer, a quieter curtain or a piece that makes
          you pause.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/collections/bestsellers" className="btn btn-primary">
            Shop bestsellers
          </Link>
          <Link href="/collections/new-arrivals" className="btn btn-outline">
            Explore new arrivals
          </Link>
        </div>
      </div>
    );
  }

  const remaining = Math.max(shippingThreshold - subtotal, 0);
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);
  const shipping = subtotal >= shippingThreshold ? 0 : shippingFee;
  const bulkDiscountAmount = bulkDiscount(subtotal, BULK_DISCOUNT_THRESHOLD, BULK_DISCOUNT_AMOUNT);

  return (
    <div className="container-luxe py-12 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-muted">Your bag</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">Your considered edit.</h1>
        </div>
        <p className="text-[0.7rem] uppercase tracking-[0.12em] text-muted">
          {cartCount} {cartCount === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <div className="mt-8 border border-line bg-paper p-4 sm:p-5">
<div className="flex items-center gap-3 text-xs">
          <Truck size={16} className="shrink-0 text-olive" />
          {remaining > 0 ? (
            <p>
              Add <span className="font-semibold">{formatPrice(remaining)}</span> for complimentary shipping.
            </p>
          ) : (
            <p>You've unlocked complimentary shipping.</p>
          )}
        </div>
        {bulkDiscountAmount > 0 && (
          <div className="mt-3 text-right text-xs text-muted">
            Save <span className="font-semibold">{formatPrice(BULK_DISCOUNT_AMOUNT)}</span> on orders over {formatPrice(BULK_DISCOUNT_THRESHOLD)}
          </div>
        )}
        <div className="mt-3 h-1 overflow-hidden bg-line">
          <div className="h-full bg-olive transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.5fr_0.72fr] lg:gap-16">
        <div className="divide-y divide-line border-y border-line">
          {cart.map((item) => (
            <article key={item.variantId} className="flex gap-4 py-5 sm:gap-6">
              <Link href={`/products/${item.slug}`} className="relative h-32 w-24 shrink-0 overflow-hidden bg-cream sm:h-40 sm:w-32">
                <Image src={item.image} alt={item.name} fill sizes="128px" className="object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/products/${item.slug}`} className="font-display text-xl leading-tight hover:text-olive sm:text-2xl">
                      {item.name}
                    </Link>
                    <p className="mt-1.5 text-[0.68rem] text-muted">
                      {item.size} · {item.color}
                    </p>
                    <p className="mt-0.5 text-[0.62rem] text-muted">SKU: {item.sku}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="p-1 text-muted transition-colors hover:text-wine"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={16} strokeWidth={1.4} />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                  <div className="flex h-9 w-[105px] items-center justify-between border border-line">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="flex h-full w-8 items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="flex h-full w-8 items-center justify-center disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="border border-line bg-paper p-6 sm:p-7 lg:sticky lg:top-[105px]">
          <h2 className="font-display text-2xl">Order summary</h2>
          <div className="mt-5 space-y-3 border-b border-line pb-5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted">Shipping</span>
              <span>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted">Taxes</span>
              <span className="text-muted">Included</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-5">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.13em]">Estimated total</span>
            <span className="font-display text-3xl">{formatPrice(subtotal + shipping)}</span>
          </div>
          <Link href="/checkout" className="btn btn-primary w-full">
            Proceed to checkout <ArrowRight size={14} />
          </Link>
          <p className="mt-3 text-center text-[0.62rem] leading-5 text-muted">
            Shipping and coupons are confirmed at checkout.
          </p>
          <div className="mt-5 border-t border-line pt-4">
            <p className="flex items-center gap-2 text-[0.65rem] text-muted">
              <ShieldCheck size={14} className="text-olive" /> Secure checkout · COD available
            </p>
          </div>
          <Link href="/collections/bestsellers" className="link-underline mt-5 inline-flex text-[0.65rem] font-semibold uppercase tracking-[0.12em]">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

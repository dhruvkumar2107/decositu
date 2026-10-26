"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import type { ProductDetailData } from "@/lib/products";
import { useStore } from "@/components/providers/StoreProvider";
import { Price } from "@/components/ui/Price";
import { Stars } from "@/components/ui/Stars";
import { cn, swatchColor } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

export function PurchasePanel({
  product,
  shipping,
  returnWindow,
  reviewAnchor = true,
}: {
  product: ProductDetailData;
  shipping: { threshold: number; fee: number };
  returnWindow: number;
  reviewAnchor?: boolean;
}) {
  const router = useRouter();
  const { addItem, toggleWishlist, isWishlisted, isReady } = useStore();
  const initial = product.variants.find((variant) => variant.stock > 0) ?? product.variants[0];
  const [size, setSize] = useState(initial?.size ?? "");
  const [color, setColor] = useState(initial?.color ?? "");
  const [quantity, setQuantity] = useState(1);
  const [shared, setShared] = useState(false);
  const [panelQuantity, setPanelQuantity] = useState(initial?.panelQuantity ?? "1");
  const [hangingPattern, setHangingPattern] = useState(initial?.hangingPattern ?? "");
  const [liningType, setLiningType] = useState(initial?.liningType ?? "");

  const sizes = useMemo(() => [...new Set(product.variants.map((variant) => variant.size))], [product.variants]);
  const colors = useMemo(() => [...new Set(product.variants.map((variant) => variant.color))], [product.variants]);
  const selectedVariant = product.variants.find(
    (variant) => variant.size === size && variant.color === color,
  );
  const saved = isReady && isWishlisted(product.id);

  useEffect(() => {
    setQuantity((current) => Math.min(Math.max(current, 1), selectedVariant?.stock || 1));
  }, [selectedVariant?.id, selectedVariant?.stock]);

  useEffect(() => {
    if (selectedVariant) {
      setPanelQuantity(selectedVariant.panelQuantity ?? "1");
      setHangingPattern(selectedVariant.hangingPattern ?? "");
      setLiningType(selectedVariant.liningType ?? "");
    }
  }, [selectedVariant?.id]);

  function chooseSize(nextSize: string) {
    const candidate =
      product.variants.find(
        (variant) => variant.size === nextSize && variant.color === color && variant.stock > 0,
      ) ??
      product.variants.find(
        (variant) => variant.size === nextSize && variant.stock > 0,
      ) ??
      product.variants.find((variant) => variant.size === nextSize);
    setSize(nextSize);
    if (candidate) setColor(candidate.color);
    setQuantity(1);
    if (candidate) {
      setPanelQuantity(candidate.panelQuantity ?? "1");
      setHangingPattern(candidate.hangingPattern ?? "");
      setLiningType(candidate.liningType ?? "");
    }
  }

  function chooseColor(nextColor: string) {
    const candidate =
      product.variants.find(
        (variant) => variant.color === nextColor && variant.size === size && variant.stock > 0,
      ) ??
      product.variants.find(
        (variant) => variant.color === nextColor && variant.stock > 0,
      ) ??
      product.variants.find((variant) => variant.color === nextColor);
    setColor(nextColor);
    if (candidate) setSize(candidate.size);
    setQuantity(1);
    if (candidate) {
      setPanelQuantity(candidate.panelQuantity ?? "1");
      setHangingPattern(candidate.hangingPattern ?? "");
      setLiningType(candidate.liningType ?? "");
    }
  }

  function cartItem() {
    if (!selectedVariant || selectedVariant.stock <= 0) return null;
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: selectedVariant.image,
      variantId: selectedVariant.id,
      variantLabel: `${selectedVariant.size} / ${selectedVariant.color}${selectedVariant.panelQuantity ? ` · ${selectedVariant.panelQuantity} panel${Number(selectedVariant.panelQuantity) > 1 ? "s" : ""}` : ""}${selectedVariant.hangingPattern ? ` · ${selectedVariant.hangingPattern}` : ""}${selectedVariant.liningType ? ` · ${selectedVariant.liningType} lining` : ""}`,
      size: selectedVariant.size,
      color: selectedVariant.color,
      sku: selectedVariant.sku,
      unitPrice: selectedVariant.price,
      compareAtPrice: selectedVariant.compareAtPrice,
      stock: selectedVariant.stock,
    };
  }

  function handleAdd() {
    const item = cartItem();
    if (!item) {
      toast.error("Please select an available size and colour.");
      return;
    }
    addItem(item, quantity);
  }

  function handleBuyNow() {
    const item = cartItem();
    if (!item) {
      toast.error("Please select an available size and colour.");
      return;
    }
    addItem(item, quantity);
    router.push("/checkout");
  }

  function handleWishlist() {
    toggleWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      categoryName: product.categoryName,
    });
  }

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        toast.success("Link copied");
        window.setTimeout(() => setShared(false), 1800);
      }
    } catch {
      return;
    }
  }

  return (
    <div className="lg:sticky lg:top-[100px]">
      <h1 className="display mt-3 text-[2.7rem] leading-[0.95] sm:text-[3.4rem]">{product.name}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        {product.rating !== null ? (
          <a href="#reviews" className="flex items-center gap-2">
            <Stars rating={product.rating} count={product.reviewCount} showValue />
          </a>
        ) : (
          <a href="#reviews" className="text-[0.7rem] text-muted underline decoration-line underline-offset-4 hover:text-ink">
            Be the first to review
          </a>
        )}
      </div>

      {product.isNew && (
        <span className="border border-olive/35 px-2 py-0.5 text-[0.57rem] font-semibold uppercase tracking-[0.12em] text-olive">
          New arrival
        </span>
      )}

      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <Price
          price={selectedVariant?.price ?? product.price}
          compareAtPrice={selectedVariant?.compareAtPrice ?? product.compareAtPrice}
          size="lg"
        />
        {product.discount > 0 && (
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-clay">
            Save {product.discount}%
          </span>
        )}
      </div>
      <p className="mt-1 text-[0.65rem] text-muted">Inclusive of all taxes</p>

      {product.story && (
        <p className="mt-5 border-l border-clay/50 pl-4 font-display text-lg leading-snug text-ink/75">
          {product.story}
        </p>
      )}

      <p className="mt-5 text-sm leading-7 text-muted">{product.description}</p>

      <div className="mt-6 border-t border-line pt-6">
        <div className="flex items-center justify-between">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em]">Size</p>
          <span className="text-[0.64rem] text-muted">Select a size</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((option) => {
            const available = product.variants.some(
              (variant) => variant.size === option && variant.stock > 0,
            );
            const sizeClass = cn(
              "border px-4 py-2.5 text-[0.72rem] transition-colors",
              size === option
                ? "border-charcoal bg-charcoal text-ivory"
                : "border-line hover:border-charcoal",
              !available && "text-muted line-through",
            );
            return (
              <button
                key={option}
                type="button"
                onClick={() => chooseSize(option)}
                aria-pressed={size === option}
                className={sizeClass}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em]">Colour</p>
          <span className="text-[0.64rem] text-muted">{color}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {colors.map((option) => {
            const available = product.variants.some(
              (variant) => variant.color === option && variant.stock > 0,
            );
            const colorClass = cn(
              "flex items-center gap-2 border px-3 py-2 text-[0.68rem] transition-colors",
              color === option
                ? "border-charcoal bg-cream"
                : "border-line hover:border-charcoal",
              !available && "opacity-55",
            );
            return (
              <button
                key={option}
                type="button"
                onClick={() => chooseColor(option)}
                aria-pressed={color === option}
                className={colorClass}
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border border-ink/15"
                  style={{ backgroundColor: swatchColor(option) }}
                />
                {option}
                {color === option && <Check size={11} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em]">Panel quantity</p>
          <span className="text-[0.64rem] text-muted">Select number of panels</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["1", "2", "3"].map((panel) => {
            const available = product.variants.some(
              (variant) => variant.panelQuantity === panel && variant.stock > 0,
            );
            const panelClass = panelQuantity === panel
              ? "border rounded-full px-3 py-2 text-[0.62rem] transition-colors border-charcoal bg-charcoal text-ivory"
              : "border rounded-full px-3 py-2 text-[0.62rem] transition-colors border-line hover:border-charcoal";
            const finalPanelClass = !available ? "opacity-55" : "";
            return (
              <button
                key={panel}
                type="button"
                onClick={() => setPanelQuantity(panel)}
                className={cn(
                  panelQuantity === panel
                    ? "border rounded-full px-3 py-2 text-[0.62rem] transition-colors"
                    : "border rounded-full px-3 py-2 text-[0.62rem] transition-colors border-line hover:border-charcoal",
                  !available && "opacity-55",
                )}
                aria-pressed={panelQuantity === panel}
              >
                {panel} panel
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em]">Hanging pattern</p>
          <span className="text-[0.64rem] text-muted">{hangingPattern || "Select hanging pattern"}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["eyelets", "rod-pocket", "track"].map((pattern) => {
            const available = product.variants.some(
              (variant) => variant.hangingPattern === pattern && variant.stock > 0,
            );
            const patternClass = hangingPattern === pattern
              ? "border rounded-full px-3 py-2 text-[0.62rem] transition-colors border-charcoal bg-charcoal text-ivory"
              : "border rounded-full px-3 py-2 text-[0.62rem] transition-colors border-line hover:border-charcoal";
            return (
              <button
                key={pattern}
                type="button"
                onClick={() => setHangingPattern(pattern)}
                className={cn(
                  hangingPattern === pattern
                    ? "border rounded-full px-3 py-2 text-[0.62rem] transition-colors"
                    : "border rounded-full px-3 py-2 text-[0.62rem] transition-colors border-line hover:border-charcoal",
                  !available && "opacity-55",
                )}
                aria-pressed={hangingPattern === pattern}
              >
                {pattern === "eyelets"
                  ? "Eyelets"
                  : pattern === "rod-pocket"
                  ? "Rod pocket"
                  : "Track"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em]">Lining type</p>
          <span className="text-[0.64rem] text-muted">{liningType || "Select lining type"}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["standard", "blackout", "thermal"].map((lining) => {
            const available = product.variants.some(
              (variant) => variant.liningType === lining && variant.stock > 0,
            );
            const liningClass = liningType === lining
              ? "border rounded-full px-3 py-2 text-[0.62rem] transition-colors border-charcoal bg-charcoal text-ivory"
              : "border rounded-full px-3 py-2 text-[0.62rem] transition-colors border-line hover:border-charcoal";
            return (
              <button
                key={lining}
                type="button"
                onClick={() => setLiningType(lining)}
                className={cn(
                  liningType === lining
                    ? "border rounded-full px-3 py-2 text-[0.62rem] transition-colors"
                    : "border rounded-full px-3 py-2 text-[0.62rem] transition-colors border-line hover:border-charcoal",
                  !available && "opacity-55",
                )}
                aria-pressed={liningType === lining}
              >
                {lining === "standard"
                  ? "Standard"
                  : lining === "blackout"
                  ? "Blackout"
                  : "Thermal"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-[0.65rem]">
        <p className="text-muted">
          SKU: <span className="text-ink">{selectedVariant?.sku ?? product.sku}</span>
        </p>
        {selectedVariant && selectedVariant.stock > 0 ? (
          <p className={cn(selectedVariant.stock <= 5 ? "text-clay" : "text-olive")}>
            {selectedVariant.stock <= 5 ? `Only ${selectedVariant.stock} left` : "In stock"}
          </p>
        ) : (
          <p className="text-wine">Sold out</p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex h-[50px] w-[128px] shrink-0 items-center justify-between border border-line">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1}
            className="flex h-full w-10 items-center justify-center disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="text-sm" aria-live="polite">{quantity}</span>
          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                Math.min(current + 1, selectedVariant?.stock || 1),
              )
            }
            disabled={!selectedVariant || quantity >= selectedVariant.stock}
            className="flex h-full w-10 items-center justify-center disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedVariant || selectedVariant.stock <= 0}
          className="btn btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag size={15} />
          Add to bag
        </button>
        <button
          type="button"
          onClick={handleWishlist}
          className="flex h-[50px] w-[50px] shrink-0 items-center justify-center border border-line transition-colors hover:border-charcoal"
          aria-label={saved ? "Remove from saved pieces" : "Save for later"}
          aria-pressed={saved}
        >
          <Heart size={17} className={cn(saved && "fill-clay text-clay")} strokeWidth={1.4} />
        </button>
      </div>
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={!selectedVariant || selectedVariant.stock <= 0}
        className="btn btn-outline mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        Buy it now
      </button>

      <div className="mt-6 grid grid-cols-3 border-y border-line py-4 text-center">
        {[
          { icon: Truck, label: "Complimentary shipping", sub: shipping.threshold > 0 ? `Over ${formatPrice(shipping.threshold)}` : "On all orders" },
          { icon: RotateCcw, label: `${returnWindow}-day returns`, sub: "Original condition" },
          { icon: ShieldCheck, label: "Secure checkout", sub: "COD available" },
        ].map((item) => (
          <div key={item.label} className="border-r border-line px-2 last:border-r-0">
            <item.icon size={16} strokeWidth={1.3} className="mx-auto text-olive" />
            <p className="mt-2 text-[0.59rem] font-semibold uppercase tracking-[0.06em]">{item.label}</p>
            <p className="mt-0.5 text-[0.56rem] text-muted">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 divide-y divide-line border-y border-line">
        <Accordion title="Details & materials" defaultOpen>
          <p><span className="font-medium text-ink">Material:</span> {product.material}</p>
          <p className="mt-2"><span className="font-medium text-ink">Dimensions:</span> {product.dimensions}</p>
        </Accordion>
        <Accordion title="Care instructions">
          <p>{product.care}</p>
        </Accordion>
        <Accordion title="Shipping & returns">
          <p>
            {shipping.threshold > 0
              ? `Shipping is complimentary on orders over ${formatPrice(shipping.threshold)}; otherwise it is calculated at checkout.`
              : "Shipping is complimentary on all orders."}{" "}
            Delivery timelines are confirmed by the carrier after dispatch.
          </p>
          <p className="mt-2">
            Unused, unwashed pieces in original packaging may be returned within {returnWindow} days
            of delivery. Final-sale pieces are not eligible. Contact customer care to begin a return.
          </p>
        </Accordion>
      </div>

      <div className="mt-5 flex items-center justify-between text-[0.67rem] text-muted">
        <span className="inline-flex items-center gap-2">
          <ShieldCheck size={14} className="text-olive" /> Verified secure payments
        </span>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 transition-colors hover:text-ink"
        >
          {shared ? <Check size={14} /> : <Share2 size={14} />} Share
        </button>
      </div>

      {reviewAnchor && (
        <a href="#reviews" className="sr-only">
          Read reviews
        </a>
      )}
    </div>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[0.68rem] font-semibold uppercase tracking-[0.13em]">
        {title}
        <ChevronDown size={15} className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-5 text-xs leading-6 text-muted">{children}</div>
    </details>
  );
}
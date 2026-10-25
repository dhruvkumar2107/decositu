import { cn, formatPrice } from "@/lib/utils";

export function Price({
  price,
  compareAtPrice,
  className,
  size = "default",
}: {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
  size?: "sm" | "default" | "lg";
}) {
  const showCompare = Boolean(compareAtPrice && compareAtPrice > price);
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-medium tracking-tight",
          size === "sm" && "text-[0.82rem]",
          size === "default" && "text-[0.95rem]",
          size === "lg" && "text-xl",
        )}
      >
        {formatPrice(price)}
      </span>
      {showCompare && (
        <span
          className={cn(
            "text-muted line-through",
            size === "sm" && "text-[0.72rem]",
            size === "default" && "text-[0.8rem]",
            size === "lg" && "text-sm",
          )}
        >
          {formatPrice(compareAtPrice as number)}
        </span>
      )}
    </span>
  );
}

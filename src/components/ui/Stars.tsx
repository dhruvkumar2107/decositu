import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  rating,
  count,
  size = 13,
  className,
  showValue = false,
}: {
  rating: number | null;
  count?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
}) {
  if (rating === null) return null;

  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-label={`${rating} out of 5 stars`}>
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            width={size}
            height={size}
            strokeWidth={1.4}
            className={cn(value <= Math.round(rating) ? "fill-clay text-clay" : "fill-transparent text-line")}
          />
        ))}
      </span>
      {showValue && <span className="text-[0.72rem] text-muted">{rating.toFixed(1)}</span>}
      {typeof count === "number" && (
        <span className="text-[0.68rem] text-muted">({count})</span>
      )}
    </span>
  );
}

export function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          className="p-0.5"
        >
          <Star
            size={24}
            strokeWidth={1.3}
            className={cn(star <= value ? "fill-clay text-clay" : "fill-transparent text-line")}
          />
        </button>
      ))}
    </div>
  );
}

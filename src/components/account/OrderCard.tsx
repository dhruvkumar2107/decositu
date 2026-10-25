import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";
import { orderStatusClass, orderStatusLabel } from "@/lib/orders";
import { cn } from "@/lib/utils";

export type OrderCardData = {
  orderNumber: string;
  createdAt: Date | string;
  status: string;
  total: number;
  items: { id: string; productName: string; image: string; quantity: number }[];
  itemCount: number;
};

export function OrderCard({ order }: { order: OrderCardData }) {
  const preview = order.items.slice(0, 3);
  return (
    <article className="border border-line bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.64rem] text-muted">
          <span>
            Order <span className="font-semibold text-ink">{order.orderNumber}</span>
          </span>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <span
          className={cn(
            "border px-2 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.1em]",
            orderStatusClass(order.status),
          )}
        >
          {orderStatusLabel(order.status)}
        </span>
      </div>
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {preview.map((item) => (
              <div
                key={item.id}
                className="relative h-16 w-13 overflow-hidden border-2 border-paper bg-cream"
              >
                <Image src={item.image} alt={item.productName} fill sizes="52px" className="object-cover" />
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium">
              {order.itemCount} {order.itemCount === 1 ? "piece" : "pieces"}
            </p>
            <p className="mt-1 text-sm font-semibold">{formatPrice(order.total)}</p>
          </div>
        </div>
        <Link
          href={`/account/orders/${order.orderNumber}`}
          className="inline-flex items-center gap-2 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-olive hover:text-ink"
        >
          View order <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
}

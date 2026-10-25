import type { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { OrderCard } from "@/components/account/OrderCard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Orders",
};

const filters = [
  { key: "all", label: "All orders" },
  { key: "active", label: "In progress" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

function statusWhere(filter: string) {
  if (filter === "active") {
    return { in: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"] };
  }
  if (filter === "delivered") return { in: ["DELIVERED", "RETURNED"] };
  if (filter === "cancelled") return { in: ["CANCELLED", "REFUNDED"] };
  return undefined;
}

export default async function AccountOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser("/account/orders");
  const params = await searchParams;
  const activeFilter = filters.some((filter) => filter.key === params.status)
    ? (params.status as string)
    : "all";
  const statuses = statusWhere(activeFilter);

  const orders = await prisma.order.findMany({
    where: { userId: user.id, ...(statuses ? { status: statuses } : {}) },
    orderBy: { createdAt: "desc" },
    include: {
      items: { select: { id: true, productName: true, image: true, quantity: true } },
    },
  });

  return (
    <div>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-muted">Your orders</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Order history.</h1>
        <p className="mt-3 text-sm text-muted">
          Follow every piece from our studio to your home.
        </p>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {filters.map((filter) => (
          <Link
            key={filter.key}
            href={filter.key === "all" ? "/account/orders" : `/account/orders?status=${filter.key}`}
            className={cn(
              "shrink-0 border px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] transition-colors",
              activeFilter === filter.key
                ? "border-charcoal bg-charcoal text-ivory"
                : "border-line text-muted hover:border-charcoal hover:text-ink",
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {orders.length ? (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={{
                orderNumber: order.orderNumber,
                createdAt: order.createdAt,
                status: order.status,
                total: order.total,
                items: order.items,
                itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-dashed border-line px-6 py-16 text-center">
          <Package size={26} strokeWidth={1.2} className="mx-auto text-muted" />
          <p className="mt-4 font-display text-3xl">
            {activeFilter === "all" ? "No orders yet." : "Nothing in this view."}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-muted">
            {activeFilter === "all"
              ? "Your first Decoritu order will appear here with delivery updates."
              : "Try another filter to see the rest of your order history."}
          </p>
          <Link href="/collections/bestsellers" className="btn btn-outline mt-6">
            Explore the collection
          </Link>
        </div>
      )}
    </div>
  );
}

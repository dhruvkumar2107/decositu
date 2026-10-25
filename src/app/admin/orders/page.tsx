import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime, formatPrice } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  orderStatusClass,
  orderStatusLabel,
  paymentStatusLabel,
} from "@/lib/orders";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders" };

const PAGE_SIZE = 25;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireAdmin("/admin/orders");
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const status = typeof params.status === "string" ? params.status : "";
  const requestedPage = Math.max(Number(params.page) || 1, 1);

  const where = {
    ...(status && ORDER_STATUS_LABELS[status] ? { status } : {}),
    ...(query
      ? {
          OR: [
            { orderNumber: { contains: query } },
            { email: { contains: query } },
            { fullName: { contains: query } },
          ],
        }
      : {}),
  };

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (requestedPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { _count: { select: { items: true } } },
    }),
  ]);
  const pages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const page = Math.min(requestedPage, pages);

  function pageHref(nextPage: number) {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (status) search.set("status", status);
    if (nextPage > 1) search.set("page", String(nextPage));
    return `/admin/orders${search.size ? `?${search.toString()}` : ""}`;
  }

  return (
    <div>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-muted">Operations</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Orders.</h1>
        <p className="mt-3 text-xs text-muted">{total} {total === 1 ? "order" : "orders"} in this view</p>
      </div>

      <form method="get" className="mt-5 flex flex-wrap items-end gap-2.5">
        <div className="min-w-[220px] flex-1">
          <label htmlFor="order-search" className="label">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="order-search"
              name="q"
              defaultValue={query}
              placeholder="Order number, name or email"
              className="input pl-9"
            />
          </div>
        </div>
        <div>
          <label htmlFor="order-status" className="label">Status</label>
          <select id="order-status" name="status" defaultValue={status} className="select min-w-[170px]">
            <option value="">All statuses</option>
            {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-outline h-[46px] min-h-[46px]">Filter</button>
        {(query || status) && (
          <Link href="/admin/orders" className="text-[0.62rem] font-semibold uppercase tracking-[0.09em] text-muted hover:text-ink">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-5 overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[780px] text-left text-xs">
          <thead className="border-b border-line bg-cream/60 text-[0.56rem] uppercase tracking-[0.1em] text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Items</th>
              <th className="px-4 py-3 font-semibold">Payment</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.length ? (
              orders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-cream/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-semibold text-ink hover:text-olive">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p>{order.fullName}</p>
                    <p className="text-[0.6rem] text-muted">{order.email}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[0.65rem] text-muted">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">{order._count.items}</td>
                  <td className="px-4 py-3 text-[0.65rem] text-muted">
                    {order.paymentMethod} · {paymentStatusLabel(order.paymentStatus)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("border px-2 py-1 text-[0.52rem] font-semibold uppercase tracking-[0.07em]", orderStatusClass(order.status))}>
                      {orderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted">
                  No orders match this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-[0.65rem]">
          <span className="text-muted">Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link href={pageHref(page - 1)} className="border border-line px-3 py-2 hover:bg-cream">Previous</Link>}
            {page < pages && <Link href={pageHref(page + 1)} className="border border-line px-3 py-2 hover:bg-cream">Next</Link>}
          </div>
        </div>
      )}
    </div>
  );
}

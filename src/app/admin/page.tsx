import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeIndianRupee, Boxes, ClipboardList, MessageSquare, Star, TriangleAlert } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatDateTime, formatPrice } from "@/lib/utils";
import { orderStatusClass, orderStatusLabel } from "@/lib/orders";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminDashboardPage() {
  await requireAdmin("/admin");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    revenue,
    orderCount,
    pendingOrders,
    customerCount,
    productCount,
    lowStock,
    pendingReviews,
    newMessages,
    subscriberCount,
    recentOrders,
    recentRevenue,
    topProducts,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
      _sum: { total: true },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED", "PROCESSING"] } } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { active: true } }),
    prisma.productVariant.findMany({
      where: { active: true, stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      take: 6,
      include: { product: { select: { name: true, slug: true } } },
    }),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.newsletterSubscriber.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        orderNumber: true,
        fullName: true,
        total: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
      select: { createdAt: true, total: true },
    }),
    prisma.orderItem.groupBy({
      by: ["productName"],
      where: { order: { status: { notIn: ["CANCELLED", "REFUNDED"] } } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    const total = recentRevenue
      .filter((order) => order.createdAt.toISOString().slice(0, 10) === key)
      .reduce((sum, order) => sum + order.total, 0);
    return { date, total };
  });
  const dayMax = Math.max(...days.map((day) => day.total), 1);

  const stats = [
    {
      label: "Order value",
      value: formatPrice(revenue._sum.total ?? 0),
      detail: `${orderCount} orders all time`,
      icon: BadgeIndianRupee,
      href: "/admin/orders",
    },
    {
      label: "Needs attention",
      value: String(pendingOrders),
      detail: "Pending, confirmed or preparing",
      icon: ClipboardList,
      href: "/admin/orders?status=active",
    },
    {
      label: "Active products",
      value: String(productCount),
      detail: `${customerCount} customer accounts`,
      icon: Boxes,
      href: "/admin/products",
    },
    {
      label: "Moderation",
      value: String(pendingReviews),
      detail: `${newMessages} new messages`,
      icon: Star,
      href: "/admin/reviews",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-muted">Decoritu admin</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">The studio desk.</h1>
          <p className="mt-3 text-xs text-muted">
            {formatDate(new Date())} · {subscriberCount} newsletter subscribers
          </p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add a product
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="border border-line bg-paper p-4 transition-colors hover:border-ink/30">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted">{stat.label}</p>
              <stat.icon size={14} className="text-olive" />
            </div>
            <p className="mt-3 font-display text-3xl leading-none">{stat.value}</p>
            <p className="mt-2 text-[0.58rem] text-muted">{stat.detail}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="border border-line bg-paper p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-muted">Last 7 days</p>
              <h2 className="mt-1 font-display text-2xl">Order value</h2>
            </div>
            <p className="text-sm font-semibold">{formatPrice(days.reduce((sum, day) => sum + day.total, 0))}</p>
          </div>
          <div className="mt-8 flex h-32 items-end gap-2">
            {days.map((day) => (
              <div key={day.date.toISOString()} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-24 w-full items-end">
                  <div
                    className="w-full bg-olive/75 transition-all"
                    style={{ height: `${Math.max((day.total / dayMax) * 100, day.total ? 4 : 1)}%` }}
                    title={`${formatDate(day.date)}: ${formatPrice(day.total)}`}
                  />
                </div>
                <span className="text-[0.52rem] uppercase tracking-[0.05em] text-muted">
                  {new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(day.date)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-line bg-paper p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-muted">Top sellers</p>
              <h2 className="mt-1 font-display text-2xl">By units</h2>
            </div>
            <Link href="/admin/products" className="text-muted hover:text-ink" aria-label="View products">
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {topProducts.length ? (
              topProducts.map((product, index) => (
                <div key={product.productName} className="flex items-start gap-3 border-b border-line/70 pb-2.5 last:border-0">
                  <span className="font-display text-xl text-muted">{String(index + 1).padStart(2, "0")}</span>
                  <p className="flex-1 text-xs leading-5">{product.productName}</p>
                  <span className="text-[0.65rem] font-semibold">{product._sum.quantity ?? 0}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted">Sales will appear here after the first order.</p>
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="border border-line bg-paper">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <h2 className="font-display text-2xl">Recent orders</h2>
            <Link href="/admin/orders" className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-olive">
              View all
            </Link>
          </div>
          <div className="divide-y divide-line">
            {recentOrders.length ? (
              recentOrders.map((order) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-cream/40">
                  <div className="min-w-[130px] flex-1">
                    <p className="text-xs font-semibold">{order.orderNumber}</p>
                    <p className="mt-0.5 text-[0.6rem] text-muted">{order.fullName}</p>
                  </div>
                  <span className={cn("border px-2 py-1 text-[0.52rem] font-semibold uppercase tracking-[0.08em]", orderStatusClass(order.status))}>
                    {orderStatusLabel(order.status)}
                  </span>
                  <div className="text-right">
                    <p className="text-xs font-semibold">{formatPrice(order.total)}</p>
                    <p className="mt-0.5 text-[0.55rem] text-muted">{formatDateTime(order.createdAt)}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="px-5 py-8 text-xs text-muted">No orders yet.</p>
            )}
          </div>
        </section>

        <div className="space-y-4">
          <section className="border border-line bg-paper p-5">
            <div className="flex items-center gap-2">
              <TriangleAlert size={15} className="text-clay" />
              <h2 className="font-display text-2xl">Low stock</h2>
            </div>
            <div className="mt-3 space-y-2.5">
              {lowStock.length ? (
                lowStock.map((variant) => (
                  <div key={variant.id} className="flex items-start justify-between gap-3 border-b border-line/70 pb-2.5 last:border-0">
                    <div>
                      <p className="text-[0.68rem] font-medium leading-5">{variant.product.name}</p>
                      <p className="text-[0.56rem] text-muted">{variant.size} · {variant.color}</p>
                    </div>
                    <span className={cn("text-[0.65rem] font-semibold", variant.stock === 0 ? "text-wine" : "text-clay")}>
                      {variant.stock}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted">All active variants have healthy stock.</p>
              )}
            </div>
          </section>

          <section className="border border-line bg-paper p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={15} className="text-olive" />
                <h2 className="font-display text-2xl">Inbox</h2>
              </div>
              <span className="text-xs font-semibold">{newMessages}</span>
            </div>
            <p className="mt-2 text-[0.65rem] leading-5 text-muted">New customer messages waiting for a reply.</p>
            <div className="mt-3 flex gap-4 text-[0.6rem] font-semibold uppercase tracking-[0.09em]">
              <Link href="/admin/messages" className="text-olive">Open inbox</Link>
              <Link href="/admin/reviews" className="text-muted hover:text-olive">{pendingReviews} reviews</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

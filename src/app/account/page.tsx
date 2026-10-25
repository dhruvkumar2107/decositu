import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Package, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { OrderCard } from "@/components/account/OrderCard";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function AccountPage() {
  const user = await requireUser("/account");

  const [orders, orderCount, inProgress, reviewCount, address, addressCount, account] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { items: { select: { id: true, productName: true, image: true, quantity: true } } },
    }),
    prisma.order.count({ where: { userId: user.id } }),
    prisma.order.count({
      where: { userId: user.id, status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED"] } },
    }),
    prisma.review.count({ where: { userId: user.id } }),
    prisma.address.findFirst({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    }),
    prisma.address.count({ where: { userId: user.id } }),
    prisma.user.findUnique({ where: { id: user.id }, select: { createdAt: true } }),
  ]);

  return (
    <div>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-muted">Your account</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Hello, {user.name.split(" ")[0]}.</h1>
        <p className="mt-3 text-sm text-muted">
          A quiet place for your orders, addresses and saved pieces.
        </p>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total orders", value: orderCount, href: "/account/orders", icon: Package },
          { label: "In progress", value: inProgress, href: "/account/orders", icon: Package },
          { label: "Saved addresses", value: addressCount, href: "/account/addresses", icon: MapPin },
          { label: "Your reviews", value: reviewCount, href: "/account/reviews", icon: Star },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="border border-line bg-paper p-4 transition-colors hover:border-ink/30">
            <stat.icon size={15} strokeWidth={1.4} className="text-olive" />
            <p className="mt-3 font-display text-3xl leading-none">{stat.value}</p>
            <p className="mt-1.5 text-[0.6rem] uppercase tracking-[0.09em] text-muted">{stat.label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-muted">Order history</p>
            <h2 className="mt-2 font-display text-3xl">Recent orders</h2>
          </div>
          {orders.length > 0 && (
            <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.12em] text-olive hover:text-ink">
              View all <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {orders.length ? (
          <div className="mt-5 space-y-3">
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
          <div className="mt-5 border border-dashed border-line px-6 py-12 text-center">
            <Package size={24} strokeWidth={1.2} className="mx-auto text-muted" />
            <p className="mt-3 font-display text-2xl">No orders yet.</p>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-muted">
              When you place an order, its progress and details will live here.
            </p>
            <Link href="/collections/bestsellers" className="btn btn-outline mt-5">
              Explore bestsellers
            </Link>
          </div>
        )}
      </section>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <section className="border border-line bg-paper p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="eyebrow text-muted">Default address</p>
            <Link href="/account/addresses" className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-olive">
              Manage
            </Link>
          </div>
          {address ? (
            <div className="mt-4 text-sm leading-6">
              <p className="font-medium">{address.fullName}</p>
              <p className="text-muted">{address.line1}</p>
              {address.line2 && <p className="text-muted">{address.line2}</p>}
              <p className="text-muted">
                {address.city}, {address.state} {address.pincode}
              </p>
              <p className="mt-2 text-[0.68rem] text-muted">{address.phone}</p>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-3 text-sm text-muted">
              <MapPin size={17} className="mt-0.5 shrink-0 text-olive" />
              <div>
                <p>No saved address yet.</p>
                <Link href="/account/addresses" className="mt-2 inline-flex text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-olive">
                  Add an address
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="border border-line bg-paper p-5">
          <p className="eyebrow text-muted">Member since</p>
          <p className="mt-4 font-display text-3xl">{formatDate(account?.createdAt ?? new Date())}</p>
          <p className="mt-1 text-xs text-muted">Signed in as {user.email}</p>
          <Link href="/account/settings" className="mt-4 inline-flex text-[0.63rem] font-semibold uppercase tracking-[0.11em] text-olive hover:text-ink">
            Update account details
          </Link>
        </section>
      </div>
    </div>
  );
}

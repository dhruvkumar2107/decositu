import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock3, MapPin, Package } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser, hashToken } from "@/lib/auth";
import { formatDateTime, formatPrice } from "@/lib/utils";
import {
  canCancelOrder,
  orderStatusClass,
  orderStatusLabel,
  paymentMethodLabel,
  paymentStatusLabel,
} from "@/lib/orders";
import { cn } from "@/lib/utils";
import { OrderTimeline } from "@/components/account/OrderTimeline";
import { CancelOrderButton } from "@/components/account/CancelOrderButton";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { orderNumber } = await params;
  const query = await searchParams;
  const token = typeof query.token === "string" ? query.token : "";
  const [order, user] = await Promise.all([
    prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    }),
    getCurrentUser(),
  ]);

  if (!order) notFound();

  const isOwner = Boolean(user && order.userId === user.id);
  const tokenMatches = Boolean(token && hashToken(token) === order.accessTokenHash);
  const isAdmin = user?.role === "ADMIN";
  if (!isOwner && !tokenMatches && !isAdmin) notFound();

  const confirmed = order.paymentStatus === "PAID" || order.paymentStatus === "COD_PENDING";
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container-luxe py-12 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <span
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full",
              confirmed ? "bg-olive text-ivory" : "bg-clay/15 text-clay",
            )}
          >
            {confirmed ? <Check size={25} /> : <Clock3 size={25} />}
          </span>
          <p className="eyebrow mt-6 text-muted">
            {confirmed ? "Order confirmed" : "Awaiting payment"}
          </p>
          <h1 className="display mt-3 text-5xl leading-[0.95] sm:text-6xl">
            {confirmed ? "Thank you for your order." : "Your order is saved."}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
            {order.paymentMethod === "COD"
              ? "Your order is confirmed. Please keep the exact amount ready for the carrier; you can pay by cash on delivery."
              : confirmed
                ? "Your payment has been verified and your order is confirmed. A confirmation email has been sent."
                : "We have not yet received payment confirmation. If you completed payment, please allow a few minutes and refresh this page."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="border border-line bg-paper px-4 py-2.5 text-xs">
              Order <span className="font-semibold">{order.orderNumber}</span>
            </span>
            <span
              className={cn(
                "border px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.09em]",
                orderStatusClass(order.status),
              )}
            >
              {orderStatusLabel(order.status)}
            </span>
          </div>
          <p className="mt-3 text-[0.67rem] text-muted">
            Placed {formatDateTime(order.createdAt)} · Confirmation sent to {order.email}
          </p>

          {!user && (
            <div className="mt-6 border border-line bg-cream/60 p-4 text-xs leading-6 text-muted">
              <p className="font-medium text-ink">Keep this order link.</p>
              <p className="mt-1">
                This private link is how you can return to your order details. For permanent access,
                create an account using <span className="text-ink">{order.email}</span>.
              </p>
              <Link href="/register" className="mt-2 inline-flex text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-olive">
                Create an account
              </Link>
            </div>
          )}

          <section className="mt-8 border border-line bg-paper p-5 sm:p-6">
            <p className="eyebrow text-muted">Delivery progress</p>
            <div className="mt-6">
              <OrderTimeline order={order} />
            </div>
            {canCancelOrder(order.status, order.paymentStatus) && (
              <div className="mt-5 border-t border-line pt-4">
                <CancelOrderButton orderNumber={order.orderNumber} token={token} />
              </div>
            )}
          </section>

          <section className="mt-5 border border-line bg-paper">
            <div className="border-b border-line px-5 py-4">
              <p className="eyebrow text-muted">
                {totalItems} {totalItems === 1 ? "piece" : "pieces"}
              </p>
            </div>
            <div className="divide-y divide-line">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 px-5 py-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-cream">
                    <Image src={item.image} alt={item.productName} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl leading-tight">{item.productName}</p>
                    <p className="mt-0.5 text-[0.65rem] text-muted">{item.variantLabel}</p>
                    <p className="mt-1 text-[0.62rem] text-muted">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm">{formatPrice(item.unitPrice * item.quantity)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-[105px]">
          <section className="border border-line bg-paper p-5">
            <p className="eyebrow text-muted">Order summary</p>
            <div className="mt-4 space-y-3 border-b border-line pb-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between gap-4 text-olive">
                  <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                  <span>−{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <span className="text-muted">Shipping</span>
                <span>{order.shipping === 0 ? "Complimentary" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">Taxes</span>
                <span className="text-muted">Included</span>
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-4 pt-4">
              <span className="text-[0.67rem] font-semibold uppercase tracking-[0.12em]">Total</span>
              <span className="font-display text-3xl">{formatPrice(order.total)}</span>
            </div>
            <div className="mt-4 space-y-2 border-t border-line pt-3 text-[0.67rem] text-muted">
              <p className="flex justify-between gap-3">
                <span>Payment</span>
                <span className="text-ink">{paymentMethodLabel(order.paymentMethod)}</span>
              </p>
              <p className="flex justify-between gap-3">
                <span>Status</span>
                <span className="text-ink">{paymentStatusLabel(order.paymentStatus)}</span>
              </p>
            </div>
          </section>

          <section className="border border-line bg-paper p-5">
            <p className="eyebrow text-muted">Delivering to</p>
            <div className="mt-3 flex items-start gap-2.5 text-xs leading-6">
              <MapPin size={15} className="mt-0.5 shrink-0 text-olive" />
              <div>
                <p className="font-medium">{order.fullName}</p>
                <p className="text-muted">{order.line1}</p>
                {order.line2 && <p className="text-muted">{order.line2}</p>}
                <p className="text-muted">
                  {order.city}, {order.state} {order.pincode}
                </p>
                <p className="mt-1 text-muted">{order.phone}</p>
              </div>
            </div>
          </section>

          <section className="border border-line bg-paper p-5 text-xs leading-6 text-muted">
            <p className="flex items-center gap-2 font-medium text-ink">
              <Package size={15} className="text-olive" /> What happens next?
            </p>
            <p className="mt-2">
              Our team prepares your pieces with care. You&apos;ll receive dispatch details by email once
              your order leaves our studio.
            </p>
            <Link href="/contact" className="mt-3 inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-olive">
              Need help? Contact us <ArrowRight size={12} />
            </Link>
          </section>

          <Link href="/collections/bestsellers" className="btn btn-outline w-full">
            Continue shopping
          </Link>
          {isOwner && (
            <Link href={`/account/orders/${order.orderNumber}`} className="block text-center text-[0.63rem] font-semibold uppercase tracking-[0.1em] text-muted hover:text-ink">
              View in your account
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}

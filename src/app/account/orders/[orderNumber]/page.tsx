import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Package, Phone } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { formatDate, formatDateTime, formatPrice } from "@/lib/utils";
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
  title: "Order details",
};

export default async function AccountOrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const user = await requireUser("/account/orders");
  const { orderNumber } = await params;

  const order = await prisma.order.findFirst({
    where: { orderNumber, userId: user.id },
    include: {
      items: {
        include: { product: { select: { slug: true, active: true } } },
      },
    },
  });

  if (!order) notFound();

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-[0.63rem] font-semibold uppercase tracking-[0.11em] text-muted hover:text-ink"
      >
        <ArrowLeft size={13} /> All orders
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-muted">Order {order.orderNumber}</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">Order details.</h1>
          <p className="mt-3 text-xs text-muted">
            Placed {formatDateTime(order.createdAt)} · {totalItems} {totalItems === 1 ? "piece" : "pieces"}
          </p>
        </div>
        <span
          className={cn(
            "border px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em]",
            orderStatusClass(order.status),
          )}
        >
          {orderStatusLabel(order.status)}
        </span>
      </div>

      <section className="mt-7 border border-line bg-paper p-5 sm:p-6">
        <p className="eyebrow text-muted">Delivery progress</p>
        <div className="mt-6">
          <OrderTimeline order={order} />
        </div>
        {canCancelOrder(order.status, order.paymentStatus) && (
          <div className="mt-5 border-t border-line pt-4">
            <CancelOrderButton orderNumber={order.orderNumber} />
          </div>
        )}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <section className="border border-line bg-paper">
            <div className="border-b border-line px-5 py-4">
              <p className="eyebrow text-muted">Pieces in this order</p>
            </div>
            <div className="divide-y divide-line">
              {order.items.map((item) => {
                const productHref =
                  item.product?.active && item.product.slug
                    ? `/products/${item.product.slug}`
                    : null;
                const content = (
                  <>
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-cream">
                      <Image src={item.image} alt={item.productName} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-xl leading-tight">{item.productName}</p>
                      <p className="mt-1 text-[0.67rem] text-muted">{item.variantLabel}</p>
                      <p className="mt-0.5 text-[0.6rem] text-muted">SKU: {item.sku}</p>
                      <p className="mt-2 text-[0.67rem] text-muted">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.unitPrice * item.quantity)}</p>
                  </>
                );

                return productHref ? (
                  <Link key={item.id} href={productHref} className="flex gap-4 px-5 py-4 transition-colors hover:bg-cream/40">
                    {content}
                  </Link>
                ) : (
                  <div key={item.id} className="flex gap-4 px-5 py-4">
                    {content}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="border border-line bg-paper p-5">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="eyebrow text-muted">Delivery address</p>
                <div className="mt-3 flex items-start gap-2.5 text-xs leading-6">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-olive" />
                  <div>
                    <p className="font-medium">{order.fullName}</p>
                    <p className="text-muted">{order.line1}</p>
                    {order.line2 && <p className="text-muted">{order.line2}</p>}
                    <p className="text-muted">
                      {order.city}, {order.state} {order.pincode}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="eyebrow text-muted">Contact</p>
                <div className="mt-3 space-y-2 text-xs text-muted">
                  <p className="flex items-center gap-2.5">
                    <Mail size={14} className="text-olive" /> {order.email}
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone size={14} className="text-olive" /> {order.phone}
                  </p>
                </div>
              </div>
            </div>
            {order.notes && (
              <div className="mt-5 border-t border-line pt-4">
                <p className="eyebrow text-muted">Order note</p>
                <p className="mt-2 text-xs leading-6 text-muted">{order.notes}</p>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="border border-line bg-paper p-5">
            <p className="eyebrow text-muted">Payment</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted">Method</span>
                <span>{paymentMethodLabel(order.paymentMethod)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">Status</span>
                <span>{paymentStatusLabel(order.paymentStatus)}</span>
              </div>
              {order.paidAt && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Paid on</span>
                  <span>{formatDate(order.paidAt)}</span>
                </div>
              )}
            </div>
          </section>

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
              <span className="text-[0.66rem] font-semibold uppercase tracking-[0.12em]">Total</span>
              <span className="font-display text-3xl">{formatPrice(order.total)}</span>
            </div>
          </section>

          <div className="border border-line bg-cream/60 p-4 text-[0.65rem] leading-5 text-muted">
            <p className="flex items-center gap-2 font-medium text-ink">
              <Package size={14} className="text-olive" /> Need help with this order?
            </p>
            <p className="mt-2">
              Contact customer care with order number <span className="text-ink">{order.orderNumber}</span>.
            </p>
            <Link href="/contact" className="mt-2 inline-flex text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-olive">
              Contact support
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

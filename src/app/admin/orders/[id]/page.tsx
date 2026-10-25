import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime, formatPrice } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  orderStatusClass,
  orderStatusLabel,
  paymentMethodLabel,
} from "@/lib/orders";
import { cn } from "@/lib/utils";
import { OrderTimeline } from "@/components/account/OrderTimeline";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { updateOrderAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Order details" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin("/admin/orders");
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });
  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted hover:text-ink">
        <ArrowLeft size={13} /> Back to orders
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-muted">Order operations</p>
          <h1 className="display mt-3 text-4xl sm:text-5xl">{order.orderNumber}</h1>
          <p className="mt-2 text-xs text-muted">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <span className={cn("border px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.09em]", orderStatusClass(order.status))}>
          {orderStatusLabel(order.status)}
        </span>
      </div>

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-5">
          <section className="border border-line bg-paper p-5">
            <p className="eyebrow text-muted">Fulfilment</p>
            <div className="mt-5">
              <OrderTimeline order={order} />
            </div>
          </section>

          <section className="border border-line bg-paper">
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <p className="eyebrow text-muted">Items</p>
              <p className="text-[0.6rem] text-muted">{order.items.reduce((sum, item) => sum + item.quantity, 0)} pieces</p>
            </div>
            <div className="divide-y divide-line">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3 px-5 py-3.5">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-cream">
                    <Image src={item.image} alt={item.productName} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium">{item.productName}</p>
                    <p className="mt-0.5 text-[0.6rem] text-muted">{item.variantLabel} · {item.sku}</p>
                    <p className="mt-1 text-[0.6rem] text-muted">Qty {item.quantity} × {formatPrice(item.unitPrice)}</p>
                  </div>
                  <p className="text-xs font-semibold">{formatPrice(item.unitPrice * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-line px-5 py-4 text-xs">
              <div className="flex justify-between gap-4"><span className="text-muted">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between gap-4 text-olive"><span>Discount {order.couponCode}</span><span>−{formatPrice(order.discount)}</span></div>
              )}
              <div className="flex justify-between gap-4"><span className="text-muted">Shipping</span><span>{order.shipping ? formatPrice(order.shipping) : "Free"}</span></div>
              <div className="flex justify-between gap-4 border-t border-line pt-2 text-sm font-semibold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </section>

          <div className="grid gap-5 sm:grid-cols-2">
            <section className="border border-line bg-paper p-5 text-xs leading-6">
              <p className="eyebrow text-muted">Customer</p>
              <p className="mt-3 flex items-center gap-2 font-medium"><UserRound size={14} className="text-olive" /> {order.fullName}</p>
              <p className="mt-1 flex items-center gap-2 text-muted"><Mail size={13} className="text-olive" /> {order.email}</p>
              <p className="mt-1 flex items-center gap-2 text-muted"><Phone size={13} className="text-olive" /> {order.phone}</p>
              {order.user ? (
                <Link href={`/admin/orders?q=${encodeURIComponent(order.user.email)}`} className="mt-3 inline-flex text-[0.6rem] font-semibold uppercase tracking-[0.09em] text-olive">
                  Registered customer
                </Link>
              ) : (
                <p className="mt-2 text-[0.6rem] text-muted">Guest checkout</p>
              )}
            </section>

            <section className="border border-line bg-paper p-5 text-xs leading-6">
              <p className="eyebrow text-muted">Delivery address</p>
              <p className="mt-3 flex items-start gap-2 text-muted">
                <MapPin size={14} className="mt-1 shrink-0 text-olive" />
                <span>
                  {order.fullName}<br />
                  {order.line1}{order.line2 ? <><br />{order.line2}</> : null}<br />
                  {order.city}, {order.state} {order.pincode}
                </span>
              </p>
            </section>
          </div>

          {order.notes && (
            <section className="border border-line bg-paper p-5">
              <p className="eyebrow text-muted">Customer note</p>
              <p className="mt-2 text-xs leading-6 text-muted">{order.notes}</p>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <section className="border border-line bg-paper p-5">
            <p className="eyebrow text-muted">Update order</p>
            <AdminActionForm action={updateOrderAction} submitLabel="Save order" className="mt-4" buttonClassName="w-full">
              <input type="hidden" name="id" value={order.id} />
              <div>
                <label htmlFor="order-status-update" className="label">Order status</label>
                <select id="order-status-update" name="status" defaultValue={order.status} className="select">
                  {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="mt-3">
                <label htmlFor="payment-status-update" className="label">Payment status</label>
                <select id="payment-status-update" name="paymentStatus" defaultValue={order.paymentStatus} className="select">
                  {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <p className="mt-3 text-[0.6rem] leading-5 text-muted">
                Marking an order cancelled restores variant stock and coupon usage. Reopening a cancelled
                order is blocked.
              </p>
            </AdminActionForm>
          </section>

          <section className="border border-line bg-paper p-5 text-xs">
            <p className="eyebrow text-muted">Payment record</p>
            <div className="mt-3 space-y-2 text-muted">
              <p className="flex justify-between gap-3"><span>Method</span><span className="text-ink">{paymentMethodLabel(order.paymentMethod)}</span></p>
              <p className="flex justify-between gap-3"><span>Status</span><span className="text-ink">{PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}</span></p>
              <p className="flex justify-between gap-3"><span>Order ID</span><span className="max-w-[150px] truncate text-ink">{order.razorpayOrderId ?? "—"}</span></p>
              <p className="flex justify-between gap-3"><span>Payment ID</span><span className="max-w-[150px] truncate text-ink">{order.razorpayPaymentId ?? "—"}</span></p>
            </div>
          </section>

          <section className="border border-line bg-cream/60 p-5 text-[0.62rem] leading-5 text-muted">
            <p className="font-medium text-ink">Audit timestamps</p>
            <p className="mt-2">Created: {formatDateTime(order.createdAt)}</p>
            <p>Updated: {formatDateTime(order.updatedAt)}</p>
            {order.shippedAt && <p>Shipped: {formatDateTime(order.shippedAt)}</p>}
            {order.deliveredAt && <p>Delivered: {formatDateTime(order.deliveredAt)}</p>}
            {order.cancelledAt && <p>Cancelled: {formatDateTime(order.cancelledAt)}</p>}
          </section>
        </aside>
      </div>
    </div>
  );
}

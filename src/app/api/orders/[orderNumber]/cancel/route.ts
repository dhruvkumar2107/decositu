import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, hashToken } from "@/lib/auth";
import { apiError, parseJson } from "@/lib/api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await params;
  const body = await parseJson(request);
  const token = typeof body?.token === "string" ? body.token : "";

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) return apiError("Order not found.", 404);

  const user = await getCurrentUser();
  const isOwner = Boolean(user && order.userId === user.id);
  const tokenMatches = Boolean(token && hashToken(token) === order.accessTokenHash);

  if (!isOwner && !tokenMatches && user?.role !== "ADMIN") {
    return apiError("You are not authorised to cancel this order.", 403);
  }

  if (!["PENDING", "CONFIRMED", "PROCESSING"].includes(order.status)) {
    return apiError("This order can no longer be cancelled online.", 400);
  }

  if (order.paymentStatus === "PAID") {
    return apiError("Paid orders need a refund review. Please contact customer care.", 400);
  }

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }
      if (item.productId) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    if (order.couponCode) {
      await tx.coupon.updateMany({
        where: { code: order.couponCode },
        data: { usedCount: { decrement: 1 } },
      });
    }

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        paymentStatus: order.paymentStatus === "COD_PENDING" ? "CANCELLED" : order.paymentStatus,
      },
    });
  });

  return NextResponse.json({ ok: true });
}

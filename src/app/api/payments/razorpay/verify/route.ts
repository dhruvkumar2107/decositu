import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { verifyRazorpaySignature } from "@/lib/payments";
import { apiError, parseJson } from "@/lib/api";
import { orderEmailHtml, sendEmail } from "@/lib/email";
import { formatPrice } from "@/lib/utils";

const schema = z.object({
  orderNumber: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await parseJson(request);
  const input = schema.safeParse(body);
  if (!input.success) return apiError("Invalid payment confirmation.", 400);

  const order = await prisma.order.findUnique({
    where: { orderNumber: input.data.orderNumber },
    include: { items: true },
  });

  if (!order) return apiError("Order not found.", 404);
  if (order.razorpayOrderId !== input.data.razorpay_order_id) {
    return apiError("Payment does not match this order.", 400);
  }
  if (order.paymentStatus === "PAID") {
    return NextResponse.json({ ok: true });
  }

  const valid = verifyRazorpaySignature({
    orderId: input.data.razorpay_order_id,
    paymentId: input.data.razorpay_payment_id,
    signature: input.data.razorpay_signature,
  });

  if (!valid) return apiError("Payment signature could not be verified.", 400);

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      razorpayPaymentId: input.data.razorpay_payment_id,
      paidAt: new Date(),
    },
  });

  await sendEmail({
    to: order.email,
    subject: `Payment received · ${order.orderNumber}`,
    html: orderEmailHtml({
      name: order.fullName,
      orderNumber: order.orderNumber,
      total: formatPrice(order.total),
      items: order.items.map((item) => ({ name: item.productName, quantity: item.quantity })),
    }),
  });

  return NextResponse.json({ ok: true });
}

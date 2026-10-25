import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, hashToken } from "@/lib/auth";
import { apiError, parseJson } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { createOrderSchema } from "@/lib/validators";
import { calculateTotals, couponDiscount, generateOrderNumber } from "@/lib/pricing";
import { getSettings, shippingConfig } from "@/lib/settings";
import { isRazorpayConfigured, createRazorpayOrder, razorpayPublicKey } from "@/lib/payments";
import { orderEmailHtml, sendEmail } from "@/lib/email";
import { formatPrice, parseImages } from "@/lib/utils";

class StockError extends Error {}

export async function POST(request: Request) {
  const limit = rateLimit(`order:${clientIp(request)}`, 12, 60 * 60 * 1000);
  if (!limit.allowed) {
    return apiError("Too many checkout attempts. Please try again later.", 429);
  }

  const body = await parseJson(request);
  try {
    const input = createOrderSchema.parse(body);
    const user = await getCurrentUser();

    if (input.paymentMethod === "ONLINE" && !isRazorpayConfigured()) {
      return apiError("Online payment is not available. Please choose cash on delivery.", 400);
    }

    const quantities = new Map<string, number>();
    for (const item of input.items) {
      const current = quantities.get(item.variantId) ?? 0;
      const combined = current + item.quantity;
      if (combined > 10) {
        return apiError("Maximum 10 units per variant per order.", 400);
      }
      quantities.set(item.variantId, combined);
    }

    const variantIds = [...quantities.keys()];
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds }, active: true },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            active: true,
            images: true,
          },
        },
      },
    });

    if (variants.length !== variantIds.length) {
      return apiError("One or more items are no longer available.", 409);
    }

    const lines = variants.map((variant) => {
      const requested = quantities.get(variant.id) ?? 0;
      const productInput = input.items.find((item) => item.variantId === variant.id);
      if (!productInput || productInput.productId !== variant.productId) {
        throw new Error("Item mismatch.");
      }
      if (!variant.product.active || variant.stock < requested) {
        throw new StockError(`${variant.product.name} (${variant.size} / ${variant.color}) has only ${variant.stock} left.`);
      }
      const images = parseImages(variant.product.images);
      return {
        variant,
        quantity: requested,
        unitPrice: variant.price,
        image: variant.image ?? images[0] ?? "/images/bedding-01.jpg",
      };
    });

    const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    let coupon = null;

    if (input.couponCode) {
      const found = await prisma.coupon.findUnique({
        where: { code: input.couponCode.toUpperCase() },
      });
      if (!found) return apiError("That coupon code is not recognised.", 400);
      const result = couponDiscount(found, subtotal);
      if (result.error) return apiError(result.error, 400);
      coupon = found;
    }

    const settings = await getSettings();
    const shipping = shippingConfig(settings);
    const totals = calculateTotals(
      lines.map((line) => ({ unitPrice: line.unitPrice, quantity: line.quantity })),
      {
        coupon,
        shippingThreshold: shipping.threshold,
        shippingFee: shipping.fee,
      },
    );

    const orderNumber = generateOrderNumber();
    const accessToken = randomBytes(24).toString("hex");
    const accessTokenHash = hashToken(accessToken);

    let razorpayOrder:
      | { id: string; amount: number; currency: string; status: string }
      | null = null;

    if (input.paymentMethod === "ONLINE") {
      razorpayOrder = await createRazorpayOrder({
        amount: totals.total,
        receipt: orderNumber,
        notes: {
          orderNumber,
          customerEmail: input.email,
        },
      });
    }

    const order = await prisma.$transaction(async (tx) => {
      for (const line of lines) {
        const updated = await tx.productVariant.updateMany({
          where: {
            id: line.variant.id,
            active: true,
            stock: { gte: line.quantity },
          },
          data: { stock: { decrement: line.quantity } },
        });

        if (updated.count !== 1) {
          throw new StockError(
            `${line.variant.product.name} (${line.variant.size} / ${line.variant.color}) is no longer available in that quantity.`,
          );
        }

        await tx.product.update({
          where: { id: line.variant.productId },
          data: { stock: { decrement: line.quantity } },
        });
      }

      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      return tx.order.create({
        data: {
          orderNumber,
          accessTokenHash,
          userId: user?.id,
          email: input.email,
          phone: input.phone,
          status: input.paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
          paymentStatus: input.paymentMethod === "COD" ? "COD_PENDING" : "PENDING",
          paymentMethod: input.paymentMethod,
          subtotal: totals.subtotal,
          discount: totals.discount,
          shipping: totals.shipping,
          tax: totals.tax,
          total: totals.total,
          couponCode: coupon?.code ?? null,
          fullName: input.fullName,
          line1: input.line1,
          line2: input.line2 || null,
          city: input.city,
          state: input.state,
          pincode: input.pincode,
          notes: input.notes || null,
          razorpayOrderId: razorpayOrder?.id ?? null,
          items: {
            create: lines.map((line) => ({
              productId: line.variant.productId,
              variantId: line.variant.id,
              productName: line.variant.product.name,
              variantLabel: `${line.variant.size} / ${line.variant.color}`,
              sku: line.variant.sku,
              unitPrice: line.unitPrice,
              quantity: line.quantity,
              image: line.image,
            })),
          },
        },
        include: { items: true },
      });
    });

    if (input.paymentMethod === "COD") {
      await sendEmail({
        to: order.email,
        subject: `Order ${order.orderNumber} confirmed`,
        html: orderEmailHtml({
          name: order.fullName,
          orderNumber: order.orderNumber,
          total: formatPrice(order.total),
          items: order.items.map((item) => ({ name: item.productName, quantity: item.quantity })),
        }),
      });
    }

    return NextResponse.json(
      {
        orderNumber: order.orderNumber,
        accessToken,
        total: order.total,
        payment:
          input.paymentMethod === "ONLINE" && razorpayOrder
            ? {
                provider: "razorpay",
                keyId: razorpayPublicKey(),
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
              }
            : null,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message || "Please check the checkout details.", 422);
    }
    if (error instanceof StockError) {
      return apiError(error.message, 409);
    }
    console.error("Order creation failed", error);
    return apiError("We could not place the order. Please try again.", 500);
  }
}

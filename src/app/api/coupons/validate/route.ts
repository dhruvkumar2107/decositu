import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { couponCodeSchema } from "@/lib/validators";
import { couponDiscount } from "@/lib/pricing";
import { apiError, parseJson } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limit = rateLimit(`coupon:${clientIp(request)}`, 30, 15 * 60 * 1000);
  if (!limit.allowed) return apiError("Too many coupon attempts. Please wait a moment.", 429);

  const body = await parseJson(request);
  try {
    const input = couponCodeSchema.parse(body);
    const coupon = await prisma.coupon.findUnique({
      where: { code: input.code.toUpperCase() },
    });

    if (!coupon) return apiError("That coupon code is not recognised.", 404);

    const result = couponDiscount(coupon, input.subtotal);
    if (result.error) return apiError(result.error, 400);

    return NextResponse.json({
      code: coupon.code,
      description: coupon.description,
      discount: result.discount,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message || "Enter a valid coupon.", 422);
    }
    return apiError("Unable to validate the coupon right now.", 500);
  }
}

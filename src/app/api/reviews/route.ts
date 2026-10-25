import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { apiError, parseJson } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { reviewSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return apiError("Please sign in to write a review.", 401);

  const limit = rateLimit(`review:${user.id}`, 5, 24 * 60 * 60 * 1000);
  if (!limit.allowed) return apiError("You have submitted several reviews today.", 429);
  rateLimit(`review:ip:${clientIp(request)}`, 10, 24 * 60 * 60 * 1000);

  const body = await parseJson(request);
  try {
    const input = reviewSchema.parse(body);
    const product = await prisma.product.findUnique({ where: { id: input.productId } });
    if (!product || !product.active) return apiError("Product not found.", 404);

    const existing = await prisma.review.findUnique({
      where: { productId_userId: { productId: input.productId, userId: user.id } },
    });
    if (existing) return apiError("You have already reviewed this product.", 409);

    await prisma.review.create({
      data: {
        productId: input.productId,
        userId: user.id,
        rating: input.rating,
        title: input.title || null,
        body: input.body,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Thank you. Your review will appear after moderation." },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message || "Please check your review.", 422);
    }
    console.error("Review submission failed", error);
    return apiError("Unable to submit the review right now.", 500);
  }
}

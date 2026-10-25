import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { apiError, parseJson } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { newsletterSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const limit = rateLimit(`newsletter:${clientIp(request)}`, 6, 60 * 60 * 1000);
  if (!limit.allowed) return apiError("Too many requests. Please try again later.", 429);

  const body = await parseJson(request);
  try {
    const input = newsletterSchema.parse(body);
    await prisma.newsletterSubscriber.upsert({
      where: { email: input.email },
      update: { consent: true },
      create: { email: input.email, consent: input.consent },
    });

    return NextResponse.json({
      message: "You're on the list. Look out for our next letter.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message || "Please check your email.", 422);
    }
    console.error("Newsletter signup failed", error);
    return apiError("Unable to add you to the list right now.", 500);
  }
}

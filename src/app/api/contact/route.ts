import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { apiError, parseJson } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientIp(request)}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) return apiError("Too many messages. Please try again later.", 429);

  const body = await parseJson(request);
  try {
    const input = contactSchema.parse(body);
    await prisma.contactMessage.create({ data: input });
    return NextResponse.json({
      message: "Thank you. Our customer care team will reply within one business day.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message || "Please check your message.", 422);
    }
    console.error("Contact request failed", error);
    return apiError("Unable to send your message right now.", 500);
  }
}

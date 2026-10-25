import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { createPasswordReset } from "@/lib/auth";
import { apiError, parseJson } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { forgotPasswordSchema } from "@/lib/validators";
import { passwordResetHtml, sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const ipLimit = rateLimit(`forgot:${clientIp(request)}`, 4, 60 * 60 * 1000);
  if (!ipLimit.allowed) {
    return apiError("Too many requests. Please try again later.", 429);
  }

  const body = await parseJson(request);
  try {
    const input = forgotPasswordSchema.parse(body);
    const user = await prisma.user.findUnique({ where: { email: input.email } });

    if (user) {
      const token = await createPasswordReset(user.id);
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;
      await sendEmail({
        to: user.email,
        subject: "Reset your Decoritu password",
        html: passwordResetHtml(resetUrl),
      });
      if (process.env.NODE_ENV !== "production") {
        console.info(`[password-reset:dev] ${resetUrl}`);
      }
    }

    return NextResponse.json({
      message: "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message || "Enter a valid email.", 422);
    }
    console.error("Password reset request failed", error);
    return apiError("Unable to process the request right now.", 500);
  }
}

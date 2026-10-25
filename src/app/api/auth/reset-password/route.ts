import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { consumePasswordReset } from "@/lib/auth";
import { apiError, parseJson } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { resetPasswordSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const limit = rateLimit(`reset:${clientIp(request)}`, 6, 60 * 60 * 1000);
  if (!limit.allowed) {
    return apiError("Too many attempts. Please try again later.", 429);
  }

  const body = await parseJson(request);
  try {
    const input = resetPasswordSchema.parse(body);
    const result = await consumePasswordReset(input.token, input.password);
    if (!result.ok) return apiError(result.error, 400);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message || "Please check your new password.", 422);
    }
    console.error("Password reset failed", error);
    return apiError("Unable to reset the password right now.", 500);
  }
}

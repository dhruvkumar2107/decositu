import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";
import { apiError, parseJson } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const ipLimit = rateLimit(`login:ip:${ip}`, 12, 15 * 60 * 1000);
  if (!ipLimit.allowed) {
    return apiError("Too many sign-in attempts. Please wait a few minutes.", 429);
  }

  const body = await parseJson(request);
  try {
    const input = loginSchema.parse(body);
    const emailLimit = rateLimit(`login:email:${input.email}`, 8, 15 * 60 * 1000);
    if (!emailLimit.allowed) {
      return apiError("Too many sign-in attempts. Please wait a few minutes.", 429);
    }

    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      return apiError("Email or password is incorrect.", 401);
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      return apiError("Email or password is incorrect.", 401);
    }

    await createSession(user.id, {
      userAgent: request.headers.get("user-agent") ?? undefined,
      ip,
    });

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message || "Please check your details.", 422);
    }
    console.error("Login failed", error);
    return apiError("Unable to sign in right now.", 500);
  }
}

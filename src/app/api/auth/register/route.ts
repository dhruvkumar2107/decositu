import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { apiError, parseJson } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const limit = rateLimit(`register:${clientIp(request)}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return apiError("Too many attempts. Please try again later.", 429);
  }

  const body = await parseJson(request);
  try {
    const input = registerSchema.parse(body);
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      return apiError("An account with this email already exists.", 409);
    }

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: { name: input.name, email: input.email, passwordHash },
      select: { id: true, name: true, email: true, role: true },
    });

    await createSession(user.id, {
      userAgent: request.headers.get("user-agent") ?? undefined,
      ip: clientIp(request),
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      const first = error.issues[0];
      return apiError(first?.message || "Please check your details.", 422);
    }
    console.error("Registration failed", error);
    return apiError("Unable to create your account right now.", 500);
  }
}

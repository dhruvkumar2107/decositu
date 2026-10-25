import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser, hashPassword, hashToken, verifyPassword } from "@/lib/auth";
import { apiError, parseJson } from "@/lib/api";
import { changePasswordSchema } from "@/lib/validators";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return apiError("Please sign in to continue.", 401);

  const limit = rateLimit(`password-change:${user.id}:${clientIp(request)}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) return apiError("Too many attempts. Please try again later.", 429);

  const body = await parseJson(request);
  try {
    const input = changePasswordSchema.parse(body);
    const record = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });
    if (!record) return apiError("Account not found.", 404);

    const valid = await verifyPassword(input.currentPassword, record.passwordHash);
    if (!valid) return apiError("Your current password is incorrect.", 401);

    const passwordHash = await hashPassword(input.newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    const store = await cookies();
    const token = store.get("decoritu_session")?.value;
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
        ...(token ? { tokenHash: { not: hashToken(token) } } : {}),
      },
    });

    return NextResponse.json({ ok: true, message: "Your password has been updated." });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message || "Please check your password.", 422);
    }
    console.error("Password change failed", error);
    return apiError("Unable to update your password right now.", 500);
  }
}

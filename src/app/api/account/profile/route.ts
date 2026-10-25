import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { apiError, parseJson } from "@/lib/api";
import { profileSchema } from "@/lib/validators";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return apiError("Please sign in to continue.", 401);

  const body = await parseJson(request);
  try {
    const input = profileSchema.parse(body);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: input.name, phone: input.phone },
      select: { id: true, name: true, email: true, phone: true },
    });
    return NextResponse.json({ user: updated });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message || "Please check your details.", 422);
    }
    console.error("Profile update failed", error);
    return apiError("Unable to update your profile right now.", 500);
  }
}

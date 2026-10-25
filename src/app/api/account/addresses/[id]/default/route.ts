import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { apiError } from "@/lib/api";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return apiError("Please sign in to continue.", 401);

  const { id } = await params;
  const existing = await prisma.address.findFirst({ where: { id, userId: user.id } });
  if (!existing) return apiError("Address not found.", 404);

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    }),
    prisma.address.update({ where: { id }, data: { isDefault: true } }),
  ]);

  return NextResponse.json({ ok: true });
}

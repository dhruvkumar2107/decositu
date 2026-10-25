import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { apiError, parseJson } from "@/lib/api";
import { addressSchema } from "@/lib/validators";

async function ownedAddress(userId: string, id: string) {
  return prisma.address.findFirst({ where: { id, userId } });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return apiError("Please sign in to continue.", 401);

  const { id } = await params;
  const existing = await ownedAddress(user.id, id);
  if (!existing) return apiError("Address not found.", 404);

  const body = await parseJson(request);
  try {
    const input = addressSchema.parse(body);
    const address = await prisma.$transaction(async (tx) => {
      if (input.isDefault) {
        await tx.address.updateMany({
          where: { userId: user.id },
          data: { isDefault: false },
        });
      }
      return tx.address.update({
        where: { id },
        data: {
          label: input.label,
          fullName: input.fullName,
          phone: input.phone,
          line1: input.line1,
          line2: input.line2 || null,
          city: input.city,
          state: input.state,
          pincode: input.pincode,
          isDefault: input.isDefault || existing.isDefault,
        },
      });
    });

    return NextResponse.json({ address });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message || "Please check the address.", 422);
    }
    console.error("Address update failed", error);
    return apiError("Unable to update the address right now.", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return apiError("Please sign in to continue.", 401);

  const { id } = await params;
  const existing = await ownedAddress(user.id, id);
  if (!existing) return apiError("Address not found.", 404);

  await prisma.address.delete({ where: { id } });
  if (existing.isDefault) {
    const next = await prisma.address.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    if (next) {
      await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  }

  return NextResponse.json({ ok: true });
}

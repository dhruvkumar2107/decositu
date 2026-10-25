import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { apiError, parseJson } from "@/lib/api";
import { addressSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return apiError("Please sign in to continue.", 401);

  const body = await parseJson(request);
  try {
    const input = addressSchema.parse(body);
    const count = await prisma.address.count({ where: { userId: user.id } });
    if (count >= 10) {
      return apiError("You can save up to 10 addresses.", 400);
    }

    const address = await prisma.$transaction(async (tx) => {
      if (input.isDefault || count === 0) {
        await tx.address.updateMany({
          where: { userId: user.id },
          data: { isDefault: false },
        });
      }
      return tx.address.create({
        data: {
          userId: user.id,
          label: input.label,
          fullName: input.fullName,
          phone: input.phone,
          line1: input.line1,
          line2: input.line2 || null,
          city: input.city,
          state: input.state,
          pincode: input.pincode,
          isDefault: input.isDefault || count === 0,
        },
      });
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error.issues[0]?.message || "Please check the address.", 422);
    }
    console.error("Address create failed", error);
    return apiError("Unable to save the address right now.", 500);
  }
}

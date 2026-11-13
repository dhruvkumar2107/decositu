import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { apiError, apiOk, parseJson } from "@/lib/api";
import { findMediaUsage, mediaUrl } from "@/lib/media";

async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

/** Rename an uploaded image. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return apiError("Not authorised.", 401);
  const { id } = await params;
  const body = await parseJson(request);
  const filename = typeof body?.filename === "string" ? body.filename.trim().slice(0, 200) : "";
  if (!filename) return apiError("Enter a name for the image.");

  const updated = await prisma.mediaAsset.updateMany({ where: { id }, data: { filename } });
  if (!updated.count) return apiError("Image not found.", 404);
  revalidatePath("/admin/media");
  return apiOk({ ok: true, filename });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return apiError("Not authorised.", 401);

  const { id } = await params;
  const usage = await findMediaUsage(mediaUrl(id));
  if (usage.length) {
    return apiError(
      `This image is still in use — replace it first. Used by: ${usage.slice(0, 5).join("; ")}`,
      409,
      { usage },
    );
  }

  await prisma.mediaAsset.deleteMany({ where: { id } });
  revalidatePath("/admin/media");
  return apiOk({ ok: true });
}

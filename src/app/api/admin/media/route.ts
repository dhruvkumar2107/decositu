import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api";
import { MEDIA_MAX_BYTES, mediaUrl, sniffImageType } from "@/lib/media";

async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

export async function GET() {
  if (!(await isAdmin())) return apiError("Not authorised.", 401);
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, filename: true, mimeType: true, size: true, width: true, height: true, createdAt: true },
    take: 500,
  });
  return apiOk({ assets: assets.map((asset) => ({ ...asset, url: mediaUrl(asset.id) })) });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return apiError("Not authorised.", 401);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return apiError("Upload could not be read. Images must be under 4 MB.", 413);
  }
  const file = form.get("file");
  if (!(file instanceof File)) return apiError("Choose an image to upload.");
  if (file.size === 0) return apiError("That file is empty.");
  if (file.size > MEDIA_MAX_BYTES) return apiError("Images must be under 4 MB.", 413);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mimeType = sniffImageType(bytes);
  if (!mimeType) return apiError("Only JPG, PNG, WebP, GIF or AVIF images can be uploaded.", 415);

  const dimension = (key: string) => {
    const value = Number(form.get(key));
    return Number.isInteger(value) && value > 0 && value < 20000 ? value : null;
  };

  const asset = await prisma.mediaAsset.create({
    data: {
      filename: (file.name || "image").slice(0, 200),
      mimeType,
      size: bytes.length,
      width: dimension("width"),
      height: dimension("height"),
      data: Buffer.from(bytes),
    },
    select: { id: true, filename: true, mimeType: true, size: true, width: true, height: true, createdAt: true },
  });

  revalidatePath("/admin/media");
  return apiOk({ asset: { ...asset, url: mediaUrl(asset.id) } }, 201);
}

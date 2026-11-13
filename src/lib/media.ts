import { prisma } from "@/lib/db";

export const MEDIA_MAX_BYTES = 4 * 1024 * 1024; // stays under Vercel's 4.5 MB request limit
export const MEDIA_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

export function mediaUrl(id: string) {
  return `/api/media/${id}`;
}

export function mediaIdFromUrl(url: string) {
  const match = /^\/api\/media\/([a-z0-9]+)$/i.exec(url);
  return match?.[1] ?? null;
}

/** Detect the real image type from the file's first bytes; never trust the client's MIME type. */
export function sniffImageType(bytes: Uint8Array): string | null {
  const starts = (...sig: number[]) => sig.every((value, index) => bytes[index] === value);
  const ascii = (offset: number, text: string) =>
    [...text].every((char, index) => bytes[offset + index] === char.charCodeAt(0));
  if (starts(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (ascii(0, "GIF87a") || ascii(0, "GIF89a")) return "image/gif";
  if (ascii(0, "RIFF") && ascii(8, "WEBP")) return "image/webp";
  if (ascii(4, "ftyp") && (ascii(8, "avif") || ascii(8, "avis"))) return "image/avif";
  return null;
}

/** Lists every place an uploaded image URL is referenced, so it isn't deleted while in use. */
export async function findMediaUsage(url: string) {
  const [settings, categories, products, variants] = await Promise.all([
    prisma.setting.findMany({ where: { value: url }, select: { key: true } }),
    prisma.category.findMany({ where: { image: url }, select: { name: true } }),
    prisma.product.findMany({ where: { images: { contains: `"${url}"` } }, select: { name: true } }),
    prisma.productVariant.findMany({
      where: { image: url },
      select: { size: true, color: true, product: { select: { name: true } } },
    }),
  ]);
  return [
    ...settings.map((row) => `Site image (${row.key.replace(/^img\./, "")})`),
    ...categories.map((row) => `Category: ${row.name}`),
    ...products.map((row) => `Product: ${row.name}`),
    ...variants.map((row) => `Variant: ${row.product.name} – ${row.size}/${row.color}`),
  ];
}

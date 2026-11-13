"use client";

export type MediaAssetDTO = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  createdAt: string;
};

const MAX_DIMENSION = 2400;
const MAX_BYTES = 4 * 1024 * 1024;
const RESIZE_ABOVE_BYTES = 1.5 * 1024 * 1024;
const RESIZABLE = ["image/jpeg", "image/png", "image/webp"];

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`“${file.name}” is not a readable image.`));
    };
    image.src = url;
  });
}

/**
 * Downscales large photos in the browser (keeps transparency via WebP), so phone
 * photos of 10 MB+ upload comfortably under the server limit.
 */
async function prepareImage(file: File) {
  const image = await loadImage(file);
  let width = image.naturalWidth;
  let height = image.naturalHeight;
  const tooLarge = Math.max(width, height) > MAX_DIMENSION;

  if (!RESIZABLE.includes(file.type) || (!tooLarge && file.size <= RESIZE_ABOVE_BYTES)) {
    return { file, width, height };
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return { file, width: image.naturalWidth, height: image.naturalHeight };
  context.drawImage(image, 0, 0, width, height);

  for (const quality of [0.86, 0.78, 0.68]) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    if (blob && blob.type === "image/webp" && blob.size <= MAX_BYTES) {
      const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
      return { file: new File([blob], name, { type: "image/webp" }), width, height };
    }
  }
  return { file, width, height };
}

export async function uploadImage(file: File): Promise<MediaAssetDTO> {
  if (!file.type.startsWith("image/")) throw new Error(`“${file.name}” is not an image.`);
  const prepared = await prepareImage(file);
  if (prepared.file.size > MAX_BYTES) {
    throw new Error(`“${file.name}” is too large even after compressing. Please use an image under 4 MB.`);
  }

  const body = new FormData();
  body.append("file", prepared.file);
  body.append("width", String(prepared.width));
  body.append("height", String(prepared.height));

  const response = await fetch("/api/admin/media", { method: "POST", body });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || `Upload failed for “${file.name}”.`);
  return data.asset as MediaAssetDTO;
}

export async function listMedia(): Promise<MediaAssetDTO[]> {
  const response = await fetch("/api/admin/media", { cache: "no-store" });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || "Could not load the media library.");
  return data.assets as MediaAssetDTO[];
}

export async function deleteMedia(id: string) {
  const response = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || "Could not delete the image.");
}

export async function renameMedia(id: string, filename: string) {
  const response = await fetch(`/api/admin/media/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || "Could not rename the image.");
}

/** "/images/bedding-01.jpg" → "bedding-01.jpg" */
export function fileNameFromUrl(url: string) {
  return decodeURIComponent(url.split("?")[0].split("/").pop() || url);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

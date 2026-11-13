import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const metadata: Metadata = { title: "Media library" };

export default async function AdminMediaPage() {
  await requireAdmin("/admin/media");
  return (
    <div>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-muted">Uploads</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Media library.</h1>
        <p className="mt-3 max-w-2xl text-xs leading-6 text-muted">
          Every image you upload from your device is listed here with its name, size and date, and can be
          reused on products, categories and site images. Drag photos in or click to upload — several at
          once is fine.
        </p>
      </div>
      <MediaLibrary />
    </div>
  );
}

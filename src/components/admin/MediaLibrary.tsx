"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Loader2, Pencil, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AdminThumb } from "@/components/admin/AdminThumb";
import { MEDIA_ACCEPT_CLIENT } from "@/components/admin/media-constants";
import { builtinImages } from "@/lib/builtin-images";
import {
  deleteMedia,
  fileNameFromUrl,
  formatBytes,
  listMedia,
  renameMedia,
  uploadImage,
  type MediaAssetDTO,
} from "@/lib/upload-client";
import { cn, formatDate } from "@/lib/utils";

async function copyLink(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Image link copied.");
  } catch {
    window.prompt("Copy this image link:", url);
  }
}

export function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAssetDTO[] | null>(null);
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);
  const [query, setQuery] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setAssets(await listMedia());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load images.");
      setAssets([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleFiles(files: FileList | File[] | null) {
    const list = [...(files ?? [])].filter((file) => file.type.startsWith("image/"));
    if (!list.length) return;
    setUploading(list.length);
    let ok = 0;
    for (const file of list) {
      try {
        const asset = await uploadImage(file);
        setAssets((current) => [asset, ...(current ?? [])]);
        ok += 1;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed.");
      }
      setUploading((count) => count - 1);
    }
    if (fileInput.current) fileInput.current.value = "";
    if (ok) toast.success(`${ok} image${ok > 1 ? "s" : ""} uploaded.`);
  }

  async function remove(asset: MediaAssetDTO) {
    if (!window.confirm(`Delete “${asset.filename}”? This cannot be undone.`)) return;
    setBusy(asset.id);
    try {
      await deleteMedia(asset.id);
      setAssets((current) => current?.filter((item) => item.id !== asset.id) ?? null);
      toast.success("Image deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the image.", { duration: 8000 });
    } finally {
      setBusy(null);
    }
  }

  async function saveName() {
    if (!editing) return;
    const name = editing.name.trim();
    if (!name) return;
    setBusy(editing.id);
    try {
      await renameMedia(editing.id, name);
      setAssets((current) => current?.map((item) => (item.id === editing.id ? { ...item, filename: name } : item)) ?? null);
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not rename the image.");
    } finally {
      setBusy(null);
    }
  }

  const q = query.trim().toLowerCase();
  const visibleUploads = (assets ?? []).filter((asset) => !q || asset.filename.toLowerCase().includes(q));
  const visibleBuiltins = builtinImages.filter((url) => !q || url.toLowerCase().includes(q));

  return (
    <div className="mt-5">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-4 py-10 text-center text-xs transition-colors",
          dragging ? "border-olive bg-olive/5 text-ink" : "border-line bg-paper text-muted hover:border-olive hover:text-ink",
        )}
      >
        {uploading > 0 ? <Loader2 size={22} className="animate-spin" /> : <Upload size={22} strokeWidth={1.4} />}
        <span className="font-medium">
          {uploading > 0
            ? `Uploading ${uploading} image${uploading > 1 ? "s" : ""}…`
            : "Drop images here or click to upload from your device"}
        </span>
        <span className="text-[0.6rem]">JPG, PNG, WebP, GIF or AVIF · big photos are compressed automatically</span>
        <input
          ref={fileInput}
          type="file"
          accept={MEDIA_ACCEPT_CLIENT}
          multiple
          className="sr-only"
          onChange={(event) => void handleFiles(event.target.files)}
        />
      </label>

      <div className="relative mt-5 max-w-sm">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search images by name"
          aria-label="Search images by name"
          className="input !pl-9"
        />
      </div>

      <section className="mt-6">
        <p className="eyebrow text-muted">Your uploads {assets ? `· ${visibleUploads.length}` : ""}</p>
        {assets === null ? (
          <p className="mt-4 flex items-center gap-2 text-xs text-muted"><Loader2 size={14} className="animate-spin" /> Loading…</p>
        ) : visibleUploads.length === 0 ? (
          <p className="mt-3 border border-dashed border-line px-5 py-10 text-center text-xs text-muted">
            {assets.length ? "No uploads match your search." : "No uploads yet — your uploaded photos will appear here."}
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visibleUploads.map((asset) => (
              <figure key={asset.id} className="border border-line bg-paper">
                <div className="aspect-square overflow-hidden bg-cream">
                  <AdminThumb src={asset.url} alt={asset.filename} className="h-full w-full object-cover" />
                </div>
                <figcaption className="p-2.5">
                  {editing?.id === asset.id ? (
                    <form
                      className="flex gap-1"
                      onSubmit={(event) => {
                        event.preventDefault();
                        void saveName();
                      }}
                    >
                      <input
                        autoFocus
                        value={editing.name}
                        maxLength={200}
                        onChange={(event) => setEditing({ id: asset.id, name: event.target.value })}
                        aria-label="Image name"
                        className="input !px-2 !py-1 text-[0.62rem]"
                      />
                      <button type="submit" aria-label="Save name" className="px-1 text-olive"><Check size={13} /></button>
                      <button type="button" aria-label="Cancel" onClick={() => setEditing(null)} className="px-1 text-muted"><X size={13} /></button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditing({ id: asset.id, name: asset.filename })}
                      className="group flex w-full items-center gap-1 text-left"
                      title="Rename"
                    >
                      <span className="truncate text-[0.65rem] font-medium">{asset.filename}</span>
                      <Pencil size={10} className="shrink-0 text-muted opacity-60 group-hover:opacity-100" />
                    </button>
                  )}
                  <p className="mt-0.5 text-[0.55rem] text-muted">
                    {asset.width && asset.height ? `${asset.width}×${asset.height} · ` : ""}
                    {formatBytes(asset.size)} · {formatDate(asset.createdAt)}
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    <button type="button" onClick={() => void copyLink(asset.url)} className="btn btn-outline flex-1 !px-2 !py-1.5 text-[0.55rem]">
                      <Copy size={11} /> Copy link
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(asset)}
                      disabled={busy === asset.id}
                      aria-label={`Delete ${asset.filename}`}
                      className="btn btn-outline !px-2 !py-1.5 text-[0.55rem] hover:!border-wine hover:!bg-wine"
                    >
                      {busy === asset.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                    </button>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <p className="eyebrow text-muted">Built-in website images · {visibleBuiltins.length}</p>
        <p className="mt-1 text-[0.6rem] text-muted">
          The images that came with the website. They stay in place until you replace them on the Site images,
          Products or Categories pages.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {visibleBuiltins.map((url) => (
            <figure key={url} className="border border-line bg-paper">
              <div className="aspect-square overflow-hidden bg-cream">
                <AdminThumb src={url} alt={fileNameFromUrl(url)} width={128} className="h-full w-full object-cover" />
              </div>
              <figcaption className="flex items-center gap-1 p-2">
                <span className="min-w-0 flex-1 truncate text-[0.58rem]" title={fileNameFromUrl(url)}>{fileNameFromUrl(url)}</span>
                <button type="button" aria-label={`Copy link to ${fileNameFromUrl(url)}`} onClick={() => void copyLink(url)} className="text-muted hover:text-ink">
                  <Copy size={11} />
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}

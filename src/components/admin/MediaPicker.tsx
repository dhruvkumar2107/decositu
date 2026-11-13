"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AdminThumb } from "@/components/admin/AdminThumb";
import { MEDIA_ACCEPT_CLIENT } from "@/components/admin/media-constants";
import { builtinImages } from "@/lib/builtin-images";
import { fileNameFromUrl, listMedia, uploadImage, type MediaAssetDTO } from "@/lib/upload-client";
import { cn } from "@/lib/utils";

/**
 * Modal that shows every uploaded image. The admin can pick one (or several when
 * `multiple`), or upload new images right here.
 */
export function MediaPicker({
  open,
  onClose,
  onSelect,
  multiple = false,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
}) {
  const [assets, setAssets] = useState<MediaAssetDTO[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      setAssets(await listMedia());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load images.");
      setAssets([]);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setSelected([]);
    void load();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, load, onClose]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const list = [...files];
    setUploading(list.length);
    const added: MediaAssetDTO[] = [];
    for (const file of list) {
      try {
        added.push(await uploadImage(file));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed.");
      }
      setUploading((count) => count - 1);
    }
    if (fileInput.current) fileInput.current.value = "";
    if (!added.length) return;
    setAssets((current) => [...added, ...(current ?? [])]);
    const urls = added.map((asset) => asset.url);
    setSelected((current) => (multiple ? [...current, ...urls] : urls.slice(0, 1)));
  }

  function toggle(url: string) {
    setSelected((current) => {
      if (!multiple) return current[0] === url ? [] : [url];
      return current.includes(url) ? current.filter((item) => item !== url) : [...current, url];
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Media library">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col border border-line bg-paper shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="eyebrow text-muted">Media library</p>
            <p className="mt-1 text-[0.62rem] text-muted">
              {multiple ? "Select one or more images." : "Select an image."} You can also upload new ones here.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-line bg-cream/40 px-4 py-6 text-center text-xs text-muted hover:border-olive hover:text-ink">
            {uploading > 0 ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {uploading > 0 ? `Uploading ${uploading} image${uploading > 1 ? "s" : ""}…` : "Click to upload images from your device"}
            <input
              ref={fileInput}
              type="file"
              accept={MEDIA_ACCEPT_CLIENT}
              multiple
              className="sr-only"
              onChange={(event) => void handleFiles(event.target.files)}
            />
          </label>

          {error && <p className="mt-4 text-xs text-wine">{error}</p>}
          {assets === null ? (
            <p className="mt-6 flex items-center gap-2 text-xs text-muted"><Loader2 size={14} className="animate-spin" /> Loading images…</p>
          ) : (
            <>
              <p className="eyebrow mt-5 text-muted">Your uploads</p>
              {assets.length === 0 ? (
                <p className="mt-2 text-xs text-muted">No uploaded images yet.</p>
              ) : (
                <PickerGrid
                  items={assets.map((asset) => ({ url: asset.url, name: asset.filename }))}
                  selected={selected}
                  multiple={multiple}
                  onToggle={toggle}
                />
              )}
              <p className="eyebrow mt-6 text-muted">Built-in website images</p>
              <PickerGrid
                items={builtinImages.map((url) => ({ url, name: fileNameFromUrl(url) }))}
                selected={selected}
                multiple={multiple}
                onToggle={toggle}
              />
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!selected.length || uploading > 0}
            onClick={() => {
              onSelect(selected);
              onClose();
            }}
          >
            {multiple && selected.length > 1 ? `Use ${selected.length} images` : "Use image"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PickerGrid({
  items,
  selected,
  multiple,
  onToggle,
}: {
  items: { url: string; name: string }[];
  selected: string[];
  multiple: boolean;
  onToggle: (url: string) => void;
}) {
  return (
    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      {items.map((item) => {
        const index = selected.indexOf(item.url);
        return (
          <button
            key={item.url}
            type="button"
            onClick={() => onToggle(item.url)}
            title={item.name}
            className={cn(
              "border-2 bg-paper text-left",
              index >= 0 ? "border-olive" : "border-transparent hover:border-line",
            )}
          >
            <span className="relative block aspect-square overflow-hidden bg-cream">
              <AdminThumb src={item.url} alt={item.name} width={128} className="h-full w-full object-cover" />
              {index >= 0 && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-olive text-[0.6rem] text-paper">
                  {multiple ? index + 1 : <Check size={12} />}
                </span>
              )}
            </span>
            <span className="block truncate px-1 py-1 text-[0.55rem] text-muted">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Images, Link2, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminThumb } from "@/components/admin/AdminThumb";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { MEDIA_ACCEPT_CLIENT } from "@/components/admin/media-constants";
import { uploadImage } from "@/lib/upload-client";
import { cn } from "@/lib/utils";

/**
 * Ordered gallery editor for product images. The first image is the primary one.
 * Submits as a newline-separated form field called `name`.
 */
export function ImageListField({
  name,
  label,
  defaultValue = [],
}: {
  name: string;
  label: string;
  defaultValue?: string[];
}) {
  const [images, setImages] = useState<string[]>(defaultValue);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [urlDraft, setUrlDraft] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function add(urls: string[]) {
    setImages((current) => [...current, ...urls.filter((url) => url && !current.includes(url))]);
  }

  function move(index: number, delta: number) {
    setImages((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const list = [...files];
    setUploading(list.length);
    for (const file of list) {
      try {
        const asset = await uploadImage(file);
        add([asset.url]);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed.");
      }
      setUploading((count) => count - 1);
    }
    if (fileInput.current) fileInput.current.value = "";
  }

  return (
    <div>
      <p className="label">{label}</p>
      <input type="hidden" name={name} value={images.join("\n")} />

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {images.map((src, index) => (
          <div key={src} className="group relative aspect-square overflow-hidden border border-line bg-cream">
            <AdminThumb src={src} className="h-full w-full object-cover" />
            {index === 0 && (
              <span className="absolute left-1 top-1 bg-charcoal px-1.5 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.06em] text-ivory">
                Primary
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-charcoal/75 p-1 text-ivory opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
              <button type="button" aria-label="Move left" disabled={index === 0} onClick={() => move(index, -1)} className="p-1 disabled:opacity-30">
                <ArrowLeft size={12} />
              </button>
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => setImages((current) => current.filter((item) => item !== src))}
                className="p-1 hover:text-[#f3b4a6]"
              >
                <Trash2 size={12} />
              </button>
              <button type="button" aria-label="Move right" disabled={index === images.length - 1} onClick={() => move(index, 1)} className="p-1 disabled:opacity-30">
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading > 0}
          className={cn(
            "flex aspect-square flex-col items-center justify-center gap-1 border border-dashed border-line text-[0.58rem] text-muted hover:border-olive hover:text-ink",
          )}
        >
          {uploading > 0 ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading > 0 ? `Uploading ${uploading}…` : "Upload"}
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex aspect-square flex-col items-center justify-center gap-1 border border-dashed border-line text-[0.58rem] text-muted hover:border-olive hover:text-ink"
        >
          <Images size={16} /> Library
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setShowUrl((open) => !open)} className="inline-flex items-center gap-1 text-[0.6rem] text-muted hover:text-ink">
          <Link2 size={12} /> Add by URL
        </button>
        {showUrl && (
          <div className="flex w-full gap-2">
            <input
              value={urlDraft}
              onChange={(event) => setUrlDraft(event.target.value)}
              placeholder="https://… or /images/…"
              className="input font-mono text-[0.65rem]"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  add([urlDraft.trim()]);
                  setUrlDraft("");
                }
              }}
            />
            <button
              type="button"
              className="btn btn-outline !px-3"
              onClick={() => {
                add([urlDraft.trim()]);
                setUrlDraft("");
              }}
            >
              <Plus size={12} /> Add
            </button>
          </div>
        )}
      </div>
      <p className="mt-1.5 text-[0.6rem] leading-5 text-muted">
        Upload as many as you like. The first image is the primary product image; use the arrows to reorder.
      </p>
      {!images.length && <p className="mt-1 text-[0.6rem] text-wine">Add at least one image.</p>}

      <input
        ref={fileInput}
        type="file"
        accept={MEDIA_ACCEPT_CLIENT}
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => void handleFiles(event.target.files)}
      />
      <MediaPicker multiple open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={add} />
    </div>
  );
}

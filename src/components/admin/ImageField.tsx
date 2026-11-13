"use client";

import { useId, useRef, useState } from "react";
import { ImageIcon, Images, Link2, Loader2, RotateCcw, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AdminThumb } from "@/components/admin/AdminThumb";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { MEDIA_ACCEPT_CLIENT } from "@/components/admin/media-constants";
import { uploadImage } from "@/lib/upload-client";
import { cn } from "@/lib/utils";

/**
 * A single image input: preview + upload from device + pick from library + paste URL.
 * Submits its value as a normal form field called `name`.
 */
export function ImageField({
  name,
  label,
  defaultValue = "",
  resetTo,
  required = false,
  hint,
  aspect = "aspect-[4/3]",
  contain = false,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  /** When set, shows a “Restore default” button that puts this value back. */
  resetTo?: string;
  required?: boolean;
  hint?: string;
  aspect?: string;
  contain?: boolean;
}) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function update(next: string) {
    setBroken(false);
    setValue(next);
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const asset = await uploadImage(file);
      update(asset.url);
      toast.success("Image uploaded — remember to save.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div>
      <label htmlFor={`${id}-url`} className="label">{label}</label>
      <input type="hidden" name={name} value={value} />
      <div className="flex gap-3">
        <div
          className={cn(
            "relative w-28 shrink-0 overflow-hidden border border-line sm:w-36",
            aspect,
            contain ? "bg-[repeating-conic-gradient(#f1eadf_0%_25%,#fbf9f4_0%_50%)] bg-[length:16px_16px]" : "bg-cream",
          )}
        >
          {value && !broken ? (
            <AdminThumb
              src={value}
              className={cn("h-full w-full", contain ? "object-contain p-1.5" : "object-cover")}
              onError={() => setBroken(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-[0.55rem] text-muted">
              <ImageIcon size={18} strokeWidth={1.3} />
              {broken ? "Can’t load" : "No image"}
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-paper/75">
              <Loader2 size={18} className="animate-spin" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => fileInput.current?.click()} disabled={uploading} className="btn btn-primary !px-3 !py-2 text-[0.6rem]">
              <Upload size={12} /> Upload
            </button>
            <button type="button" onClick={() => setPickerOpen(true)} className="btn btn-outline !px-3 !py-2 text-[0.6rem]">
              <Images size={12} /> Library
            </button>
            <button type="button" onClick={() => setShowUrl((open) => !open)} className="btn btn-outline !px-3 !py-2 text-[0.6rem]">
              <Link2 size={12} /> URL
            </button>
            {resetTo && value !== resetTo && (
              <button type="button" onClick={() => update(resetTo)} className="btn btn-outline !px-3 !py-2 text-[0.6rem]">
                <RotateCcw size={12} /> Restore default
              </button>
            )}
            {!required && !resetTo && value && (
              <button type="button" onClick={() => update("")} className="btn btn-outline !px-3 !py-2 text-[0.6rem]">
                <X size={12} /> Remove
              </button>
            )}
          </div>
          {showUrl && (
            <input
              id={`${id}-url`}
              value={value}
              onChange={(event) => update(event.target.value.trim())}
              placeholder="https://… or /images/…"
              className="input font-mono text-[0.65rem]"
            />
          )}
          {hint && <p className="text-[0.58rem] leading-4 text-muted">{hint}</p>}
          {required && !value && <p className="text-[0.58rem] text-wine">An image is required.</p>}
        </div>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept={MEDIA_ACCEPT_CLIENT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(urls) => urls[0] && update(urls[0])} />
    </div>
  );
}

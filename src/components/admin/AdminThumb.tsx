"use client";

/* eslint-disable @next/next/no-img-element -- deliberately uses the optimizer URL with a raw-URL fallback */

import { useState } from "react";

/** Widths must be one of next.config `images.imageSizes` / `deviceSizes`. */
type ThumbWidth = 128 | 256 | 384;

/**
 * Small, compressed admin preview. Routes the image through Next's optimizer
 * (WebP/AVIF, resized, CDN-cached) instead of downloading the full original —
 * a 900 KB banner becomes a ~15 KB thumbnail. Falls back to the raw URL if the
 * optimizer can't fetch it (e.g. a plain http:// link).
 */
export function AdminThumb({
  src,
  alt = "",
  width = 256,
  className,
  onError,
}: {
  src: string;
  alt?: string;
  width?: ThumbWidth;
  className?: string;
  onError?: () => void;
}) {
  const optimized = `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=70`;
  const [failed, setFailed] = useState<{ src: string; level: number }>({ src, level: 0 });
  const level = failed.src === src ? failed.level : 0;

  return (
    <img
      src={level === 0 ? optimized : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => {
        if (level === 0) setFailed({ src, level: 1 });
        else onError?.();
      }}
    />
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function parseImages(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return value ? [value] : [];
  }
}

export function discountPercent(price: number, compareAtPrice?: number | null) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : plural ?? `${singular}s`;
}

export function safeRedirectPath(value: unknown, fallback = "/account") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

export const colorSwatches: Record<string, string> = {
  ivory: "#eee8dc",
  "ivory bloom": "#e9e1d2",
  "warm white": "#f0ece3",
  ecru: "#e5dccb",
  oat: "#d8cbb6",
  sand: "#cbb99e",
  "sand stripe": "#cbb99e",
  natural: "#d6c6a8",
  chalk: "#e8e3d8",
  stone: "#b8ad9e",
  taupe: "#9b8e7e",
  clay: "#b77758",
  terracotta: "#a85f42",
  rust: "#9b5237",
  "rust bloom": "#9b5237",
  "rust stripe": "#9b5237",
  olive: "#6a7052",
  "olive stripe": "#6a7052",
  "olive garden": "#6a7052",
  moss: "#667054",
  sage: "#8b9177",
  earth: "#8a6b4e",
  charcoal: "#373733",
  indigo: "#3e4c61",
  "indigo bloom": "#3e4c61",
  "ecru / charcoal": "#b7ad9e",
  champagne: "#d7c7ac",
  "ochre garden": "#b88945",
};

export function swatchColor(color: string) {
  return colorSwatches[color.toLowerCase()] ?? "#b7ad9e";
}

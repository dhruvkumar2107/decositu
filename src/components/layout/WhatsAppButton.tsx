"use client";

import { usePathname } from "next/navigation";
import { storeInfo } from "@/lib/store-info";

/** Builds a wa.me link with a pre-filled message that matches the page the visitor is on. */
function buildMessage(pathname: string) {
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const pageTitle =
    typeof document !== "undefined" ? document.title.replace(/\s*\|\s*Decoritu\s*$/i, "").trim() : "";

  if (pathname.startsWith("/products/") && pageTitle) {
    return `Hi Decoritu, I'm interested in "${pageTitle}". Could you share more details?\n${pageUrl}`;
  }
  if (pathname.startsWith("/collections/") && pageTitle) {
    return `Hi Decoritu, I'm looking at your ${pageTitle} collection and have a question.\n${pageUrl}`;
  }
  if (pathname.startsWith("/order") || pathname.startsWith("/account/orders")) {
    return "Hi Decoritu, I need help with my order.";
  }
  if (pathname.startsWith("/cart") || pathname.startsWith("/checkout")) {
    return "Hi Decoritu, I need some help placing my order.";
  }
  return "Hi Decoritu, I'd like to know more about your curtains, blinds, wallpapers and mattresses.";
}

export function WhatsAppButton() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return null;

  const baseHref = `https://wa.me/${storeInfo.whatsapp}`;

  return (
    <a
      href={baseHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Decoritu on WhatsApp"
      onClick={(event) => {
        // Resolve the message at click time so it reflects the current page title and URL.
        event.currentTarget.href = `${baseHref}?text=${encodeURIComponent(buildMessage(pathname))}`;
      }}
      className="group fixed bottom-5 right-5 z-[80] flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-transform hover:scale-105 focus-visible:outline-offset-4 sm:bottom-6 sm:right-6"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C8.82 3 3 8.82 3 16c0 2.293.6 4.533 1.74 6.507L3 29l6.66-1.713A12.95 12.95 0 0 0 16.004 29C23.18 29 29 23.18 29 16S23.18 3 16.004 3Zm0 23.64c-2.04 0-4.04-.547-5.787-1.587l-.413-.246-3.953 1.02 1.053-3.853-.267-.4A10.6 10.6 0 0 1 5.36 16c0-5.867 4.773-10.64 10.644-10.64 5.866 0 10.64 4.773 10.64 10.64 0 5.866-4.774 10.64-10.64 10.64Zm5.84-7.973c-.32-.16-1.893-.934-2.187-1.04-.293-.107-.506-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.353-.5-2.573-1.587-.954-.85-1.6-1.9-1.787-2.22-.187-.32-.02-.493.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.106-.213.053-.4-.027-.56-.08-.16-.72-1.734-.987-2.374-.26-.624-.524-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667 0 1.573 1.147 3.093 1.307 3.307.16.213 2.253 3.44 5.46 4.826.763.33 1.358.527 1.822.674.766.244 1.463.21 2.014.127.614-.092 1.893-.774 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.134-.293-.214-.613-.374Z" />
      </svg>
      <span className="hidden pr-1 text-[0.72rem] font-semibold tracking-[0.04em] sm:group-hover:inline">
        Chat with us
      </span>
    </a>
  );
}

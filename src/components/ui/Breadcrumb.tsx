"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href: string;
  current?: boolean;
};

export function Breadcrumb({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  return (
    <nav
      className="flex flex-wrap items-center gap-2 text-[0.63rem] uppercase tracking-[0.12em] text-muted"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        if (item.current) {
          return (
            <span key={index} className="text-ink">
              {item.label}
            </span>
          );
        }
        return (
          <Link
            key={index}
            href={item.href}
            className="transition-colors hover:text-ink"
          >
            {item.label}
          </Link>
        );
      })}
      {items.length > 1 && (
        <ChevronRight size={11} className="opacity-60" />
      )}
    </nav>
  );
}
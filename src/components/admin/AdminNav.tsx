"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BadgePercent,
  Boxes,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  Settings,
  Star,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: Home },
  { href: "/admin/coupons", label: "Coupons", icon: BadgePercent },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <div className="border border-line bg-paper p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal font-display text-base text-ivory">
            {initials(name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">{name}</p>
            <p className="text-[0.57rem] uppercase tracking-[0.1em] text-olive">Administrator</p>
          </div>
        </div>
      </div>

      <nav className="mt-3 flex gap-1 overflow-x-auto border border-line bg-paper p-2 hide-scrollbar lg:flex-col" aria-label="Admin navigation">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 px-3 py-2.5 text-[0.67rem] font-medium transition-colors lg:shrink",
                active ? "bg-charcoal text-ivory" : "text-muted hover:bg-cream hover:text-ink",
              )}
            >
              <link.icon size={14} strokeWidth={1.5} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-3 hidden border border-line bg-paper p-2 lg:block">
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2.5 text-[0.67rem] text-muted hover:text-ink">
          <ArrowUpRight size={14} /> View storefront
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-[0.67rem] text-muted hover:text-wine"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Settings,
  Star,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";

const links = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/wishlist", label: "Saved pieces", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/reviews", label: "My reviews", icon: Star },
  { href: "/account/settings", label: "Account settings", icon: Settings },
];

export function AccountNav({
  user,
}: {
  user: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div>
      <div className="border border-line bg-paper p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-olive font-display text-lg text-ivory">
            {initials(user.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-xl leading-tight">{user.name}</p>
            <p className="truncate text-[0.65rem] text-muted">{user.email}</p>
          </div>
        </div>
        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="mt-4 block border border-olive/30 bg-olive/5 px-3 py-2 text-center text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-olive"
          >
            Open admin dashboard
          </Link>
        )}
      </div>

      <nav className="mt-4 flex gap-1 overflow-x-auto border border-line bg-paper p-2 hide-scrollbar lg:flex-col" aria-label="Account navigation">
        {links.map((link) => {
          const active =
            link.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 px-3 py-2.5 text-[0.68rem] font-medium transition-colors lg:shrink",
                active ? "bg-cream text-ink" : "text-muted hover:bg-cream/60 hover:text-ink",
              )}
            >
              <link.icon size={15} strokeWidth={1.5} />
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={signOut}
          className="flex shrink-0 items-center gap-2.5 px-3 py-2.5 text-left text-[0.68rem] font-medium text-muted transition-colors hover:bg-cream/60 hover:text-wine lg:shrink"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Sign out
        </button>
      </nav>
    </div>
  );
}

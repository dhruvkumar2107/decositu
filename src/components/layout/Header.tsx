"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SearchModal } from "@/components/layout/SearchModal";
import { useStore } from "@/components/providers/StoreProvider";
import type { SessionUser } from "@/lib/auth";
import { cn, formatPrice } from "@/lib/utils";

type NavCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
};

const primaryLinks = [
  { label: "Bedding", href: "/collections/bedding" },
  { label: "Curtains", href: "/collections/curtains" },
  { label: "Dohars", href: "/collections/dohars" },
  { label: "Cushions", href: "/collections/cushions" },
  { label: "Rugs", href: "/collections/rugs" },
  { label: "Inspiration", href: "/inspiration" },
];

export function Header({
  categories,
  user,
  shippingThreshold,
  returnWindow,
}: {
  categories: NavCategory[];
  user: SessionUser | null;
  shippingThreshold: number;
  returnWindow: number;
}) {
  const pathname = usePathname();
  const { cartCount, wishlistCount, isReady } = useStore();
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  return (
    <header
      className="sticky top-0 z-50 border-b border-line/80 bg-ivory/94 backdrop-blur-xl"
      onMouseLeave={() => setMegaOpen(false)}
    >
      <div className="container-luxe grid h-[70px] grid-cols-[1fr_auto_1fr] items-center lg:h-[78px]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={21} strokeWidth={1.4} />
          </button>
          <div className="hidden lg:block">
            <Logo />
          </div>
        </div>

        <div className="lg:hidden">
          <Logo compact />
        </div>

        <nav className="hidden items-center justify-center gap-5 xl:gap-7 lg:flex" aria-label="Main navigation">
          <div className="relative">
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:text-olive",
                megaOpen && "text-olive",
              )}
              onClick={() => setMegaOpen((open) => !open)}
              onMouseEnter={() => setMegaOpen(true)}
              aria-expanded={megaOpen}
              aria-controls="shop-mega-menu"
            >
              Shop <ChevronDown size={12} className={cn("transition-transform", megaOpen && "rotate-180")} />
            </button>
          </div>
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "link-underline py-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:text-olive",
                pathname.startsWith(link.href) && "text-olive",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/collections/sale"
            className={cn(
              "py-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-clay transition-colors hover:text-ink",
              pathname === "/collections/sale" && "text-wine",
            )}
          >
            Sale
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-0.5 sm:gap-1.5">
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-charcoal hover:text-ivory"
            >
              Admin studio
            </Link>
          )}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-cream"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search size={19} strokeWidth={1.4} />
          </button>
          <Link
            href={user ? "/account" : "/login"}
            className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-cream sm:inline-flex"
            aria-label={user ? "Your account" : "Sign in"}
          >
            <UserRound size={19} strokeWidth={1.4} />
          </Link>
          <Link
            href="/wishlist"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-cream"
            aria-label={`Saved pieces${isReady ? ` (${wishlistCount})` : ""}`}
          >
            <Heart size={19} strokeWidth={1.4} />
            {isReady && wishlistCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[0.58rem] font-semibold text-ivory">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-cream"
            aria-label={`Shopping bag${isReady ? ` (${cartCount})` : ""}`}
          >
            <ShoppingBag size={19} strokeWidth={1.4} />
            {isReady && cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive px-1 text-[0.58rem] font-semibold text-ivory">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {megaOpen && (
        <div
          id="shop-mega-menu"
          className="absolute inset-x-0 top-full hidden border-t border-line/70 bg-ivory shadow-[0_24px_60px_rgba(43,42,37,0.12)] lg:block"
          onMouseEnter={() => setMegaOpen(true)}
        >
          <div className="container-luxe grid grid-cols-[1fr_1.4fr_0.9fr] gap-12 py-10">
            <div>
              <p className="eyebrow text-muted">Shop by room</p>
              <div className="mt-5 space-y-3">
                {[
                  { label: "The bedroom", href: "/inspiration#bedroom" },
                  { label: "The living room", href: "/inspiration#living-room" },
                  { label: "The dining room", href: "/inspiration#dining-room" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between border-b border-line/70 py-2.5 font-display text-xl transition-colors hover:text-olive"
                  >
                    {item.label}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
              <Link href="/inspiration" className="link-underline mt-5 inline-flex text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
                Explore all inspiration
              </Link>
            </div>

            <div>
              <p className="eyebrow text-muted">The full collection</p>
              <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3.5">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/collections/${category.slug}`}
                    className="group py-1.5 text-sm transition-colors hover:text-olive"
                  >
                    <span className="border-b border-transparent transition-colors group-hover:border-olive/40">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/collections/new-arrivals" className="link-underline mt-6 inline-flex text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
                New arrivals
              </Link>
            </div>

            <Link href="/collections/bestsellers" className="group relative min-h-[240px] overflow-hidden bg-cream">
              <Image
                src="/images/dohar-02.jpg"
                alt="Layered bedding in warm natural tones"
                fill
                sizes="300px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                <p className="eyebrow text-ivory/70">Most loved</p>
                <p className="mt-2 font-display text-3xl leading-none">The bestsellers edit</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button
            type="button"
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <div className="animate-slide-in absolute inset-y-0 left-0 flex w-[90%] max-w-[390px] flex-col overflow-y-auto bg-ivory shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-5">
              <Logo compact />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 pt-7">
              <p className="eyebrow text-muted">Explore Decoritu</p>
              <nav className="mt-4" aria-label="Mobile navigation">
                {[
                  { label: "New arrivals", href: "/collections/new-arrivals" },
                  { label: "Bestsellers", href: "/collections/bestsellers" },
                  ...primaryLinks,
                  { label: "Sale", href: "/collections/sale" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between border-b border-line/70 py-4 font-display text-[1.7rem] leading-none"
                  >
                    {link.label}
                    <ArrowRight size={16} className="text-muted" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="px-5 py-7">
              <p className="eyebrow text-muted">Shop by category</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/collections/${category.slug}`}
                    className="border border-line px-3 py-3 text-xs leading-snug transition-colors hover:bg-cream"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto border-t border-line px-5 py-6">
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="mb-4 flex items-center justify-between rounded border border-olive/30 bg-olive/10 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-olive"
                >
                  Admin studio <span>→</span>
                </Link>
              )}
              <Link href={user ? "/account" : "/login"} className="flex items-center gap-3 text-sm">
                <UserRound size={18} strokeWidth={1.4} />
                {user ? `Hello, ${user.name.split(" ")[0]}` : "Sign in or create an account"}
              </Link>
              <p className="mt-4 text-[0.7rem] leading-relaxed text-muted">
                {shippingThreshold > 0 ? `Complimentary shipping over ${formatPrice(shippingThreshold)}` : "Complimentary shipping on all orders"} · Secure checkout · {returnWindow}-day returns
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

import Link from "next/link";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

type FooterCategory = {
  id: string;
  name: string;
  slug: string;
};

export function Footer({
  categories,
  settings,
}: {
  categories: FooterCategory[];
  settings: Record<string, string>;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-ivory">
      <div className="container-luxe">
        <div className="grid gap-12 border-b border-ivory/12 py-16 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr] lg:gap-16 lg:py-20">
          <div>
            <Logo light />
            <p className="mt-6 max-w-xs font-display text-3xl leading-[1.05] text-ivory/90">
              Considered things for beautiful living.
            </p>
            <p className="mt-5 max-w-xs text-sm leading-7 text-ivory/70">
              A considered edit of bedding, curtains and objects for the home — chosen for texture,
              warmth and the way they make a room feel.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Decoritu on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/25 transition-colors hover:bg-ivory hover:text-ink"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://www.pinterest.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Decoritu on Pinterest"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/25 text-[0.72rem] font-semibold transition-colors hover:bg-ivory hover:text-ink"
              >
                P
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow text-ivory/75">Shop</p>
            <ul className="mt-5 space-y-2.5 text-sm text-ivory/80">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link href={`/collections/${category.slug}`} className="transition-colors hover:text-ivory">
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/collections/new-arrivals" className="transition-colors hover:text-ivory">
                  New arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections/sale" className="transition-colors hover:text-ivory">
                  The quiet sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-ivory/75">Help</p>
            <ul className="mt-5 space-y-2.5 text-sm text-ivory/80">
              {[
                ["Contact us", "/contact"],
                ["Shipping & returns", "/shipping-returns"],
                ["Care guide", "/care-guide"],
                ["FAQs", "/faq"],
                ["Track an order", "/account/orders"],
                ["Admin studio", "/admin"],
                ["Privacy policy", "/privacy"],
                ["Terms", "/terms"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-ivory">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-ivory/75">The Decoritu letter</p>
            <p className="mt-4 font-display text-2xl leading-tight">A slower kind of inbox.</p>
            <p className="mt-2 text-xs leading-6 text-ivory/70">
              New collections, room notes and a little inspiration — never noise.
            </p>
            <div className="mt-5">
              <NewsletterForm tone="dark" />
            </div>
            <div className="mt-7 space-y-2.5 text-xs text-ivory/70">
              <p className="flex items-center gap-2.5">
                <Mail size={13} /> {settings.supportEmail}
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={13} /> {settings.supportHours}
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin size={13} /> Jaipur, India
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-ivory/12 py-5">
          <p className="text-center text-[0.68rem] leading-5 text-ivory/70">
            {settings.demoNote}
          </p>
        </div>

        <div className="flex flex-col gap-4 py-6 text-[0.68rem] text-ivory/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Decoritu. All rights reserved.</p>
          <p className="max-w-xl leading-5">
            Photography sourced from Unsplash under the Unsplash License. Product catalogue shown for preview.
          </p>
          <p className="tracking-[0.12em]">UPI · Cards · Net banking · COD</p>
        </div>
      </div>
    </footer>
  );
}

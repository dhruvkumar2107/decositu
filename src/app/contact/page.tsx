import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, PackageSearch } from "lucide-react";
import { ContentHeader } from "@/components/content/ContentHeader";
import { ContactForm } from "@/components/content/ContactForm";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions about an order, a fabric or a room? Reach the Decoritu customer care team.",
  alternates: { canonical: "/contact" },
};

const shortcuts = [
  { href: "/faq", label: "Read the FAQs", detail: "Quick answers on delivery, returns and care." },
  { href: "/account/orders", label: "Track an order", detail: "View status and updates in your account." },
  { href: "/shipping-returns", label: "Shipping & returns", detail: "Timelines, charges and the returns process." },
];

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <ContentHeader
        eyebrow="Customer care"
        title="A real person, at the other end."
        description="Whether it is a question about a weave, an order in transit or styling a room, write to us. We read every message and reply with care."
        image="/images/story-craft.jpg"
        imageAlt="Hands working with natural fabric in the Decoritu studio"
      />

      <div className="container-luxe py-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <aside>
            <p className="eyebrow text-muted">Reach us</p>
            <div className="mt-6 space-y-5">
              <div className="flex gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-olive" strokeWidth={1.5} />
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted">Email</p>
                  <a href={`mailto:${settings.supportEmail}`} className="mt-1 block text-sm hover:text-olive">
                    {settings.supportEmail}
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-olive" strokeWidth={1.5} />
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted">Support hours</p>
                  <p className="mt-1 text-sm">{settings.supportHours}</p>
                  <p className="text-[0.62rem] text-muted">Replies within one business day.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-olive" strokeWidth={1.5} />
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted">Studio</p>
                  <p className="mt-1 text-sm">Jaipur, Rajasthan, India</p>
                  <p className="text-[0.62rem] text-muted">No walk-in retail at present. Please write before visiting.</p>
                </div>
              </div>
            </div>

            <div className="mt-9 border-t border-line pt-6">
              <p className="eyebrow text-muted">Before you write</p>
              <div className="mt-4 space-y-3">
                {shortcuts.map((item) => (
                  <Link key={item.href} href={item.href} className="group block border border-line p-3.5 transition-colors hover:border-charcoal">
                    <p className="flex items-center gap-2 text-xs font-medium">
                      <PackageSearch size={13} className="text-olive" /> {item.label}
                    </p>
                    <p className="mt-1 text-[0.62rem] leading-5 text-muted">{item.detail}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <p className="eyebrow text-muted">Write to us</p>
            <h2 className="display mt-3 text-4xl">What can we help with?</h2>
            <p className="mt-3 max-w-lg text-xs leading-6 text-muted">
              Include your order number if your question is about an existing order. For fabric and
              styling questions, a little context about the room helps us answer well.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

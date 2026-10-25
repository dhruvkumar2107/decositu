import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock3, Package, RotateCcw, Truck } from "lucide-react";
import { ContentHeader } from "@/components/content/ContentHeader";
import { getSettings, shippingConfig } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shipping & returns",
  description: "Delivery timelines, shipping charges, cancellations and the Decoritu returns process.",
  alternates: { canonical: "/shipping-returns" },
};

export default async function ShippingReturnsPage() {
  const settings = await getSettings();
  const shipping = shippingConfig(settings);
  const returnDays = settings.returnWindow;

  return (
    <>
      <ContentHeader
        eyebrow="Delivery & aftercare"
        title="From our hands to your home."
        description="Everything you need to know about dispatch, delivery, cancellations and returns — written plainly, without the small print surprises."
        image="/images/decor-06.jpg"
        imageAlt="A considered home interior styled with natural textures"
      />

      <section className="border-b border-line bg-paper">
        <div className="container-luxe grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, label: "Free shipping", value: `On orders over ${formatPrice(shipping.threshold)}` },
            { icon: Package, label: "Standard delivery", value: "3–7 business days" },
            { icon: RotateCcw, label: "Returns window", value: `${returnDays} days from delivery` },
            { icon: Clock3, label: "Support", value: settings.supportHours },
          ].map((item) => (
            <div key={item.label} className="flex gap-3">
              <item.icon size={16} className="mt-0.5 shrink-0 text-olive" strokeWidth={1.5} />
              <div>
                <p className="text-[0.57rem] font-semibold uppercase tracking-[0.1em] text-muted">{item.label}</p>
                <p className="mt-1 text-xs leading-5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="container-luxe py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.48fr_1.52fr] lg:gap-20">
          <nav aria-label="Policy sections" className="lg:sticky lg:top-[130px] lg:self-start">
            <p className="eyebrow text-muted">On this page</p>
            <div className="mt-4 space-y-1">
              {[
                ["Dispatch", "dispatch"],
                ["Delivery & charges", "delivery"],
                ["Cancellations", "cancellations"],
                ["Returns", "returns"],
                ["Refunds", "refunds"],
                ["Damaged orders", "damaged"],
              ].map(([label, id]) => (
                <a key={id} href={`#${id}`} className="block border-b border-line py-2.5 text-xs text-muted transition-colors hover:text-ink">
                  {label}
                </a>
              ))}
            </div>
          </nav>

          <div className="max-w-3xl space-y-12">
            <section id="dispatch" className="scroll-mt-28">
              <p className="eyebrow text-muted">01</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">Dispatch</h2>
              <p className="mt-3 text-xs leading-6 text-muted">
                In-stock pieces are usually packed and handed to our delivery partner within 1–2
                business days. Orders placed on Sundays or public holidays begin processing the next
                business day. If an item needs extra preparation, the product page will say so.
              </p>
              <p className="mt-3 text-xs leading-6 text-muted">
                We pack with recycled and recyclable materials wherever possible. Please reuse or
                recycle the packaging responsibly.
              </p>
            </section>

            <section id="delivery" className="scroll-mt-28">
              <p className="eyebrow text-muted">02</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">Delivery & charges</h2>
              <div className="mt-4 border border-line bg-paper">
                <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-line px-4 py-3 text-xs">
                  <span>Orders of {formatPrice(shipping.threshold)} or more</span>
                  <span className="font-semibold text-olive">Free</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 text-xs">
                  <span>Orders below {formatPrice(shipping.threshold)}</span>
                  <span className="font-semibold">{formatPrice(shipping.fee)}</span>
                </div>
              </div>
              <p className="mt-3 text-xs leading-6 text-muted">
                Standard delivery takes 3–7 business days after dispatch, depending on your PIN code.
                Remote areas and large rug shipments may take longer. We currently deliver within India
                only.
              </p>
              <p className="mt-3 text-xs leading-6 text-muted">
                Please provide a complete address and a reachable phone number. If a courier cannot
                deliver after reasonable attempts, the parcel may be returned to us; re-shipping charges
                may apply.
              </p>
            </section>

            <section id="cancellations" className="scroll-mt-28">
              <p className="eyebrow text-muted">03</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">Cancellations</h2>
              <p className="mt-3 text-xs leading-6 text-muted">
                You can cancel an order while it is still marked <strong className="font-semibold text-ink">Processing</strong>.
                Use the cancel option on your order page, or write to us with your order number. Once
                the order has been dispatched, it can no longer be cancelled; please use the returns
                process instead.
              </p>
              <p className="mt-3 text-xs leading-6 text-muted">
                Prepaid cancellations are refunded to the original payment method. Cash-on-delivery
                orders can be cancelled at no charge before dispatch.
              </p>
            </section>

            <section id="returns" className="scroll-mt-28">
              <p className="eyebrow text-muted">04</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">Returns</h2>
              <p className="mt-3 text-xs leading-6 text-muted">
                We accept returns within <strong className="font-semibold text-ink">{returnDays} days of delivery</strong> for
                unused, unwashed items in their original packaging, with tags and any included
                accessories. Start a return from your account or contact us with your order number.
              </p>
              <ul className="mt-4 space-y-2.5">
                {[
                  "The item must be unused, unwashed and free of stains, odours and pet hair.",
                  "Original packaging, tags and any fabric belts or inserts must be included.",
                  "Made-to-order, cut-to-size and personalised pieces are not returnable unless faulty.",
                  "Return shipping may be deducted from the refund for change-of-mind returns.",
                  "We will share pickup or drop-off instructions once your request is approved.",
                ].map((point) => (
                  <li key={point} className="flex gap-2.5 text-xs leading-6 text-muted">
                    <Check size={14} className="mt-1 shrink-0 text-olive" /> {point}
                  </li>
                ))}
              </ul>
            </section>

            <section id="refunds" className="scroll-mt-28">
              <p className="eyebrow text-muted">05</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">Refunds</h2>
              <p className="mt-3 text-xs leading-6 text-muted">
                Returns are inspected when they reach us. Once approved, refunds are initiated within
                3–5 business days. Prepaid amounts return to the original payment method and may take
                a further 5–7 business days to appear, depending on your bank. Cash-on-delivery refunds
                are made by bank transfer to details you provide.
              </p>
            </section>

            <section id="damaged" className="scroll-mt-28">
              <p className="eyebrow text-muted">06</p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">Damaged or incorrect orders</h2>
              <p className="mt-3 text-xs leading-6 text-muted">
                Please inspect your order on arrival. If something is damaged, faulty or not what you
                ordered, contact us within 48 hours with photographs of the item, packaging and
                shipping label. Keep the packaging until the issue is resolved. We will arrange a
                replacement or refund as quickly as we can.
              </p>
            </section>

            <div className="border-t border-line pt-8">
              <p className="font-display text-3xl">Need help with an order?</p>
              <p className="mt-2 text-xs leading-6 text-muted">
                Send us your order number and a short description. We will take it from there.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/contact" className="btn btn-primary">Contact care <ArrowRight size={14} /></Link>
                <Link href="/account/orders" className="btn btn-outline">Track an order</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

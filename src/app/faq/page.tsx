import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { ContentHeader } from "@/components/content/ContentHeader";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about Decoritu orders, shipping, returns, fabrics and payments.",
  alternates: { canonical: "/faq" },
};

const groups = (returnWindow: number) => [
  {
    title: "Orders & delivery",
    items: [
      {
        q: "How long will my order take to arrive?",
        a: "Ready-to-ship pieces are usually dispatched within 1–2 business days. Standard delivery then takes 3–7 business days depending on your PIN code. Made-to-order or large rug shipments can take longer; the product page will say so before you order.",
      },
      {
        q: "Can I track my order?",
        a: "Yes. Signed-in customers can follow every update under Account → Orders. If you checked out as a guest, use the private confirmation link shown after placing the order, or write to us with your order number.",
      },
      {
        q: "Do you deliver across India?",
        a: "We currently deliver to serviceable PIN codes across India. If your PIN code is not serviceable, our team will contact you and any prepaid amount will be refunded in full.",
      },
      {
        q: "Can I change my delivery address after ordering?",
        a: "Write to us as soon as possible. We can usually update the address before dispatch. Once a parcel is with the courier, a change may not be possible.",
      },
    ],
  },
  {
    title: "Returns & refunds",
    items: [
      {
        q: "What is your returns window?",
        a: `Unused, unwashed pieces in their original packaging can be returned within ${returnWindow} days of delivery. Please start the request from your account or contact us with your order number. Made-to-order and cut-to-size items are not eligible unless faulty.`,
      },
      {
        q: "What if my order arrives damaged or incorrect?",
        a: "Tell us within 48 hours of delivery with photographs of the item, packaging and shipping label. We will arrange a replacement or refund. Please keep the packaging until the issue is resolved.",
      },
      {
        q: "How long do refunds take?",
        a: "Once the returned item passes inspection, refunds are initiated within 3–5 business days. Prepaid refunds return to the original payment method and may take a further 5–7 business days to appear, depending on your bank.",
      },
      {
        q: "Can I cancel an order?",
        a: "Orders can be cancelled while they are still marked Processing. Use the cancel option on the order page. After dispatch, please use the returns process instead.",
      },
    ],
  },
  {
    title: "Fabric, care & sizing",
    items: [
      {
        q: "Are your products photographed in natural light?",
        a: "Yes, we photograph in natural light without heavy colour correction. Screens vary, so slight differences in tone are normal. If colour matching is critical, ask us for an extra photograph before ordering.",
      },
      {
        q: "Do you send fabric swatches?",
        a: "For larger orders and interior projects, we can arrange swatches where available. Write to us with the products you are considering and your timeline.",
      },
      {
        q: "How should I care for linen and cotton?",
        a: "Wash separately in cold water on a gentle cycle with a mild detergent. Avoid bleach and harsh whiteners. Line dry in shade and iron while slightly damp. Our Care Guide has detailed guidance for every material.",
      },
      {
        q: "Will natural fibres vary slightly?",
        a: "Yes. Slubs, tonal variation and minor weave irregularities are part of what makes natural textiles beautiful. We do not treat these as defects, but we will always help if something feels wrong.",
      },
    ],
  },
  {
    title: "Payments & preview",
    items: [
      {
        q: "Which payment methods do you accept?",
        a: "Online payment via UPI, cards and net banking is supported through Razorpay when live payment keys are configured. Cash on delivery is available for eligible PIN codes and order values.",
      },
      {
        q: "Is the catalogue real?",
        a: "This site currently shows a sample catalogue and pricing for preview. Where demo mode is enabled, no live payment is captured. Please treat product names, availability and editorial content as illustrative until launch.",
      },
      {
        q: "Is my payment information secure?",
        a: "Card and UPI details are handled by the payment provider, not stored by Decoritu. We store only the order and payment reference needed to service your purchase.",
      },
      {
        q: "Do you offer trade or bulk pricing?",
        a: "Yes, for interior designers, hospitality projects and bulk gifting. Write to us with quantities, timelines and delivery locations and we will respond with availability and pricing.",
      },
    ],
  },
];

export default async function FaqPage() {
  const settings = await getSettings();
  const returnWindow = Number(settings.returnWindow) || 7;
  const faqGroups = groups(returnWindow);

  return (
    <>
      <ContentHeader
        eyebrow="Help centre"
        title="Questions, answered."
        description="Practical answers about delivery, returns, natural fabrics and paying for your order. If yours is not here, our care team is a short note away."
        image="/images/bedding-06.jpg"
        imageAlt="Folded natural linen bedding"
      />

      <div className="container-luxe py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20">
          <nav aria-label="FAQ sections" className="lg:sticky lg:top-[130px] lg:self-start">
            <p className="eyebrow text-muted">On this page</p>
            <div className="mt-4 space-y-1">
              {faqGroups.map((group, index) => (
                <a key={group.title} href={`#faq-${index + 1}`} className="block border-b border-line py-2.5 text-xs text-muted transition-colors hover:text-ink">
                  {group.title}
                </a>
              ))}
            </div>
            <div className="mt-8 border border-line bg-paper p-4">
              <p className="font-display text-2xl">Still wondering?</p>
              <p className="mt-2 text-[0.65rem] leading-5 text-muted">Write to customer care and we will reply within one business day.</p>
              <Link href="/contact" className="mt-4 inline-flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-olive">
                Contact us <ArrowRight size={12} />
              </Link>
            </div>
          </nav>

          <div className="space-y-12">
            {faqGroups.map((group, index) => (
              <section key={group.title} id={`faq-${index + 1}`} className="scroll-mt-28">
                <h2 className="display text-3xl">{group.title}</h2>
                <div className="mt-5 divide-y divide-line border-y border-line">
                  {group.items.map((item) => (
                    <details key={item.q} className="group">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-4">
                        <span className="text-sm font-medium leading-6">{item.q}</span>
                        <span className="mt-0.5 shrink-0 text-muted">
                          <Plus size={15} className="group-open:hidden" />
                          <Minus size={15} className="hidden group-open:block" />
                        </span>
                      </summary>
                      <p className="pb-5 pr-8 text-xs leading-6 text-muted">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

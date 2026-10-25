import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/content/LegalLayout";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms that apply when you browse Decoritu, create an account or place an order.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const settings = await getSettings();

  return (
    <LegalLayout
      title="Terms of use"
      description="These terms govern your use of the Decoritu website and any purchase you make through it. Please read them before ordering."
      updated="25 October 2026"
      contactEmail={settings.supportEmail}
      sections={[
        {
          id: "agreement",
          title: "Agreement to these terms",
          content: (
            <>
              <p>
                By accessing this website, creating an account or placing an order, you agree to these
                Terms of use and our <Link href="/privacy">Privacy policy</Link>. If you do not agree,
                please do not use the site.
              </p>
              <p>
                References to “Decoritu”, “we”, “us” or “our” mean the operator of this store. References
                to “you” mean the person browsing, registering or purchasing.
              </p>
            </>
          ),
        },
        {
          id: "preview",
          title: "Preview catalogue",
          content: (
            <>
              <p>
                This site may currently operate in preview or demo mode. Product names, descriptions,
                prices, stock and editorial content may be illustrative, and live payment may be
                disabled. Any preview disclosure shown on the site or at checkout forms part of these
                terms.
              </p>
              <p>
                We aim to describe products accurately, but natural materials vary in colour, texture
                and finish. Photographs are indicative. If a material detail is critical to your
                decision, ask us before ordering.
              </p>
            </>
          ),
        },
        {
          id: "accounts",
          title: "Accounts & eligibility",
          content: (
            <>
              <p>
                You must be at least 18 years old and legally able to enter into a contract to place an
                order. You are responsible for the accuracy of the information you provide and for
                keeping your password confidential.
              </p>
              <p>
                Do not share your account or use another person’s account without permission. Tell us
                promptly if you suspect unauthorised access. We may suspend or close accounts used for
                fraud, abuse or repeated policy breaches.
              </p>
              <p>
                You may check out as a guest. Guest orders can be accessed through the private
                confirmation link and token shown after purchase; keep that link confidential.
              </p>
            </>
          ),
        },
        {
          id: "orders",
          title: "Orders & acceptance",
          content: (
            <>
              <p>
                An order is an offer to buy. Our order confirmation acknowledges receipt but does not
                by itself mean the order has been accepted. Acceptance occurs when we dispatch the
                goods or otherwise confirm acceptance in writing.
              </p>
              <p>
                We may decline or cancel an order where an item is unavailable, a price or description
                error is material, payment is not authorised, delivery is not serviceable, or we
                reasonably suspect fraud. If we cancel after payment, we will refund the amount paid.
              </p>
              <p>
                Please review your delivery details before placing an order. We are not responsible for
                delays or failed delivery caused by incomplete or incorrect information.
              </p>
            </>
          ),
        },
        {
          id: "pricing",
          title: "Pricing & payment",
          content: (
            <>
              <p>
                Prices are shown in Indian rupees. Shipping, discounts and any applicable taxes are
                calculated at checkout before you confirm payment. We may change prices and promotions
                at any time, but changes do not affect orders already accepted.
              </p>
              <p>
                Online payments are processed by a third-party payment provider. By paying, you also
                agree to that provider’s terms. We do not store card, UPI or net-banking credentials.
                Cash on delivery may be available for eligible orders and PIN codes.
              </p>
              <p>
                Coupons are subject to their stated conditions, minimum order values, usage limits and
                expiry. Coupons cannot be combined unless we say so, and may be withdrawn for misuse.
              </p>
            </>
          ),
        },
        {
          id: "delivery",
          title: "Delivery, returns & cancellations",
          content: (
            <>
              <p>
                Delivery timelines are estimates, not guarantees. Risk in the goods passes to you on
                delivery. Please inspect your order promptly and report damage or incorrect items
                within 48 hours.
              </p>
              <p>
                Cancellation, shipping charges and returns are governed by our{" "}
                <Link href="/shipping-returns">Shipping & returns policy</Link>, which forms part of
                these terms. Nothing in these terms limits rights you have under applicable consumer
                law.
              </p>
            </>
          ),
        },
        {
          id: "reviews",
          title: "Reviews & communications",
          content: (
            <>
              <p>
                You may submit reviews only for products you have genuinely purchased and received.
                Reviews are moderated. We may decline or remove content that is unlawful, misleading,
                abusive, contains personal data about others, or is unrelated to the product.
              </p>
              <p>
                By submitting a review, you grant us a non-exclusive, royalty-free licence to display
                and reproduce it on the site and in related marketing, with your first name as shown.
                You are responsible for the content you submit.
              </p>
              <p>
                Marketing emails are sent only with consent and include an unsubscribe option.
                Transactional messages about orders are not marketing and may still be sent.
              </p>
            </>
          ),
        },
        {
          id: "ip",
          title: "Intellectual property",
          content: (
            <>
              <p>
                The Decoritu name, logo, site design, copy, product photography and other content are
                owned by us or licensed to us. You may browse, share links and print pages for personal,
                non-commercial use.
              </p>
              <p>
                You may not copy, scrape, republish or use our content or images for commercial purposes
                without written permission. Third-party photography is used under the applicable
                licence and remains the property of its owners.
              </p>
            </>
          ),
        },
        {
          id: "acceptable-use",
          title: "Acceptable use",
          content: (
            <>
              <p>You agree not to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>use the site for unlawful, fraudulent or harmful purposes;</li>
                <li>attempt to access accounts, systems or data you are not authorised to access;</li>
                <li>interfere with security features, rate limits or the availability of the site;</li>
                <li>introduce malware or use automated tools to scrape or overload the service;</li>
                <li>impersonate another person or misrepresent your affiliation.</li>
              </ul>
              <p>
                We may restrict or terminate access where we reasonably believe these rules have been
                breached, and may report unlawful activity to the authorities.
              </p>
            </>
          ),
        },
        {
          id: "liability",
          title: "Disclaimers & liability",
          content: (
            <>
              <p>
                The site is provided on an “as available” basis. We do not warrant uninterrupted access
                or that every description, price or stock indication is free from error, though we take
                reasonable care to keep them accurate.
              </p>
              <p>
                To the extent permitted by law, we are not liable for indirect or consequential loss,
                loss of profits, or loss arising from events beyond our reasonable control. Nothing in
                these terms excludes liability that cannot lawfully be excluded, including liability for
                death or personal injury caused by negligence, or your statutory consumer rights.
              </p>
              <p>
                Where liability is not excluded, our aggregate liability arising from an order is
                limited to the amount you paid for that order.
              </p>
            </>
          ),
        },
        {
          id: "law",
          title: "Governing law & changes",
          content: (
            <>
              <p>
                These terms are governed by the laws of India. Subject to applicable consumer law,
                courts in Jaipur, Rajasthan have exclusive jurisdiction over disputes arising from use
                of the site or these terms.
              </p>
              <p>
                We may update these terms from time to time. The revised version applies from the date
                shown above. If any provision is found unenforceable, the remaining provisions continue
                in effect.
              </p>
              <p>
                Questions? Write to <a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a> or use our{" "}
                <Link href="/contact">contact page</Link>.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

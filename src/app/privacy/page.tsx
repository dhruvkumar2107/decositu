import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/content/LegalLayout";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Decoritu collects, uses, shares and protects personal data, and the choices available to you.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <LegalLayout
      title="Privacy policy"
      description="We collect only what we need to run the store, fulfil your order and improve the experience. This policy explains what that means in practice."
      updated="25 October 2026"
      contactEmail={settings.supportEmail}
      sections={[
        {
          id: "scope",
          title: "Who we are & scope",
          content: (
            <>
              <p>
                Decoritu (“Decoritu”, “we”, “us”) is a home décor and furnishings store based in
                Jaipur, India. This policy applies to personal data collected through this website,
                our customer care channels and any related services.
              </p>
              <p>
                We handle personal data in line with applicable Indian law, including the Digital
                Personal Data Protection Act, 2023 (“DPDP Act”) and the Information Technology Act,
                2000. Where you interact with us from outside India, local consumer and privacy laws
                may also apply.
              </p>
              <p>
                This site may currently show a preview catalogue. The practices below apply to data
                collected through the site even while the catalogue remains illustrative.
              </p>
            </>
          ),
        },
        {
          id: "collect",
          title: "What we collect",
          content: (
            <>
              <p>Depending on how you use the site, we may collect:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Account details:</strong> name, email address, phone number and a hashed password. We never store passwords in plain text.</li>
                <li><strong>Order details:</strong> delivery address, contact details, items purchased, order notes and delivery preferences.</li>
                <li><strong>Payment references:</strong> the payment method, amount and provider reference. Card, UPI and net-banking credentials are handled by our payment provider and are not stored by us.</li>
                <li><strong>Correspondence:</strong> messages you send through contact forms, order notes, reviews or email.</li>
                <li><strong>Marketing preferences:</strong> your newsletter consent and the email address you subscribe with.</li>
                <li><strong>Technical data:</strong> device and browser type, approximate location derived from IP, pages viewed, referring URL, and security or error logs.</li>
                <li><strong>Local storage:</strong> your cart and saved items are stored in your browser so the site remembers them between visits.</li>
              </ul>
              <p>
                We do not intentionally collect sensitive personal data such as health, biometric or
                financial account credentials. Please do not send these to us.
              </p>
            </>
          ),
        },
        {
          id: "use",
          title: "How we use it",
          content: (
            <>
              <p>We use personal data to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>create and secure your account, and authenticate your sessions;</li>
                <li>process orders, calculate totals, collect payment and arrange delivery;</li>
                <li>communicate about orders, returns, cancellations and customer care requests;</li>
                <li>publish reviews you choose to submit, after moderation;</li>
                <li>send the newsletter where you have opted in, with an unsubscribe option in every email;</li>
                <li>prevent fraud, rate-limit abuse, secure the site and debug errors;</li>
                <li>understand aggregate usage so we can improve products, navigation and content;</li>
                <li>meet accounting, tax and legal obligations.</li>
              </ul>
              <p>
                We rely on your consent for marketing, on the performance of our contract with you for
                orders and accounts, on our legitimate interests for security and service improvement,
                and on legal obligation where records must be kept.
              </p>
            </>
          ),
        },
        {
          id: "sharing",
          title: "Who we share with",
          content: (
            <>
              <p>
                We do not sell personal data. We share what is necessary with service providers who
                help us operate the store, including:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Payment processors</strong> (such as Razorpay) to collect and verify payments;</li>
                <li><strong>Courier and logistics partners</strong> to deliver orders and provide tracking;</li>
                <li><strong>Hosting, database, email and analytics providers</strong> that support the site;</li>
                <li><strong>Professional advisers and authorities</strong> where required by law or to establish or defend legal claims.</li>
              </ul>
              <p>
                Providers are expected to process data only for the service they provide and to apply
                appropriate safeguards. Some providers may process data outside India; where that
                happens, we take reasonable steps consistent with applicable law.
              </p>
            </>
          ),
        },
        {
          id: "cookies",
          title: "Cookies & local storage",
          content: (
            <>
              <p>
                We use strictly necessary cookies for authentication and security. These keep you
                signed in and protect forms from abuse. We also use browser local storage for your cart
                and saved items.
              </p>
              <p>
                We do not currently run advertising cookies or third-party behavioural tracking. If
                that changes, we will update this policy and, where required, ask for consent before
                setting non-essential cookies.
              </p>
              <p>
                You can clear cookies and local storage through your browser settings. Clearing them
                will sign you out and empty your saved cart on that device.
              </p>
            </>
          ),
        },
        {
          id: "retention",
          title: "How long we keep it",
          content: (
            <>
              <p>
                We keep account data while your account is active. Order and payment records are kept
                for as long as needed to service the order and then for the period required by tax,
                accounting and consumer-protection law.
              </p>
              <p>
                Contact messages are kept for up to 24 months so we can resolve follow-ups. Newsletter
                data is kept until you unsubscribe or ask us to delete it. Security logs are kept for a
                shorter period unless needed to investigate an incident.
              </p>
              <p>
                When data is no longer needed, we delete or anonymise it. Some backup copies may persist
                for a limited period before being overwritten.
              </p>
            </>
          ),
        },
        {
          id: "security",
          title: "Security",
          content: (
            <>
              <p>
                We use industry-standard measures appropriate to the risk, including encrypted
                transport, hashed passwords, hashed session and order-access tokens, access controls,
                rate limiting and least-privilege access to production systems.
              </p>
              <p>
                No system is completely secure. If you believe your account has been compromised, or
                you notice suspicious activity, contact us immediately and change your password.
              </p>
            </>
          ),
        },
        {
          id: "rights",
          title: "Your choices & rights",
          content: (
            <>
              <p>Subject to applicable law, you may ask us to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>confirm what personal data we hold about you and provide a copy;</li>
                <li>correct inaccurate or incomplete data;</li>
                <li>delete data that is no longer needed for the purpose it was collected;</li>
                <li>withdraw consent for marketing or other consent-based processing;</li>
                <li>nominate a person to exercise your rights in the event of death or incapacity;</li>
                <li>raise a grievance about how we handle your data.</li>
              </ul>
              <p>
                You can update your name, phone and addresses from your account settings. For other
                requests, write to us from the email address associated with your account. We may need
                to verify your identity before acting. We will respond within the time required by
                applicable law.
              </p>
              <p>
                If you are not satisfied with our response, you may contact the Data Protection Board
                of India or another competent authority.
              </p>
            </>
          ),
        },
        {
          id: "children",
          title: "Children",
          content: (
            <p>
              The store is intended for adults. We do not knowingly collect personal data from
              children under 18. If you believe a child has provided data to us, contact us and we will
              delete it.
            </p>
          ),
        },
        {
          id: "changes",
          title: "Changes & contact",
          content: (
            <>
              <p>
                We may update this policy as the store evolves. The “last updated” date above will
                change, and material changes will be communicated where appropriate. Please review the
                policy periodically.
              </p>
              <p>
                For privacy questions, requests or grievances, contact our care team at{" "}
                <a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a> with the subject
                “Privacy request”. You can also read our <Link href="/terms">Terms of use</Link> or{" "}
                <Link href="/contact">contact page</Link>.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

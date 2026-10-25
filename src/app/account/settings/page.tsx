import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { ProfileForm } from "@/components/account/ProfileForm";
import { PasswordForm } from "@/components/account/PasswordForm";

export const metadata: Metadata = {
  title: "Account settings",
};

export default async function AccountSettingsPage() {
  const user = await requireUser("/account/settings");

  return (
    <div>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-muted">Your account</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Account settings.</h1>
        <p className="mt-3 text-sm text-muted">
          Keep your contact details and password up to date.
        </p>
      </div>

      <section className="mt-8 border border-line bg-paper p-5 sm:p-7">
        <p className="eyebrow text-muted">Personal details</p>
        <div className="mt-5">
          <ProfileForm initialName={user.name} email={user.email} initialPhone={user.phone ?? ""} />
        </div>
      </section>

      <section className="mt-5 border border-line bg-paper p-5 sm:p-7">
        <p className="eyebrow text-muted">Password & security</p>
        <div className="mt-5">
          <PasswordForm />
        </div>
      </section>

      <section className="mt-5 border border-line bg-paper p-5 sm:p-7">
        <p className="eyebrow text-muted">Privacy & data</p>
        <p className="mt-3 max-w-xl text-xs leading-6 text-muted">
          You can review how we handle your information in our{" "}
          <Link href="/privacy" className="text-ink underline decoration-line underline-offset-4">
            Privacy Policy
          </Link>
          . To request a copy of your data or account deletion, contact customer care from the email
          linked to this account.
        </p>
        <Link href="/contact" className="btn btn-outline mt-4">
          Contact customer care
        </Link>
      </section>
    </div>
  );
}

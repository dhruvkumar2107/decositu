import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { AccountNav } from "@/components/account/AccountNav";

export const metadata: Metadata = {
  title: { default: "Your account", template: "%s | Your Decoritu account" },
  robots: { index: false, follow: false },
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/account");

  return (
    <div className="container-luxe py-10 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12 xl:gap-16">
        <aside className="lg:sticky lg:top-[110px] lg:self-start">
          <AccountNav user={{ name: user.name, email: user.email, role: user.role }} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

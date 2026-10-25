import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Decoritu Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin("/admin");

  return (
    <div className="container-luxe py-8 md:py-12">
      <div className="grid gap-6 lg:grid-cols-[210px_1fr] lg:gap-10 xl:gap-12">
        <aside className="lg:sticky lg:top-[105px] lg:self-start">
          <AdminNav name={user.name} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

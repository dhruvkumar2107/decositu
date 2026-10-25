import type { Metadata } from "next";
import { Info } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getSettings, isDemoMode } from "@/lib/settings";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { updateSettingsAction } from "@/app/admin/actions";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Store settings" };

export default async function AdminSettingsPage() {
  await requireAdmin("/admin/settings");
  const settings = await getSettings();

  return (
    <div>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-muted">Storefront control</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Settings.</h1>
        <p className="mt-3 max-w-2xl text-xs leading-6 text-muted">
          Content entered here updates the live homepage, announcement bar, footer and order messaging.
          Changes publish immediately.
        </p>
      </div>

      <div className="mt-5 border border-line bg-cream/40 p-4">
        <p className="flex items-start gap-2 text-[0.68rem] leading-5 text-muted">
          <Info size={14} className="mt-0.5 shrink-0 text-olive" />
          Free shipping is currently {formatPrice(Number(settings.shippingThreshold))}; below that,
          shipping is {formatPrice(Number(settings.shippingFee))}. Demo mode is{" "}
          <strong className="font-semibold text-ink">{isDemoMode() ? "on" : "off"}</strong> via
          `NEXT_PUBLIC_DEMO_MODE` and is not editable here.
        </p>
      </div>

      <AdminActionForm action={updateSettingsAction} submitLabel="Publish settings">
        <div className="mt-5 space-y-4">
          <section className="border border-line bg-paper p-5 sm:p-6">
            <p className="eyebrow text-muted">Homepage hero</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="label">Eyebrow</label>
                <input name="heroEyebrow" required maxLength={80} defaultValue={settings.heroEyebrow} className="input" />
              </div>
              <div>
                <label className="label">Headline</label>
                <input name="heroTitle" required maxLength={120} defaultValue={settings.heroTitle} className="input" />
              </div>
              <div>
                <label className="label">Subtitle</label>
                <textarea name="heroSubtitle" required maxLength={280} rows={2} defaultValue={settings.heroSubtitle} className="textarea resize-y" />
              </div>
            </div>
          </section>

          <section className="border border-line bg-paper p-5 sm:p-6">
            <p className="eyebrow text-muted">Announcements</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Primary message</label>
                <input name="announcement" required maxLength={140} defaultValue={settings.announcement} className="input" />
              </div>
              <div>
                <label className="label">Secondary message</label>
                <input name="announcementSecondary" required maxLength={140} defaultValue={settings.announcementSecondary} className="input" />
              </div>
            </div>
          </section>

          <section className="border border-line bg-paper p-5 sm:p-6">
            <p className="eyebrow text-muted">Customer care</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <label className="label">Support email</label>
                <input name="supportEmail" type="email" required defaultValue={settings.supportEmail} className="input" />
              </div>
              <div>
                <label className="label">Support hours</label>
                <input name="supportHours" required defaultValue={settings.supportHours} className="input" />
              </div>
              <div>
                <label className="label">Return window (days)</label>
                <input name="returnWindow" type="number" min="0" max="90" step="1" required defaultValue={settings.returnWindow} className="input" />
              </div>
            </div>
          </section>

          <section className="border border-line bg-paper p-5 sm:p-6">
            <p className="eyebrow text-muted">Shipping & fulfilment</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Free-shipping threshold (₹)</label>
                <input name="shippingThreshold" type="number" min="0" step="0.01" required defaultValue={(Number(settings.shippingThreshold) / 100).toFixed(2)} className="input" />
              </div>
              <div>
                <label className="label">Standard shipping fee (₹)</label>
                <input name="shippingFee" type="number" min="0" step="0.01" required defaultValue={(Number(settings.shippingFee) / 100).toFixed(2)} className="input" />
              </div>
            </div>
          </section>

          <section className="border border-line bg-paper p-5 sm:p-6">
            <p className="eyebrow text-muted">Preview disclosure</p>
            <div className="mt-4">
              <label className="label">Demo / preview note</label>
              <textarea name="demoNote" required maxLength={400} rows={3} defaultValue={settings.demoNote} className="textarea resize-y" />
              <p className="mt-2 text-[0.6rem] text-muted">Displayed in the footer and support areas. Keep it honest while the catalogue remains sample data.</p>
            </div>
          </section>
        </div>
      </AdminActionForm>
    </div>
  );
}

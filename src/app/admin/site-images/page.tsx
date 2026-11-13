import type { Metadata } from "next";
import Link from "next/link";
import { Info } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getSettings, siteImage } from "@/lib/settings";
import { siteImageSlots } from "@/lib/site-images";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { ImageField } from "@/components/admin/ImageField";
import { updateSiteImagesAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Site images" };

export default async function AdminSiteImagesPage() {
  await requireAdmin("/admin/site-images");
  const settings = await getSettings();
  const groups = [...new Set(siteImageSlots.map((slot) => slot.group))];

  return (
    <div>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-muted">Storefront visuals</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Site images.</h1>
        <p className="mt-3 max-w-2xl text-xs leading-6 text-muted">
          Every image currently on the website is shown below. To change one, click{" "}
          <strong className="font-semibold text-ink">Upload</strong> and choose a photo from your device,
          or pick one from the{" "}
          <Link href="/admin/media" className="underline hover:text-ink">media library</Link>. Then click{" "}
          <strong className="font-semibold text-ink">Publish site images</strong> at the bottom.
        </p>
      </div>

      <div className="mt-5 border border-line bg-cream/40 p-4">
        <p className="flex items-start gap-2 text-[0.68rem] leading-5 text-muted">
          <Info size={14} className="mt-0.5 shrink-0 text-olive" />
          Product and category photos are changed on the Products and Categories pages. Large phone
          photos are compressed automatically while uploading. “Restore default” puts the original image back.
        </p>
      </div>

      <AdminActionForm
        action={updateSiteImagesAction}
        submitLabel="Publish site images"
        buttonClassName="sticky bottom-4 shadow-lg"
      >
        <div className="mt-5 space-y-4">
          {groups.map((group) => (
            <section key={group} className="border border-line bg-paper p-5 sm:p-6">
              <p className="eyebrow text-muted">{group}</p>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                {siteImageSlots
                  .filter((slot) => slot.group === group)
                  .map((slot) => (
                    <ImageField
                      key={slot.key}
                      name={slot.key}
                      label={slot.label}
                      defaultValue={siteImage(settings, slot.key)}
                      resetTo={slot.defaultSrc}
                      hint={"hint" in slot ? slot.hint : undefined}
                      aspect={slot.key === "img.logo" ? "aspect-[2/1]" : "aspect-[4/3]"}
                      contain={slot.key === "img.logo"}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </AdminActionForm>
    </div>
  );
}

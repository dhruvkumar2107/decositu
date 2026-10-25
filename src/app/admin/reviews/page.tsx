import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime, parseImages } from "@/lib/utils";
import { Stars } from "@/components/ui/Stars";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { deleteReviewAction, setReviewStatusAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Reviews" };

const tabs = [
  { key: "", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Published" },
  { key: "REJECTED", label: "Rejected" },
];

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin("/admin/reviews");
  const params = await searchParams;
  const status = ["PENDING", "APPROVED", "REJECTED"].includes(params.status ?? "")
    ? (params.status as string)
    : "";
  const reviews = await prisma.review.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true, images: true } },
    },
  });

  return (
    <div>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-muted">Community</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Reviews.</h1>
        <p className="mt-3 text-xs text-muted">Moderate verified customer reviews before publishing.</p>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {tabs.map((tab) => (
          <Link
            key={tab.key || "all"}
            href={tab.key ? `/admin/reviews?status=${tab.key}` : "/admin/reviews"}
            className={cn(
              "shrink-0 border px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.09em]",
              status === tab.key ? "border-charcoal bg-charcoal text-ivory" : "border-line text-muted hover:border-charcoal",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {reviews.map((review) => {
          const image = parseImages(review.product.images)[0] ?? "/images/bedding-01.jpg";
          return (
            <article key={review.id} className="border border-line bg-paper p-4 sm:p-5">
              <div className="flex flex-wrap items-start gap-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden bg-cream">
                  <Image src={image} alt={review.product.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-[160px] flex-1">
                  <Link href={`/products/${review.product.slug}`} target="_blank" className="text-xs font-medium hover:text-olive">
                    {review.product.name}
                  </Link>
                  <p className="mt-0.5 text-[0.58rem] text-muted">{review.user.name} · {review.user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Stars rating={review.rating} size={12} />
                  <span className={cn("border px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.06em]", review.status === "APPROVED" ? "border-olive/30 bg-olive/8 text-olive" : review.status === "REJECTED" ? "border-wine/30 bg-wine/8 text-wine" : "border-clay/30 bg-clay/8 text-clay")}>
                    {review.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-l border-line pl-3">
                {review.title && <p className="font-display text-xl">{review.title}</p>}
                <p className="mt-1 text-xs leading-6 text-muted">{review.body}</p>
                <p className="mt-2 text-[0.55rem] text-muted">{formatDateTime(review.createdAt)}</p>
              </div>

              <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-line pt-3">
                <AdminActionForm
                  action={setReviewStatusAction}
                  submitLabel="Update"
                  className="flex items-end gap-2"
                  buttonClassName="mt-0 min-h-[38px] px-3 py-2 text-[0.58rem]"
                >
                  <input type="hidden" name="id" value={review.id} />
                  <div>
                    <label className="label text-[0.55rem]">Status</label>
                    <select name="status" defaultValue={review.status} className="select h-[38px] min-w-[130px] py-1.5">
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Published</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </AdminActionForm>
                <form action={deleteReviewAction} className="ml-auto">
                  <input type="hidden" name="id" value={review.id} />
                  <ConfirmButton
                    message="Delete this review permanently?"
                    className="inline-flex items-center gap-1.5 pb-2 text-[0.58rem] font-semibold uppercase tracking-[0.07em] text-muted hover:text-wine"
                  >
                    <Trash2 size={12} /> Delete
                  </ConfirmButton>
                </form>
              </div>
            </article>
          );
        })}
        {!reviews.length && (
          <div className="border border-dashed border-line px-5 py-12 text-center text-xs text-muted">
            No reviews in this view.
          </div>
        )}
      </div>
    </div>
  );
}

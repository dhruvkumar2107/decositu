import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { Stars } from "@/components/ui/Stars";
import { formatDate, parseImages } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My reviews",
};

const statusStyles: Record<string, string> = {
  APPROVED: "border-olive/30 bg-olive/8 text-olive",
  PENDING: "border-clay/30 bg-clay/8 text-clay",
  REJECTED: "border-wine/30 bg-wine/8 text-wine",
};

const statusLabels: Record<string, string> = {
  APPROVED: "Published",
  PENDING: "Awaiting moderation",
  REJECTED: "Not published",
};

export default async function AccountReviewsPage() {
  const user = await requireUser("/account/reviews");
  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: { name: true, slug: true, images: true, active: true },
      },
    },
  });

  return (
    <div>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-muted">Your words</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">My reviews.</h1>
        <p className="mt-3 text-sm text-muted">
          Reviews are moderated before publishing to keep them useful and honest.
        </p>
      </div>

      {reviews.length ? (
        <div className="mt-7 space-y-4">
          {reviews.map((review) => {
            const image = parseImages(review.product.images)[0] ?? "/images/bedding-01.jpg";
            return (
              <article key={review.id} className="border border-line bg-paper p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-cream">
                      <Image src={image} alt={review.product.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div>
                      <Link
                        href={`/products/${review.product.slug}`}
                        className="font-display text-xl leading-tight hover:text-olive"
                      >
                        {review.product.name}
                      </Link>
                      <p className="mt-1 text-[0.62rem] text-muted">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "border px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.08em]",
                      statusStyles[review.status] ?? "border-line bg-cream text-muted",
                    )}
                  >
                    {statusLabels[review.status] ?? review.status}
                  </span>
                </div>
                <div className="mt-4">
                  <Stars rating={review.rating} size={13} />
                  {review.title && <p className="mt-2 font-display text-xl">{review.title}</p>}
                  <p className="mt-1.5 text-sm leading-7 text-muted">{review.body}</p>
                </div>
                {review.status === "REJECTED" && (
                  <p className="mt-3 border-t border-line pt-3 text-[0.64rem] leading-5 text-muted">
                    This review was not published. Contact customer care if you would like us to review
                    that decision.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 border border-dashed border-line px-6 py-16 text-center">
          <Star size={25} strokeWidth={1.2} className="mx-auto text-muted" />
          <p className="mt-4 font-display text-3xl">No reviews yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-muted">
            Once a piece is home with you, share your experience from its product page.
          </p>
          <Link href="/collections/bestsellers" className="btn btn-outline mt-6">
            Find something to love
          </Link>
        </div>
      )}
    </div>
  );
}

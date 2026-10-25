"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, MessageSquare, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { ProductDetailData } from "@/lib/products";
import { Stars, StarPicker } from "@/components/ui/Stars";
import { formatDate } from "@/lib/utils";

export function ReviewSection({
  product,
  currentUser,
  existingStatus,
}: {
  product: ProductDetailData;
  currentUser: { name: string; email: string } | null;
  existingStatus: string | null;
}) {
  const pathname = usePathname();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(existingStatus !== null);

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product.reviews.filter((review) => review.rating === star).length,
  }));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, rating, title, body }),
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to submit review.");
      setSubmitted(true);
      setTitle("");
      setBody("");
      toast.success(data.message || "Review submitted for moderation.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="reviews" className="border-t border-line bg-paper py-16 md:py-24">
      <div className="container-luxe">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="eyebrow text-muted">Verified reviews</p>
            <h2 className="display mt-4 text-[2.6rem] leading-[0.96] sm:text-[3.3rem]">In their own words.</h2>

            {product.rating !== null ? (
              <div className="mt-7 flex items-center gap-5 border-y border-line py-5">
                <p className="font-display text-6xl leading-none">{product.rating.toFixed(1)}</p>
                <div>
                  <Stars rating={product.rating} size={15} />
                  <p className="mt-1.5 text-[0.7rem] text-muted">
                    Based on {product.reviewCount} verified {product.reviewCount === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-7 border-y border-line py-6">
                <p className="text-sm text-muted">
                  No reviews yet. Every review here will come from a verified Decoritu account.
                </p>
              </div>
            )}

            <div className="mt-5 space-y-2.5">
              {distribution.map((row) => (
                <div key={row.star} className="flex items-center gap-3 text-[0.68rem] text-muted">
                  <span className="w-7">{row.star} ★</span>
                  <div className="h-1.5 flex-1 overflow-hidden bg-line">
                    <div
                      className="h-full bg-clay"
                      style={{
                        width: `${product.reviewCount ? (row.count / product.reviewCount) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-4 text-right">{row.count}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-start gap-2.5 border border-line p-4 text-[0.67rem] leading-5 text-muted">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-olive" />
              Reviews are tied to signed-in accounts and moderated before publishing. We never invent ratings.
            </div>
          </div>

          <div>
            <div className="space-y-6">
              {product.reviews.length ? (
                product.reviews.map((review) => (
                  <article key={review.id} className="border-b border-line pb-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-[0.65rem] font-semibold">
                          {review.userName
                            .split(" ")
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{review.userName}</p>
                          <p className="text-[0.62rem] text-muted">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-olive">
                          <Check size={11} /> Verified
                        </span>
                        <Stars rating={review.rating} size={12} />
                      </div>
                    </div>
                    {review.title && <p className="mt-4 font-display text-xl">{review.title}</p>}
                    <p className="mt-2 text-sm leading-7 text-muted">{review.body}</p>
                  </article>
                ))
              ) : (
                <div className="flex min-h-[190px] flex-col items-center justify-center border border-dashed border-line px-6 text-center">
                  <MessageSquare size={26} className="text-muted/60" />
                  <p className="mt-3 font-display text-2xl">The first word is yours.</p>
                  <p className="mt-2 max-w-sm text-xs leading-6 text-muted">
                    If this piece has found a place in your home, we would love to hear how it feels.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-10 border border-line bg-ivory p-6 sm:p-8">
              <p className="eyebrow text-muted">Write a review</p>
              {!currentUser ? (
                <div className="mt-4">
                  <h3 className="font-display text-2xl">Share your experience.</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Sign in to leave a verified review. It will appear after moderation.
                  </p>
                  <Link
                    href={`/login?next=${encodeURIComponent(`${pathname}#reviews`)}`}
                    className="btn btn-primary mt-5"
                  >
                    Sign in to review
                  </Link>
                </div>
              ) : submitted ? (
                <div className="mt-4 flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-olive text-ivory">
                    <Check size={15} />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl">Thank you for sharing.</h3>
                    <p className="mt-1 text-sm text-muted">
                      Your review is with our team and will appear once approved.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="label">Your rating</label>
                    <StarPicker value={rating} onChange={setRating} />
                  </div>
                  <div>
                    <label htmlFor="review-title" className="label">
                      Title <span className="font-normal text-muted">(optional)</span>
                    </label>
                    <input
                      id="review-title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      maxLength={100}
                      placeholder="A few words that sum it up"
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="review-body" className="label">Your review</label>
                    <textarea
                      id="review-body"
                      value={body}
                      onChange={(event) => setBody(event.target.value)}
                      required
                      minLength={10}
                      maxLength={1000}
                      rows={5}
                      placeholder="How does it feel in your home? What would you want another customer to know?"
                      className="textarea resize-y"
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn btn-primary w-full sm:w-auto">
                    {submitting ? "Submitting…" : "Submit for review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

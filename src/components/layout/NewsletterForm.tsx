"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      toast.error("Please agree to receive our emails.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to subscribe.");
      setDone(true);
      setEmail("");
      setConsent(false);
      toast.success(data.message || "You're on the list.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to subscribe.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div
        className={cn(
          "flex items-start gap-3 border p-4",
          tone === "dark" ? "border-ivory/25 text-ivory" : "border-line text-ink",
        )}
      >
        <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full", tone === "dark" ? "bg-ivory text-ink" : "bg-olive text-ivory")}>
          <Check size={13} />
        </span>
        <div>
          <p className="text-sm font-medium">You&apos;re on the list.</p>
          <p className={cn("mt-1 text-xs", tone === "dark" ? "text-ivory/60" : "text-muted")}>
            Look out for our next letter — slow interiors, new arrivals and considered ideas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "flex border-b",
          tone === "dark" ? "border-ivory/35" : "border-ink/30",
        )}
      >
        <label htmlFor={`newsletter-${tone}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-${tone}`}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
          className={cn(
            "min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none",
            tone === "dark"
              ? "text-ivory placeholder:text-ivory/60"
              : "text-ink placeholder:text-muted/75",
          )}
        />
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "inline-flex items-center gap-2 px-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] disabled:opacity-50",
            tone === "dark" ? "text-ivory" : "text-ink",
          )}
        >
          {loading ? "Joining…" : "Join"}
          <ArrowRight size={14} />
        </button>
      </div>
      <label
        className={cn(
          "mt-3 flex cursor-pointer items-start gap-2.5 text-[0.68rem] leading-relaxed",
          tone === "dark" ? "text-ivory/75" : "text-muted",
        )}
      >
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-olive"
        />
        I agree to receive Decoritu emails and understand I can unsubscribe at any time.
      </label>
    </form>
  );
}

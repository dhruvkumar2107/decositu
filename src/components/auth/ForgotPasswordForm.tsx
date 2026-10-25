"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to process the request.");
      setMessage(data.message || "If an account exists, a reset link has been sent.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to process the request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p className="eyebrow text-muted">Password assistance</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Reset your password.</h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        Enter the email linked to your account. If it exists, we&apos;ll send a secure link valid for
        one hour.
      </p>

      {message ? (
        <div className="mt-8 border border-olive/25 bg-olive/5 p-6">
          <MailCheck size={24} className="text-olive" />
          <p className="mt-3 font-display text-2xl">Check your inbox.</p>
          <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
          <p className="mt-3 text-[0.65rem] leading-5 text-muted">
            Didn&apos;t receive it? Check spam, or wait a minute and try again.
          </p>
          <button type="button" onClick={() => setMessage("")} className="link-underline mt-5 text-[0.66rem] font-semibold uppercase tracking-[0.12em]">
            Try another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <p role="alert" className="border border-wine/25 bg-wine/5 px-4 py-3 text-xs text-wine">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="email" className="label">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="input"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <Link href="/login" className="mt-7 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted hover:text-ink">
        <ArrowLeft size={14} /> Back to sign in
      </Link>
    </>
  );
}

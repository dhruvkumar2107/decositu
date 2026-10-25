"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Eye, EyeOff } from "lucide-react";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to reset your password.");
      setSuccess(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to reset your password.");
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <>
        <p className="eyebrow text-muted">Password reset</p>
        <h1 className="display mt-3 text-5xl">This link is incomplete.</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          The reset token is missing. Request a fresh link to continue.
        </p>
        <Link href="/forgot-password" className="btn btn-primary mt-7">
          Request a new link
        </Link>
      </>
    );
  }

  if (success) {
    return (
      <>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-olive text-ivory">
          <Check size={22} />
        </span>
        <p className="eyebrow mt-6 text-muted">Password updated</p>
        <h1 className="display mt-3 text-5xl">You&apos;re all set.</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Your password has been changed. Sign in with your new password to continue.
        </p>
        <Link href="/login" className="btn btn-primary mt-7">
          Sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <p className="eyebrow text-muted">Choose a new password</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">A fresh start.</h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        Use at least 8 characters with a letter and a number.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <p role="alert" className="border border-wine/25 bg-wine/5 px-4 py-3 text-xs text-wine">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="password" className="label">New password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-muted hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="confirm-password" className="label">Confirm password</label>
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="input"
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </>
  );
}

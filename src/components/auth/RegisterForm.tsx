"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm({ next }: { next: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!accepted) {
      setError("Please accept the terms and privacy policy.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to create your account.");
      router.replace(next || "/account");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create your account.");
      setLoading(false);
    }
  }

  return (
    <>
      <p className="eyebrow text-muted">Join Decoritu</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Create an account.</h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        Save your edit, check out faster and keep your order history close.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <p role="alert" className="border border-wine/25 bg-wine/5 px-4 py-3 text-xs text-wine">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="name" className="label">Full name</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="input"
          />
        </div>
        <div>
          <label htmlFor="email" className="label">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="input"
          />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
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
          <p className="mt-1.5 text-[0.62rem] text-muted">Use at least 8 characters with a letter and a number.</p>
        </div>
        <div>
          <label htmlFor="confirm-password" className="label">Confirm password</label>
          <input
            id="confirm-password"
            name="confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat your password"
            className="input"
          />
        </div>
        <label className="flex items-start gap-2.5 pt-1 text-[0.68rem] leading-5 text-muted">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-1 h-3.5 w-3.5 accent-olive"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-ink underline underline-offset-2">Terms of Service</Link> and{" "}
            <Link href="/privacy" className="text-ink underline underline-offset-2">Privacy Policy</Link>.
          </span>
        </label>
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        Already have an account?{" "}
        <Link
          href={`/login${next === "/account" ? "" : `?next=${encodeURIComponent(next)}`}`}
          className="font-medium text-ink underline decoration-line underline-offset-4 hover:text-olive"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

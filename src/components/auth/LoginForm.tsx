"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to sign in.");
      router.replace(next || "/account");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
      setLoading(false);
    }
  }

  return (
    <>
      <p className="eyebrow text-muted">Welcome back</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Sign in.</h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        Return to your saved pieces, orders and account details.
      </p>

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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="label">Password</label>
            <Link href="/forgot-password" className="text-[0.68rem] text-muted underline decoration-line underline-offset-4 hover:text-ink">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
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
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        New to Decoritu?{" "}
        <Link
          href={`/register${next === "/account" ? "" : `?next=${encodeURIComponent(next)}`}`}
          className="font-medium text-ink underline decoration-line underline-offset-4 hover:text-olive"
        >
          Create an account
        </Link>
      </p>

      <p className="mt-8 border-t border-line pt-5 text-center text-[0.64rem] leading-5 text-muted">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2">Terms</Link> and{" "}
        <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>.
      </p>
    </>
  );
}

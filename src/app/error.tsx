"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error", error);
  }, [error]);

  return (
    <section className="container-luxe flex min-h-[60vh] max-w-3xl flex-col items-start justify-center py-16">
      <p className="eyebrow text-muted">Something went astray</p>
      <h1 className="display mt-4 text-[3.6rem] leading-[0.9] sm:text-[4.8rem]">
        A small interruption.
      </h1>
      <p className="mt-5 max-w-lg text-sm leading-7 text-muted">
        We could not load this page just now. Please try again. If the problem continues, our care
        team would like to hear about it.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          <RotateCcw size={14} /> Try again
        </button>
        <Link href="/" className="btn btn-outline">Return home</Link>
        <Link href="/contact" className="btn btn-outline">Contact care</Link>
      </div>
      {error.digest && <p className="mt-6 text-[0.58rem] tracking-[0.08em] text-muted">Reference: {error.digest}</p>}
    </section>
  );
}

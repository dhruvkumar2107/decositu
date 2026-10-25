"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

type Status = { type: "idle" | "error" | "success"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        setStatus({ type: "error", message: result.message ?? "Unable to send your message right now." });
        return;
      }
      form.reset();
      setStatus({
        type: "success",
        message: result.message ?? "Thank you. We will reply within one business day.",
      });
    } catch {
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="border border-line bg-paper p-5 sm:p-7">
      {status.type === "error" && (
        <p role="alert" className="mb-4 border border-wine/25 bg-wine/5 px-3 py-2.5 text-xs leading-5 text-wine">
          {status.message}
        </p>
      )}
      {status.type === "success" && (
        <p role="status" className="mb-4 border border-olive/25 bg-olive/5 px-3 py-2.5 text-xs leading-5 text-olive">
          {status.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="label">Your name</label>
          <input id="contact-name" name="name" required minLength={2} maxLength={80} autoComplete="name" className="input" />
        </div>
        <div>
          <label htmlFor="contact-email" className="label">Email address</label>
          <input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" className="input" />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="contact-subject" className="label">Subject</label>
        <input id="contact-subject" name="subject" required minLength={2} maxLength={120} placeholder="Order help, product question, trade enquiry…" className="input" />
      </div>
      <div className="mt-4">
        <label htmlFor="contact-message" className="label">How can we help?</label>
        <textarea id="contact-message" name="message" required minLength={10} maxLength={2000} rows={6} className="textarea resize-y" />
      </div>
      <p className="mt-3 text-[0.6rem] leading-5 text-muted">
        Share only what we need to help you. Please do not send card numbers or passwords.
      </p>
      <button type="submit" disabled={pending} className="btn btn-primary mt-5 w-full sm:w-auto">
        {pending ? <><Loader2 size={14} className="animate-spin" /> Sending…</> : <><Send size={14} /> Send message</>}
      </button>
    </form>
  );
}

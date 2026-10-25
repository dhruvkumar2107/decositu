"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ProfileForm({
  initialName,
  email,
  initialPhone,
}: {
  initialName: string;
  email: string;
  initialPhone: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to update your details.");
      toast.success("Your details have been updated.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update your details.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p role="alert" className="border border-wine/25 bg-wine/5 px-3 py-2.5 text-xs text-wine">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="profile-name" className="label">Full name</label>
          <input
            id="profile-name"
            required
            minLength={2}
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="profile-phone" className="label">Phone</label>
          <input
            id="profile-phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="10-digit mobile number"
            className="input"
          />
        </div>
      </div>
      <div>
        <label htmlFor="profile-email" className="label">Email address</label>
        <input id="profile-email" value={email} readOnly disabled className="input opacity-65" />
        <p className="mt-1.5 text-[0.62rem] text-muted">
          Email changes require customer care verification. Contact us if you need to update it.
        </p>
      </div>
      <button type="submit" disabled={saving} className="btn btn-primary">
        {saving ? "Saving…" : "Save details"}
      </button>
    </form>
  );
}

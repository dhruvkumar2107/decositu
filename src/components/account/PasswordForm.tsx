"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) throw new Error(data.error || "Unable to update your password.");
      toast.success(data.message || "Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update your password.");
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
      <div>
        <label htmlFor="current-password" className="label">Current password</label>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className="input"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="new-password" className="label">New password</label>
          <div className="relative">
            <input
              id="new-password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="input pr-11"
            />
            <button
              type="button"
              onClick={() => setShow((value) => !value)}
              className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-muted hover:text-ink"
              aria-label={show ? "Hide passwords" : "Show passwords"}
            >
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="confirm-new-password" className="label">Confirm new password</label>
          <input
            id="confirm-new-password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="input"
          />
        </div>
      </div>
      <p className="text-[0.62rem] text-muted">
        Use at least 8 characters with a letter and a number. Other signed-in devices will be signed out.
      </p>
      <button type="submit" disabled={saving} className="btn btn-outline">
        {saving ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}

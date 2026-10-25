"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MapPin, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type AddressData = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

type FormState = Omit<AddressData, "id" | "line2"> & {
  id?: string;
  line2: string;
};

const emptyForm: FormState = {
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export function AddressManager({ addresses }: { addresses: AddressData[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  function openNew() {
    setError("");
    setForm({ ...emptyForm, isDefault: addresses.length === 0 });
  }

  function openEdit(address: AddressData) {
    setError("");
    setForm({ ...address, line2: address.line2 ?? "" });
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        form.id ? `/api/account/addresses/${form.id}` : "/api/account/addresses",
        {
          method: form.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: form.label,
            fullName: form.fullName,
            phone: form.phone,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            isDefault: form.isDefault,
          }),
        },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to save the address.");
      toast.success(form.id ? "Address updated." : "Address added.");
      setForm(null);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save the address.");
    } finally {
      setSaving(false);
    }
  }

  async function setDefault(id: string) {
    setBusyId(id);
    try {
      const response = await fetch(`/api/account/addresses/${id}/default`, { method: "POST" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to update the default address.");
      toast.success("Default address updated.");
      router.refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Unable to update the address.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(address: AddressData) {
    if (!window.confirm(`Delete the ${address.label.toLowerCase()} address?`)) return;
    setBusyId(address.id);
    try {
      const response = await fetch(`/api/account/addresses/${address.id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to delete the address.");
      toast.success("Address removed.");
      router.refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Unable to delete the address.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-muted">Your details</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">Saved addresses.</h1>
          <p className="mt-3 text-sm text-muted">
            Keep delivery details ready for a calmer checkout.
          </p>
        </div>
        <button type="button" onClick={openNew} disabled={addresses.length >= 10} className="btn btn-primary disabled:opacity-50">
          <Plus size={14} /> Add address
        </button>
      </div>

      {addresses.length ? (
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address.id}
              className={cn(
                "relative border bg-paper p-5",
                address.isDefault ? "border-olive/50" : "border-line",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-olive">
                    {address.label}
                  </span>
                  {address.isDefault && (
                    <span className="inline-flex items-center gap-1 border border-olive/25 bg-olive/5 px-1.5 py-0.5 text-[0.52rem] font-semibold uppercase tracking-[0.08em] text-olive">
                      <Check size={9} /> Default
                    </span>
                  )}
                </div>
                <MapPin size={15} className="text-muted" />
              </div>

              <div className="mt-4 text-sm leading-6">
                <p className="font-medium">{address.fullName}</p>
                <p className="text-muted">{address.line1}</p>
                {address.line2 && <p className="text-muted">{address.line2}</p>}
                <p className="text-muted">
                  {address.city}, {address.state} {address.pincode}
                </p>
                <p className="mt-2 text-[0.68rem] text-muted">{address.phone}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 border-t border-line pt-4 text-[0.61rem] font-semibold uppercase tracking-[0.09em]">
                <button type="button" onClick={() => openEdit(address)} className="inline-flex items-center gap-1.5 text-muted hover:text-ink">
                  <Pencil size={12} /> Edit
                </button>
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefault(address.id)}
                    disabled={busyId === address.id}
                    className="inline-flex items-center gap-1.5 text-muted hover:text-olive disabled:opacity-50"
                  >
                    <Star size={12} /> Make default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(address)}
                  disabled={busyId === address.id}
                  className="ml-auto inline-flex items-center gap-1.5 text-muted hover:text-wine disabled:opacity-50"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-dashed border-line px-6 py-16 text-center">
          <MapPin size={25} strokeWidth={1.2} className="mx-auto text-muted" />
          <p className="mt-4 font-display text-3xl">No saved addresses.</p>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-muted">
            Add an address to move through checkout more quickly next time.
          </p>
        </div>
      )}

      <p className="mt-5 text-[0.62rem] text-muted">
        {addresses.length} of 10 addresses saved. Addresses are only used to fulfil your orders.
      </p>

      {form && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-charcoal/40 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label={form.id ? "Edit address" : "Add address"}>
          <div className="my-auto w-full max-w-xl border border-line bg-paper p-5 shadow-2xl sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow text-muted">{form.id ? "Edit address" : "New address"}</p>
                <h2 className="mt-1 font-display text-3xl">Delivery details</h2>
              </div>
              <button
                type="button"
                onClick={() => setForm(null)}
                className="flex h-9 w-9 items-center justify-center border border-line hover:bg-cream"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={save} className="mt-6 space-y-4">
              {error && (
                <p role="alert" className="border border-wine/25 bg-wine/5 px-3 py-2.5 text-xs text-wine">
                  {error}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Address label</label>
                  <input
                    required
                    maxLength={30}
                    value={form.label}
                    onChange={(event) => setForm({ ...form, label: event.target.value })}
                    placeholder="Home"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Full name</label>
                  <input
                    required
                    minLength={2}
                    maxLength={100}
                    value={form.fullName}
                    onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="label">Phone number</label>
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  placeholder="10-digit mobile number"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Address line 1</label>
                <input
                  required
                  minLength={5}
                  maxLength={160}
                  value={form.line1}
                  onChange={(event) => setForm({ ...form, line1: event.target.value })}
                  placeholder="House / flat, building, street"
                  className="input"
                />
              </div>
              <div>
                <label className="label">
                  Address line 2 <span className="font-normal text-muted">(optional)</span>
                </label>
                <input
                  maxLength={160}
                  value={form.line2}
                  onChange={(event) => setForm({ ...form, line2: event.target.value })}
                  placeholder="Area, landmark"
                  className="input"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label">City</label>
                  <input
                    required
                    minLength={2}
                    maxLength={80}
                    value={form.city}
                    onChange={(event) => setForm({ ...form, city: event.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">State</label>
                  <input
                    required
                    minLength={2}
                    maxLength={80}
                    value={form.state}
                    onChange={(event) => setForm({ ...form, state: event.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">PIN code</label>
                  <input
                    required
                    inputMode="numeric"
                    pattern="[1-9][0-9]{5}"
                    maxLength={6}
                    value={form.pincode}
                    onChange={(event) => setForm({ ...form, pincode: event.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2.5 text-xs">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(event) => setForm({ ...form, isDefault: event.target.checked })}
                  className="h-3.5 w-3.5 accent-olive"
                />
                Make this my default delivery address
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn btn-primary flex-1">
                  {saving ? "Saving…" : "Save address"}
                </button>
                <button type="button" onClick={() => setForm(null)} disabled={saving} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

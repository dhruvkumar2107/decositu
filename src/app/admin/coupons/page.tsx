import type { Metadata } from "next";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/utils";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import {
  createCouponAction,
  deleteCouponAction,
  toggleCouponAction,
  updateCouponAction,
} from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Coupons" };

export default async function AdminCouponsPage() {
  await requireAdmin("/admin/coupons");
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-muted">Promotions</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">Coupons.</h1>
          <p className="mt-3 text-xs text-muted">{coupons.length} codes configured</p>
        </div>
        <details className="relative">
          <summary className="btn btn-primary list-none">
            <Plus size={14} /> Add coupon
          </summary>
          <div className="absolute right-0 top-full z-20 mt-2 w-[min(92vw,520px)] border border-line bg-paper p-4 shadow-xl">
            <AdminActionForm action={createCouponAction} submitLabel="Create coupon">
              <CouponFields />
            </AdminActionForm>
          </div>
        </details>
      </div>

      <div className="mt-5 space-y-3">
        {coupons.map((coupon) => (
          <details key={coupon.id} className="group border border-line bg-paper">
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-4 hover:bg-cream/30">
              <ChevronDown size={14} className="text-muted transition-transform group-open:rotate-180" />
              <div className="min-w-[120px] flex-1">
                <p className="text-sm font-semibold tracking-[0.04em]">{coupon.code}</p>
                <p className="mt-0.5 text-[0.58rem] text-muted">{coupon.description}</p>
              </div>
              <p className="text-[0.65rem] font-semibold">
                {coupon.type === "PERCENT" ? `${coupon.value}%` : formatPrice(coupon.value)}
              </p>
              <p className="w-24 text-right text-[0.58rem] text-muted">{coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""} used</p>
              <p className="w-28 text-right text-[0.58rem] text-muted">
                {coupon.expiresAt ? `Ends ${formatDate(coupon.expiresAt)}` : "No expiry"}
              </p>
              <span className={cn("border px-2 py-1 text-[0.52rem] font-semibold uppercase tracking-[0.07em]", coupon.active ? "border-olive/30 bg-olive/8 text-olive" : "border-line text-muted")}>
                {coupon.active ? "Active" : "Off"}
              </span>
            </summary>

            <div className="border-t border-line bg-cream/20 p-5">
              <AdminActionForm action={updateCouponAction} submitLabel="Save coupon">
                <input type="hidden" name="id" value={coupon.id} />
                <CouponFields
                  coupon={{
                    code: coupon.code,
                    description: coupon.description,
                    type: coupon.type,
                    value: coupon.value,
                    minSubtotal: coupon.minSubtotal,
                    maxDiscount: coupon.maxDiscount,
                    usageLimit: coupon.usageLimit,
                    active: coupon.active,
                    expiresAt: coupon.expiresAt?.toISOString().slice(0, 10) ?? "",
                  }}
                />
              </AdminActionForm>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <form action={toggleCouponAction}>
                  <input type="hidden" name="id" value={coupon.id} />
                  <button type="submit" className="text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted hover:text-olive">
                    {coupon.active ? "Deactivate coupon" : "Activate coupon"}
                  </button>
                </form>
                <form action={deleteCouponAction}>
                  <input type="hidden" name="id" value={coupon.id} />
                  <ConfirmButton
                    message={`Delete coupon ${coupon.code}? This cannot be undone.`}
                    className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-muted hover:text-wine"
                  >
                    <Trash2 size={12} /> Delete
                  </ConfirmButton>
                </form>
              </div>
            </div>
          </details>
        ))}
        {!coupons.length && (
          <div className="border border-dashed border-line px-5 py-12 text-center text-xs text-muted">
            No coupons configured.
          </div>
        )}
      </div>
    </div>
  );
}

function CouponFields({
  coupon,
}: {
  coupon?: {
    code: string;
    description: string;
    type: string;
    value: number;
    minSubtotal: number;
    maxDiscount: number | null;
    usageLimit: number | null;
    active: boolean;
    expiresAt: string;
  };
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Code</label>
          <input name="code" required pattern="[A-Za-z0-9-]{3,30}" defaultValue={coupon?.code} placeholder="WELCOME10" className="input uppercase" />
        </div>
        <div>
          <label className="label">Type</label>
          <select name="type" defaultValue={coupon?.type ?? "PERCENT"} className="select">
            <option value="PERCENT">Percentage discount</option>
            <option value="FIXED">Fixed amount off</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <input name="description" required minLength={3} defaultValue={coupon?.description} className="input" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label">Value (% or ₹)</label>
          <input
            name="value"
            type="number"
            min="1"
            step="0.01"
            required
            defaultValue={coupon ? (coupon.type === "FIXED" ? (coupon.value / 100).toFixed(2) : coupon.value) : ""}
            className="input"
          />
        </div>
        <div>
          <label className="label">Minimum order (₹)</label>
          <input
            name="minSubtotal"
            type="number"
            min="0"
            step="0.01"
            defaultValue={((coupon?.minSubtotal ?? 0) / 100).toFixed(2)}
            className="input"
          />
        </div>
        <div>
          <label className="label">Max discount (₹)</label>
          <input
            name="maxDiscount"
            type="number"
            min="0"
            step="0.01"
            defaultValue={coupon?.maxDiscount ? (coupon.maxDiscount / 100).toFixed(2) : ""}
            className="input"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Usage limit</label>
          <input name="usageLimit" type="number" min="1" step="1" defaultValue={coupon?.usageLimit ?? ""} placeholder="Unlimited" className="input" />
        </div>
        <div>
          <label className="label">Expiry date</label>
          <input name="expiresAt" type="date" defaultValue={coupon?.expiresAt ?? ""} className="input" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" name="active" defaultChecked={coupon?.active ?? true} className="h-3.5 w-3.5 accent-olive" />
        Coupon is active
      </label>
    </div>
  );
}

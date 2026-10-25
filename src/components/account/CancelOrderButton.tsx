"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CancelOrderButton({
  orderNumber,
  token,
}: {
  orderNumber: string;
  token?: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function cancelOrder() {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderNumber}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(token ? { token } : {}),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to cancel the order.");
      toast.success("Your order has been cancelled.");
      setConfirming(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to cancel the order.");
    } finally {
      setLoading(false);
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-[0.64rem] font-semibold uppercase tracking-[0.11em] text-muted underline decoration-line underline-offset-4 hover:text-wine"
      >
        Cancel order
      </button>
    );
  }

  return (
    <div className="border border-wine/25 bg-wine/5 p-4">
      <p className="text-xs leading-5 text-wine">
        Cancel order {orderNumber}? Reserved stock will be released immediately.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={cancelOrder}
          disabled={loading}
          className="bg-wine px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-ivory disabled:opacity-60"
        >
          {loading ? "Cancelling…" : "Yes, cancel"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="border border-line px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.1em]"
        >
          Keep order
        </button>
      </div>
    </div>
  );
}

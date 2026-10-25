"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import type { ActionState } from "@/lib/action-state";
import { initialActionState } from "@/lib/action-state";
import { cn } from "@/lib/utils";

export function AdminActionForm({
  action,
  children,
  submitLabel,
  className,
  buttonClassName,
  successMessage = "Changes saved.",
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
  buttonClassName?: string;
  successMessage?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className={className}>
      {state.status === "error" && (
        <p role="alert" className="mb-4 border border-wine/25 bg-wine/5 px-3 py-2.5 text-xs leading-5 text-wine">
          {state.message || "Something went wrong."}
        </p>
      )}
      {state.status === "success" && (
        <p role="status" className="mb-4 border border-olive/25 bg-olive/5 px-3 py-2.5 text-xs leading-5 text-olive">
          {state.message || successMessage}
        </p>
      )}
      {children}
      <button
        type="submit"
        disabled={pending}
        className={cn("btn btn-primary mt-5", buttonClassName)}
      >
        {pending ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Saving…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}

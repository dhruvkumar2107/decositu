"use client";

import { cn } from "@/lib/utils";

export function ConfirmButton({
  children,
  message,
  className,
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className={cn(className)}
    >
      {children}
    </button>
  );
}

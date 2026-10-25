import { Sparkles } from "lucide-react";

export function AnnouncementBar({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string;
}) {
  return (
    <div className="bg-charcoal text-ivory">
      <div className="container-luxe flex h-9 items-center justify-center gap-2 text-center text-[0.58rem] font-medium uppercase tracking-[0.19em] sm:justify-between">
        <span className="flex min-w-0 items-center gap-2">
          <Sparkles size={11} strokeWidth={1.4} className="shrink-0" />
          <span className="truncate">{primary}</span>
        </span>
        <span className="hidden text-ivory/70 sm:block">{secondary}</span>
      </div>
    </div>
  );
}

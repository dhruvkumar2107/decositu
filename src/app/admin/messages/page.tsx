import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { AdminActionForm } from "@/components/admin/AdminActionForm";
import { updateMessageStatusAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Messages" };

const tabs = [
  { key: "", label: "All" },
  { key: "NEW", label: "New" },
  { key: "READ", label: "Read" },
  { key: "RESPONDED", label: "Responded" },
];

const statusStyles: Record<string, string> = {
  NEW: "border-clay/30 bg-clay/8 text-clay",
  READ: "border-line bg-cream text-muted",
  RESPONDED: "border-olive/30 bg-olive/8 text-olive",
};

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin("/admin/messages");
  const params = await searchParams;
  const status = ["NEW", "READ", "RESPONDED"].includes(params.status ?? "")
    ? (params.status as string)
    : "";
  const messages = await prisma.contactMessage.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-muted">Customer care</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Messages.</h1>
        <p className="mt-3 text-xs text-muted">{messages.length} messages in this view</p>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {tabs.map((tab) => (
          <Link
            key={tab.key || "all"}
            href={tab.key ? `/admin/messages?status=${tab.key}` : "/admin/messages"}
            className={cn(
              "shrink-0 border px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.09em]",
              status === tab.key ? "border-charcoal bg-charcoal text-ivory" : "border-line text-muted hover:border-charcoal",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {messages.map((message) => (
          <article key={message.id} className={cn("border bg-paper p-5", message.status === "NEW" ? "border-clay/40" : "border-line")}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{message.subject}</p>
                <p className="mt-1 text-[0.62rem] text-muted">
                  {message.name} · {message.email} · {formatDateTime(message.createdAt)}
                </p>
              </div>
              <span className={cn("border px-2 py-1 text-[0.52rem] font-semibold uppercase tracking-[0.07em]", statusStyles[message.status] ?? "border-line text-muted")}>
                {message.status}
              </span>
            </div>
            <p className="mt-4 whitespace-pre-wrap border-l border-line pl-3 text-xs leading-6 text-muted">
              {message.message}
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-4 border-t border-line pt-3">
              <a href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`} className="inline-flex items-center gap-1.5 pb-2 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-olive">
                <Mail size={12} /> Reply by email
              </a>
              <AdminActionForm
                action={updateMessageStatusAction}
                submitLabel="Update"
                className="ml-auto flex items-end gap-2"
                buttonClassName="mt-0 min-h-[38px] px-3 py-2 text-[0.58rem]"
              >
                <input type="hidden" name="id" value={message.id} />
                <div>
                  <label className="label text-[0.55rem]">Status</label>
                  <select name="status" defaultValue={message.status} className="select h-[38px] min-w-[125px] py-1.5">
                    <option value="NEW">New</option>
                    <option value="READ">Read</option>
                    <option value="RESPONDED">Responded</option>
                  </select>
                </div>
              </AdminActionForm>
            </div>
          </article>
        ))}
        {!messages.length && (
          <div className="border border-dashed border-line px-5 py-12 text-center text-xs text-muted">
            No messages in this view.
          </div>
        )}
      </div>
    </div>
  );
}

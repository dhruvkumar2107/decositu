import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { deleteSubscriberAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Newsletter" };

export default async function AdminNewsletterPage() {
  await requireAdmin("/admin/newsletter");
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return (
    <div>
      <div className="border-b border-line pb-6">
        <p className="eyebrow text-muted">Audience</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Newsletter.</h1>
        <p className="mt-3 text-xs text-muted">
          {subscribers.length} subscribers shown · newest first · export from your email platform before sending.
        </p>
      </div>

      <div className="mt-5 overflow-x-auto border border-line bg-paper">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead className="border-b border-line bg-cream/60 text-[0.56rem] uppercase tracking-[0.1em] text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Subscribed</th>
              <th className="px-4 py-3 font-semibold">Consent</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {subscribers.length ? (
              subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-cream/30">
                  <td className="px-4 py-3">{subscriber.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[0.65rem] text-muted">{formatDateTime(subscriber.createdAt)}</td>
                  <td className="px-4 py-3 text-[0.65rem] text-olive">{subscriber.consent ? "Opted in" : "No consent"}</td>
                  <td className="px-4 py-3">
                    <form action={deleteSubscriberAction} className="flex justify-end">
                      <input type="hidden" name="id" value={subscriber.id} />
                      <ConfirmButton
                        message={`Remove ${subscriber.email} from the newsletter list?`}
                        className="inline-flex items-center gap-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.07em] text-muted hover:text-wine"
                      >
                        <Trash2 size={12} /> Remove
                      </ConfirmButton>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-muted">No newsletter subscribers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 max-w-2xl text-[0.62rem] leading-5 text-muted">
        Only email addresses with explicit consent are stored. Honour unsubscribe requests promptly and
        export only for communications the subscriber has agreed to receive.
      </p>
    </div>
  );
}

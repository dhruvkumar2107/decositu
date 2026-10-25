import Link from "next/link";
import { ContentHeader } from "@/components/content/ContentHeader";

export function LegalLayout({
  title,
  description,
  updated,
  sections,
  contactEmail,
}: {
  title: string;
  description: string;
  updated: string;
  sections: { id: string; title: string; content: React.ReactNode }[];
  contactEmail: string;
}) {
  return (
    <>
      <ContentHeader
        eyebrow="Legal & policies"
        title={title}
        description={description}
      />

      <div className="container-luxe py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.5fr_1.5fr] lg:gap-20">
          <aside className="lg:sticky lg:top-[130px] lg:self-start">
            <p className="eyebrow text-muted">On this page</p>
            <nav aria-label="Policy sections" className="mt-4">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="block border-b border-line py-2.5 text-xs text-muted transition-colors hover:text-ink">
                  {section.title}
                </a>
              ))}
            </nav>
            <div className="mt-7 border border-line bg-paper p-4">
              <p className="text-[0.57rem] font-semibold uppercase tracking-[0.1em] text-muted">Last updated</p>
              <p className="mt-1 text-xs">{updated}</p>
              <p className="mt-4 text-[0.65rem] leading-5 text-muted">
                Questions about this policy? Write to{" "}
                <a href={`mailto:${contactEmail}`} className="text-ink underline decoration-line underline-offset-4">
                  {contactEmail}
                </a>
                .
              </p>
            </div>
          </aside>

          <div className="max-w-3xl">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-28 border-b border-line py-8 first:pt-0 last:border-0">
                <div className="flex items-baseline gap-3">
                  <span className="text-[0.55rem] font-semibold tracking-[0.1em] text-olive">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-3xl leading-tight">{section.title}</h2>
                </div>
                <div className="mt-4 space-y-3 text-[0.72rem] leading-6 text-muted [&_a]:text-ink [&_a]:underline [&_a]:decoration-line [&_a]:underline-offset-4 [&_strong]:font-semibold [&_strong]:text-ink">
                  {section.content}
                </div>
              </section>
            ))}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">Contact us</Link>
              <Link href="/faq" className="btn btn-outline">Read the FAQs</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container-luxe py-8 md:py-14">
      <div className="grid overflow-hidden border border-line bg-paper lg:min-h-[680px] lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden min-h-[300px] overflow-hidden bg-charcoal lg:block">
          <Image
            src="/images/campaign-bedding.jpg"
            alt="A softly layered Decoritu bedroom"
            fill
            priority
            sizes="45vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-charcoal/10" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-ivory xl:p-12">
            <p className="eyebrow text-ivory/65">The Decoritu note</p>
            <p className="mt-4 max-w-sm font-display text-4xl leading-[0.98] xl:text-5xl">
              A home is layered slowly, with pieces that earn their place.
            </p>
            <div className="mt-8 grid gap-2.5 text-[0.68rem] text-ivory/75">
              {["Order updates and saved addresses", "Faster checkout", "Your reviews in one place"].map(
                (item) => (
                  <p key={item} className="flex items-center gap-2">
                    <Check size={13} className="text-sage" /> {item}
                  </p>
                ),
              )}
            </div>
            <Link
              href="/collections/bestsellers"
              className="link-underline mt-9 inline-flex text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ivory"
            >
              Explore the collection
            </Link>
          </div>
        </aside>

        <div className="flex items-center bg-paper px-5 py-12 sm:px-10 md:px-16 lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-[430px]">{children}</div>
        </div>
      </div>
    </section>
  );
}

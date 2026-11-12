import { MapPin, Phone, User } from "lucide-react";
import { storeAddressText, storeInfo, storeMapUrl, telHref } from "@/lib/store-info";

export function VisitStore() {
  return (
    <section className="border-y border-line bg-paper py-16 md:py-20">
      <div className="container-luxe grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        <div>
          <p className="eyebrow text-muted">Visit our store</p>
          <h2 className="display mt-4 text-[2.4rem] leading-[0.98] sm:text-[3rem]">
            {storeInfo.tagline}.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-muted">{storeInfo.intro}</p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {storeInfo.services.map((service) => (
              <li
                key={service}
                className="rounded-full border border-line px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em]"
              >
                {service}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5 border border-line bg-ivory p-6 sm:p-8">
          <div className="flex gap-3">
            <User size={16} className="mt-0.5 shrink-0 text-olive" strokeWidth={1.5} />
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted">Contact person</p>
              <p className="mt-1 text-sm">{storeInfo.contactPerson}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Phone size={16} className="mt-0.5 shrink-0 text-olive" strokeWidth={1.5} />
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted">Phone</p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {storeInfo.phones.map((phone) => (
                  <a key={phone} href={telHref(phone)} className="hover:text-olive">
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-olive" strokeWidth={1.5} />
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted">Address</p>
              <p className="mt-1 text-sm leading-6">{storeAddressText}</p>
              <a
                href={storeMapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-olive underline underline-offset-4"
              >
                Get directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

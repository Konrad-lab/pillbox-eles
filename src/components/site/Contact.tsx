import { Building2, Mail, MapPin, Phone, Receipt } from "lucide-react";
import { Reveal } from "./Reveal";

const COMPANY = {
  name: "RAGAMINI Kft.",
  email: "ragaminikft@gmail.com",
  phone: "+36 70 403 2633",
  address: "6100 Kiskunfélegyháza, Bercsényi utca 41.",
  taxNumber: "32879997-2-03",
};

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-16 sm:py-28">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-brand uppercase sm:text-xs">
            Kapcsolat
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-balance sm:mt-4 sm:text-4xl">
            Lépj kapcsolatba velünk
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
            Partnerség, telepítés vagy kérdés – elérhetőségeink alább.
          </p>
        </Reveal>

        <div className="mt-9 grid gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-2">
          <Reveal>
            <a
              href={`mailto:${COMPANY.email}`}
              className="hover-ring-bloom glass-strong flex h-full items-start gap-4 rounded-[1.5rem] p-6 sm:rounded-[2.25rem] sm:p-8"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] text-primary-foreground shadow-[var(--shadow-soft)]">
                <Mail className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.65rem] font-semibold tracking-[0.18em] text-brand uppercase">
                  E-mail
                </span>
                <span className="mt-1.5 block text-base font-bold break-words sm:text-lg">
                  {COMPANY.email}
                </span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.08}>
            <a
              href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
              className="hover-ring-bloom glass-strong flex h-full items-start gap-4 rounded-[1.5rem] p-6 sm:rounded-[2.25rem] sm:p-8"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] text-primary-foreground shadow-[var(--shadow-soft)]">
                <Phone className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.65rem] font-semibold tracking-[0.18em] text-brand uppercase">
                  Telefon
                </span>
                <span className="mt-1.5 block text-base font-bold sm:text-lg">{COMPANY.phone}</span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.16} className="lg:col-span-2">
            <div className="glass-panel rounded-[1.5rem] p-6 sm:rounded-[2.25rem] sm:p-8">
              <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-brand uppercase">
                Cégadatok
              </p>
              <ul className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                <li className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span className="font-semibold">{COMPANY.name}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span className="min-w-0">{COMPANY.address}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>Adószám: {COMPANY.taxNumber}</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

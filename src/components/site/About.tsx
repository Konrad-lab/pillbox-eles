import { Compass, Target, Trophy } from "lucide-react";
import { Reveal } from "./Reveal";

const PILLARS = [
  {
    icon: Target,
    title: "Küldetésünk",
    text: "Célunk, hogy az alapvető egészségügyi termékek bárhol, bármikor elérhetők legyenek.",
  },
  {
    icon: Compass,
    title: "Jövőképünk",
    text: "Célunk egy országos Pillbox automata-hálózat kiépítése, amelynek köszönhetően minden magyar nagyvárosban néhány percen belül elérhetővé válik egy Pillbox automata. Folyamatosan azon dolgozunk, hogy szolgáltatásunk egyre több helyszínen nyújtson gyors, megbízható és kényelmes megoldást.",
  },
  {
    icon: Trophy,
    title: "Miért minket válassz?",
    text: "A Pillbox mögött gyógyszerészi szakmai háttér áll, amely biztosítja, hogy automatáink kínálata kizárólag megbízható minőségű, gondosan válogatott termékekből álljon.",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-16 sm:py-28"
      style={{ containIntrinsicSize: "0 500px", contentVisibility: "auto" }}
    >
      <div className="section-shell">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-brand uppercase sm:text-xs">
              Rólunk
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-balance sm:mt-4 sm:text-4xl">
              Egy egészségügyi technológiai vállalat, nem egy automata-üzemeltető
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base">
              A Pillbox egy magyar alapítású családi vállalkozás, amelynek küldetése, hogy az
              egészségügyi és személyes higiéniai termékek a nap 24 órájában könnyen elérhetők
              legyenek. Célunk, hogy a mindennapi infrastruktúrába integrált megoldások révén
              gyorsabbá, diszkrétebbé és kényelmesebbé tegyük a hozzáférést ezekhez az alapvető
              termékekhez.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:gap-5">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.1}>
                <article className="hover-sheen glass-panel group flex gap-4 rounded-[1.5rem] p-5 sm:gap-5 sm:rounded-3xl sm:p-7">
                  <div className="glass-subtle grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-brand transition-all duration-500 group-hover:-translate-y-1 group-hover:rounded-full group-hover:bg-[image:var(--gradient-brand)] group-hover:text-primary-foreground sm:h-12 sm:w-12">
                    <pillar.icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-bold tracking-tight sm:text-lg">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {pillar.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

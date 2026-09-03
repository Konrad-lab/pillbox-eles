import { Clock, HeartPulse, MousePointerClick, Zap } from "lucide-react";
import { Reveal } from "./Reveal";

const FEATURES = [
  {
    icon: Zap,
    title: "Gyors",
    text: "Harminc másodperc az érintéstől a termékig",
  },
  {
    icon: Clock,
    title: "0-24 elérhető",
    text: "Éjszaka, hétvégén, ünnepnapon is\u00a0",
  },
  {
    icon: HeartPulse,
    title: "Egészségközpontú",
    text: "Szakmailag válogatott kínálat",
  },
  {
    icon: MousePointerClick,
    title: "Egyszerű",
    text: "Érintőképernyő és érintéses fizetés,",
  },
];

export function Features() {
  return (
    <section
      className="section-shell py-14 sm:py-24"
      style={{ containIntrinsicSize: "0 400px", contentVisibility: "auto" }}
    >
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-balance sm:text-4xl">
          Modern egészségügyi ellátás, automatizálva
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">{"\n"}</p>
      </Reveal>

      <div className="mt-9 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {FEATURES.map((feature, i) => (
          <Reveal key={feature.title} delay={i * 0.08}>
            <article className="hover-tilt glass-panel group h-full rounded-[1.5rem] p-5 sm:rounded-3xl sm:p-7">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[image:var(--gradient-brand)] text-primary-foreground transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12 sm:h-12 sm:w-12">
                <feature.icon className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-base font-bold tracking-tight sm:mt-6 sm:text-lg">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

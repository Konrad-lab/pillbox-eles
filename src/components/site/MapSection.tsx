import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Clock, MapPin, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import partyLogo from "@/assets/logo-partybox.png";
import { machinesQueryOptions } from "@/data/machineSource";
import { HU_HEIGHT, HU_OUTLINE_PATH, HU_WIDTH, projectHU } from "@/data/hungaryOutline";
import { MACHINE_STATUS_LABEL, type Machine } from "@/data/types";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Reveal } from "./Reveal";

export function MapSection() {
  const { data: machines = [], isLoading } = useQuery(machinesQueryOptions);
  const [selected, setSelected] = useState<Machine | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const openMachine = (machine: Machine) => {
    if (isMobile) {
      void navigate({ to: "/gep/$machineId", params: { machineId: machine.id } });
      return;
    }
    setSelected(machine);
  };


  return (
    <section id="map" className="section-shell py-16 sm:py-28" style={{ containIntrinsicSize: "0 600px", contentVisibility: "auto" }}>
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-brand uppercase sm:text-xs">
          Térkép
        </p>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-balance sm:mt-4 sm:text-4xl">
          Találd meg a hozzád legközelebbi Pillbox automatát
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
          Kattints egy logóra a részletekért.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-9 sm:mt-14">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.55fr_1fr]">
          <div className="glass-panel relative overflow-hidden rounded-[1.5rem] p-3 sm:rounded-[2.5rem] sm:p-6">
            <svg
              viewBox={`0 0 ${HU_WIDTH} ${HU_HEIGHT}`}
              className="h-full w-full"
              role="img"
              aria-label="Magyarország térképe a Pillbox automatákkal"
            >
              <defs>
                <clipPath id="pb-marker-clip">
                  <rect x="-15" y="-15" width="30" height="30" rx="6" ry="6" />
                </clipPath>
                <linearGradient id="pb-land" x1="0" y1="0" x2="0.6" y2="1">
                  <stop offset="0%" stopColor="var(--brand-tint)" />
                  <stop offset="100%" stopColor="var(--muted)" />
                </linearGradient>
              </defs>

              <path
                d={HU_OUTLINE_PATH}
                fill="url(#pb-land)"
                stroke="var(--brand-deep)"
                strokeWidth={1.6}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />

              {machines.map((machine) => {
                const { x, y } = projectHU(machine.lng, machine.lat);
                const active = selected?.id === machine.id;
                const festival = machine.edition === "festival";
                return (
                  <g
                    key={machine.id}
                    transform={`translate(${x} ${y})`}
                    className="map-marker"
                    style={{ cursor: "pointer", touchAction: "manipulation" }}
                    onPointerUp={(event) => {
                      if (event.button !== 0 && event.pointerType === "mouse") return;
                      openMachine(machine);
                    }}


                    role="button"
                    tabIndex={0}
                    aria-label={`${machine.name} - termékek megtekintése`}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openMachine(machine);
                      }
                    }}
                  >
                    {/* Generous, invisible tap area (≈48px touch target) */}
                    <circle r={38} fill="transparent" stroke="transparent" />
                    <rect
                      className="map-marker-halo"
                      x={-18}
                      y={-18}
                      width={36}
                      height={36}
                      rx={8}
                      ry={8}
                      fill="none"
                      stroke={festival ? "var(--party-pink)" : "var(--brand)"}
                      strokeWidth={2}
                      opacity={0.45}
                      pointerEvents="none"
                    />
                    <rect
                      x={-(active ? 20 : 18)}
                      y={-(active ? 20 : 18)}
                      width={active ? 40 : 36}
                      height={active ? 40 : 36}
                      rx={8}
                      ry={8}
                      fill={"white"}
                      stroke={festival ? "var(--party-pink)" : "var(--brand)"}
                      strokeWidth={active ? 3 : 2}
                      pointerEvents="none"
                    />
                    <image
                      href={festival ? partyLogo : logo}
                      x={-15}
                      y={-15}
                      width={30}
                      height={30}
                      clipPath="url(#pb-marker-clip)"
                      preserveAspectRatio="xMidYMid meet"
                      pointerEvents="none"
                    />
                    <text
                      y={-27}
                      textAnchor="middle"
                      className={`text-[15px] font-semibold ${festival ? "fill-[var(--party-pink)]" : "fill-foreground"}`}
                      pointerEvents="none"
                    >
                      {machine.city}
                    </text>
                  </g>

                );
              })}
            </svg>

            {isLoading && (
              <div className="absolute inset-0 grid place-items-center bg-white/50 backdrop-blur-sm">
                <span className="text-sm text-muted-foreground">Automaták betöltése…</span>
              </div>
            )}
          </div>

          <div className="relative min-h-[22rem] sm:min-h-[26rem]">
            <AnimatePresence mode="wait">
              {selected ? (
                <MachinePanel
                  key={selected.id}
                  machine={selected}
                  onClose={() => setSelected(null)}
                />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-panel flex h-full flex-col justify-center rounded-[1.5rem] p-6 text-center sm:rounded-[2.5rem] sm:p-8"
                >
                  <MapPin className="mx-auto h-9 w-9 text-brand" />
                  <h3 className="mt-4 text-lg font-bold">Válassz egy automatát</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {machines.length} aktív Pillbox a térképen. Kattints bármelyikre a részletek és
                    termékinformációk megtekintéséhez.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function MachinePanel({ machine, onClose }: { machine: Machine; onClose: () => void }) {
  // keep festival flag in case we want to show a subtle label, but avoid applying a full purple/pink theme
  const festival = machine.edition === "festival";

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-strong overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem]`}
    >
      <div className="flex items-start justify-between gap-3 p-5 pb-0 sm:p-7 sm:pb-0">
        <div className="min-w-0">
          {festival && <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-[color:var(--brand)] text-white">Partybox</span>}
          {machine.status === "temporarily_closed" && (
            <span
              className={`inline-block rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800 ${
                festival ? "ml-2" : ""
              }`}
            >
              {MACHINE_STATUS_LABEL.temporarily_closed}
            </span>
          )}
          <h3 className="mt-2 text-xl font-extrabold tracking-tight">{machine.name}</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Bezárás"
          className="glass-subtle grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:rotate-90"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5 pt-3 sm:p-7 sm:pt-4">
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className={`mt-0.5 h-4 w-4 shrink-0 text-brand`} />
          {machine.address}, {machine.city}
        </p>
        {machine.period && (
          <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className={`h-4 w-4 shrink-0 text-brand`} />
            {machine.period}
          </p>
        )}
        <p className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className={`h-4 w-4 shrink-0 text-brand`} />
          {machine.availability}
        </p>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{machine.description}</p>

        <Button 
          asChild 
          size="lg" 
          className={`mt-6 h-12 w-full rounded-full`}
        >
          <Link to="/gep/$machineId" params={{ machineId: machine.id }}>
            Termékek megtekintése
          </Link>
        </Button>
      </div>
    </motion.aside>
  );
}

import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import heroImage from "@/assets/hero.jpg";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "6%" : "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "-6%" : "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-40 sm:pb-28"
    >
      <motion.div style={{ y: contentY, opacity: fade }} className="section-shell relative">
        <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <motion.a
              href="#about"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.4 : 0.6 }}
              className="glass-panel inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.65rem] font-semibold tracking-wide text-brand-deep uppercase sm:text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Egészség, karnyújtásnyira
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.5 : 0.8, delay: isMobile ? 0.04 : 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 flex items-center gap-3 sm:mt-7 sm:gap-4"
            >
              <img
                src={logo}
                alt="Pillbox logó"
                width={64}
                height={64}
                className="h-11 w-11 shrink-0 rounded-xl object-contain sm:h-14 sm:w-14 sm:rounded-2xl"
              />
              <span className="min-w-0 text-xs font-medium text-muted-foreground sm:text-sm">
                Magyarország egészségügyi automata hálózata
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.6 : 0.9, delay: isMobile ? 0.07 : 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-[2rem] leading-[1.08] font-extrabold tracking-tight text-balance sm:mt-6 sm:text-6xl"
            >
              Az egészség nem várhat <span className="brand-gradient-text">nyitvatartásra</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.6 : 0.9, delay: isMobile ? 0.11 : 0.22 }}
              className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg"
            >
              A Pillbox okos automatái mindennapi egészségügyi termékeket, vitaminokat és szezonális
              készítményeket tesznek elérhetővé az ország legforgalmasabb pontjain - éjjel-nappal,
              sorban állás nélkül.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.6 : 0.9, delay: isMobile ? 0.15 : 0.3 }}
              className="mt-8 flex sm:mt-9"
            >
              <Button
                asChild
                size="lg"
                className="group h-12 w-full rounded-full px-7 shadow-[var(--shadow-soft)] sm:w-auto"
              >
                <a href="#about">
                  Tudj meg többet
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: isMobile ? 0.7 : 1, delay: isMobile ? 0.25 : 0.5 }}
              className="mt-7 flex items-start gap-2 text-xs text-muted-foreground sm:mt-9 sm:items-center"
            >
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand sm:mt-0" />
              Minősített partnerekkel, gyógyszerész szakmai felügyelet mellett
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: isMobile ? 0.97 : 0.94, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: isMobile ? 0.8 : 1.1, delay: isMobile ? 0.1 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-[image:var(--gradient-glow)] blur-2xl" />
            <motion.div
              style={{ y: imageY, willChange: "transform" }}
              className="overflow-hidden rounded-[1.75rem] border border-white/70 shadow-[var(--shadow-lift)] sm:rounded-[2.5rem]"
            >
              <img
                src={heroImage}
                alt="Pillbox egészségügyi automata egy világos előcsarnokban"
                width={1600}
                height={1104}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

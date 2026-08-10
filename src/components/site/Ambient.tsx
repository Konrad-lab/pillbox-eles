import { motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Soft, abstract blurred background used behind every page so the
 * glassmorphism panels always have something to refract.
 */
export function Ambient({ dense = false }: { dense?: boolean }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[image:var(--gradient-page)]" />
      <motion.div
        animate={isMobile ? { y: [0, 20, 0] } : { y: [0, 40, 0], x: [0, 24, 0] }}
        transition={{ duration: isMobile ? 30 : 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-24 h-[22rem] w-[22rem] rounded-full bg-brand-soft/70 blur-3xl sm:h-[34rem] sm:w-[34rem]"
        style={{ willChange: "transform" }}
      />
      <motion.div
        animate={isMobile ? { y: [0, -20, 0] } : { y: [0, -46, 0], x: [0, -28, 0] }}
        transition={{ duration: isMobile ? 35 : 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 -right-28 h-[20rem] w-[20rem] rounded-full bg-accent/70 blur-3xl sm:h-[32rem] sm:w-[32rem]"
        style={{ willChange: "transform" }}
      />
      <motion.div
        animate={{ y: [0, isMobile ? 15 : 30, 0] }}
        transition={{ duration: isMobile ? 25 : 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-6rem] left-1/4 h-[16rem] w-[16rem] rounded-full bg-brand/15 blur-3xl sm:h-[26rem] sm:w-[26rem]"
        style={{ willChange: "transform" }}
      />
      {dense && (
        <motion.div
          animate={{ scale: [1, isMobile ? 1.08 : 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: isMobile ? 20 : 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[image:var(--gradient-glow)] blur-2xl sm:h-[46rem] sm:w-[46rem]"
          style={{ willChange: "transform, opacity" }}
        />
      )}
    </div>
  );
}

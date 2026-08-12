import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const LINKS = [
  { label: "Rólunk", href: "#about" },
  { label: "Térkép", href: "#map" },
  { label: "Kapcsolat", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <nav
        className={`section-shell flex items-center gap-3 rounded-full py-2 transition-all duration-500 sm:gap-4 sm:py-2.5 ${
          scrolled || open ? "glass-strong" : "border border-transparent"
        }`}
      >
        <a href="#top" className="flex min-w-0 items-center gap-2.5">
          <img
            src={logo}
            alt="Pillbox logó"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-lg object-contain sm:h-11 sm:w-11 sm:rounded-xl"
          />
          <span className="truncate text-base font-extrabold tracking-tight sm:text-lg">
            Pillbox
          </span>
        </a>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover-underline-grow rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü"
          aria-expanded={open}
          className="glass-subtle ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-full lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="section-shell mt-2 lg:hidden"
          >
            <div className="glass-strong flex flex-col gap-1 rounded-3xl p-3">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3.5 text-sm font-medium transition-colors active:bg-white/60"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

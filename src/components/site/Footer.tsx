import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

const NAV = [
  { label: "Rólunk", href: "#about" },
  { label: "Térkép", href: "#map" },
  { label: "Kapcsolat", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="glass-strong mx-3 mb-3 rounded-[1.75rem] sm:mx-5 sm:mb-5 sm:rounded-[2.5rem]">
      <div className="section-shell grid gap-8 py-10 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src={logo}
              alt="Pillbox logó"
              loading="lazy"
              width={40}
              height={40}
              className="h-9 w-9 rounded-xl object-contain"
            />
            <span className="text-lg font-extrabold tracking-tight">Pillbox</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Egészségügyi automata hálózat Magyarországon.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Navigáció</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover-underline-grow hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Kapcsolat</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>ragaminikft@gmail.com</li>
            <li>+36 70 403 2633</li>
            <li>6100 Kiskunfélegyháza, Ficsór József u. 1</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Közösség</p>
          <div className="mt-4 flex gap-2">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#top"
                aria-label="Közösségi oldal"
                className="hover-pop glass-subtle grid h-11 w-11 place-items-center rounded-full text-muted-foreground hover:text-brand-deep"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/50">
        <div className="section-shell flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:py-6">
          <span>© {new Date().getFullYear()} RAGAMINI Kft. Minden jog fenntartva.</span>
          <span>Prototípus - demonstrációs célú tartalommal.</span>
        </div>
      </div>
    </footer>
  );
}

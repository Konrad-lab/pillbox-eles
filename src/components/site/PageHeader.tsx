import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

/** Lightweight header for standalone pages (machine list, product details, QR entry). */
export function PageHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav className="section-shell glass-strong flex items-center gap-3 rounded-full py-2 sm:py-2.5">
        <Link to="/pillbox" className="flex min-w-0 items-center gap-2.5">
          <img
            src={logo}
            alt="Pillbox logó"
            width={40}
            height={40}
            className="h-8 w-8 shrink-0 rounded-lg sm:h-9 sm:w-9 sm:rounded-xl"
          />
          <span className="truncate text-base font-extrabold tracking-tight sm:text-lg">
            Pillbox
          </span>
        </Link>
      </nav>
    </header>
  );
}

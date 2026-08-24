import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { useEffect } from "react";

import { Ambient } from "@/components/site/Ambient";
import { PageHeader } from "@/components/site/PageHeader";

import { machinesQueryOptions } from "@/data/machineSource";

import {
  formatPrice,
  MACHINE_STATUS_LABEL,
  STOCK_LABEL,
  type MachineProduct,
  type MachineEdition,
} from "@/data/types";

import { useProductSync } from "@/hooks/useProductSync";

const FIRST_POSITION = 10;
const SHELF_SIZE = 6;
const SHELF_COUNT = 10;
const LAST_POSITION = FIRST_POSITION + SHELF_SIZE * SHELF_COUNT - 1;

export const Route = createFileRoute("/gep/$machineId")({
  head: (ctx) => {
    const { machineId } = ctx.params;

    // Note: We can't access data here, so we'll use a head component in the body to set dynamic favicon
    return {
      meta: [
        { title: "Pillbox automata - elérhető termékek" },
        {
          name: "description",
          content:
            "Nézd meg, milyen termékek érhetők el ebben a Pillbox automatában: nevek, árak és részletes termékinformációk.",
        },
        {
          property: "og:title",
          content: "Pillbox automata - elérhető termékek",
        },
        {
          property: "og:description",
          content:
            "Termékkínálat, árak és részletes információk a kiválasztott Pillbox automatában.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: MachinePage,
});

function MachinePage() {
  const { machineId } = Route.useParams();

  const { data: machines, isLoading } = useQuery(machinesQueryOptions);

  const machine = machines?.find((item) => item.id === machineId);

  // Get multi-sheet products
  const {
    products: multiSheetProducts,
    loading: productsLoading,
    error: productsError,
    lastSync,
  } = useProductSync(15);

  // Dynamic favicon based on machine edition
  useEffect(() => {
    if (machine?.edition === "festival") {
      // For partybox, you could set a different favicon if you have one
      // For now, we'll keep the same favicon but you could add:
      // const link = document.querySelector("link[rel~='icon']");
      // if (link) link.href = "/partybox-favicon.png";
    }
  }, [machine]);

  if (!isLoading && machines && !machine) throw notFound();

  // Filter products based on machine location
  const filteredProducts = multiSheetProducts.filter(product => {
    if (machine?.city === "Kiskunfélegyháza") {
      return product.source === "Kiskunfélegyháza" || product.source === "Sheet1" || product.source === "Sheet3";
    }
    if (machine?.city === "Alsóörs") {
      return product.source === "Alsóörs partybox";
    }
    if (machine?.city === "Budaörs") {
      return product.source === "Sheet3" || product.source === "Budaörs";
    }
    return false;
  });

  // 10 shelves of 6 slots, numbered 10-69 in the sheet: 10-15 is the top
  // shelf left to right, 16-21 the next one down, and so on.
  const productsByPosition = new Map(
    filteredProducts
      .filter(
        (product) =>
          product.position >= FIRST_POSITION && product.position <= LAST_POSITION,
      )
      .map((product) => [product.position, product]),
  );
  const shelves = Array.from({ length: SHELF_COUNT }, (_, shelfIndex) =>
    Array.from(
      { length: SHELF_SIZE },
      (_, slotIndex) => FIRST_POSITION + shelfIndex * SHELF_SIZE + slotIndex,
    ),
  ).filter((positions) =>
    positions.some((position) => productsByPosition.has(position)),
  );

  return (
    <main className="relative min-h-[100svh] pb-16 sm:pb-24">
      <Ambient />

      <PageHeader />

      <div className="section-shell pt-24 sm:pt-32">
        <Link
          to="/"
          hash="map"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Vissza a térképhez
        </Link>

        {!machine ? (
          <p className="mt-10 text-sm text-muted-foreground">
            Automata betöltése…
          </p>
        ) : (
          <>
            <header
              className={`glass-strong mt-5 rounded-[1.5rem] p-5 sm:mt-7 sm:rounded-[2.5rem] sm:p-9 ${
                machine.edition === "festival"
                  ? "party-surface party-glow"
                  : ""
              }`}
            >
              {machine.edition === "festival" && (
                <span className="party-chip">Partybox edition</span>
              )}

              {machine.status === "temporarily_closed" && (
                <span
                  className={`inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 ${
                    machine.edition === "festival" ? "ml-2" : ""
                  }`}
                >
                  {MACHINE_STATUS_LABEL.temporarily_closed}
                </span>
              )}

              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-balance sm:text-4xl">
                {machine.name}
              </h1>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <MapPin
                    className={`h-4 w-4 ${
                      machine.edition === "festival"
                        ? "text-foreground"
                        : "text-brand"
                    }`}
                  />
                  {machine.address}, {machine.city}
                </span>

                {machine.period && (
                  <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                    <CalendarDays
                      className={`h-4 w-4 ${
                        machine.edition === "festival"
                          ? "text-foreground"
                          : "text-brand"
                      }`}
                    />
                    {machine.period}
                  </span>
                )}

                <span className="inline-flex items-center gap-2">
                  <Clock
                    className={`h-4 w-4 ${
                      machine.edition === "festival"
                        ? "text-foreground"
                        : "text-brand"
                    }`}
                  />
                  {machine.availability}
                </span>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {machine.description}
              </p>

              <p className="mt-4 text-xs text-muted-foreground">
                {!productsLoading
                  ? `${filteredProducts.length} termék · frissítve: ${
                      lastSync
                        ? new Date(lastSync).toLocaleTimeString("hu-HU")
                        : "-"
                    }`
                  : "Termékek betöltése..."}
              </p>
            </header>

            <div className="mt-8 space-y-8 sm:mt-12 sm:space-y-12">
              {productsLoading ? (
                <p className="text-sm text-muted-foreground">
                  Termékek betöltése...
                </p>
              ) : productsError ? (
                <p className="text-sm text-muted-foreground">
                  A termékek betöltése nem sikerült. Kérjük, próbáld újra később.
                </p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nincs elérhető termék ebben az automatában.
                </p>
              ) : (
<<<<<<< HEAD
                shelves.map((shelf) => (
                  <section key={shelf}>
                    <ul className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {filteredProducts
                        .filter((product) => product.shelf === shelf)
                        .sort((a, b) => a.id.localeCompare(b.id))
                        .map((product) => (
                          <MultiSheetProductCard key={product.id} product={product} edition={machine.edition} />
                        ))}
                    </ul>
                  </section>
                ))
=======
                <section>
                  <h2
                    className={`text-[0.65rem] font-semibold tracking-[0.2em] uppercase sm:text-xs ${
                      machine.edition === "festival"
                        ? "text-foreground"
                        : "text-brand"
                    }`}
                  >
                    Termékek
                  </h2>

                  <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-4">
                    {shelves.map((positions) => (
                      <ul
                        key={`shelf-${positions[0]}`}
                        className="grid grid-cols-6 gap-1.5 sm:gap-4"
                      >
                        {positions.map((position) => {
                          const product = productsByPosition.get(position);

                          if (!product) {
                            return (
                              <li
                                key={`empty-${position}`}
                                aria-hidden="true"
                                className="min-w-0"
                              />
                            );
                          }

                          return (
                            <MultiSheetProductCard
                              key={`${product.id}-${position}`}
                              product={product}
                              edition={machine.edition}
                            />
                          );
                        })}
                      </ul>
                    ))}
                  </div>
                </section>
>>>>>>> 22396b2353a41e74a5f7ad0e80127e270e8201bd
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function ProductCard({
  product,
  edition,
}: {
  product: MachineProduct;
  edition: MachineEdition;
}) {
  const isParty = edition === "festival";

  return (
    <li>
      <Link
        to="/termek/$productId"
        params={{ productId: product.id }}
        className={`hover-sheen group flex h-full flex-col rounded-[1.25rem] p-5 sm:rounded-[1.75rem] ${
          isParty
            ? "party-surface party-glow party-hover"
            : "glass-panel"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold tracking-tight sm:text-lg">
              {product.name}
            </h3>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-medium ${
              product.stock === "in_stock"
                ? "bg-secondary text-secondary-foreground"
                : product.stock === "low"
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {STOCK_LABEL[product.stock]}
          </span>
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {product.info}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-lg font-extrabold tracking-tight">
            {formatPrice(product.price)}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
              isParty
                ? "text-[var(--party-pink)]"
                : "text-brand-deep"
            }`}
          >
            Részletek

            <ArrowRight
              className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${
                isParty ? "text-[var(--party-pink)]" : ""
              }`}
            />
          </span>
        </div>
      </Link>
    </li>
  );
}

function MultiSheetProductCard({
  product,
  edition,
}: {
  product: {
    id: string;
    price: string;
    name: string;
    source: string;
    category: string;
    position: number;
  };
  edition: MachineEdition;
}) {
  const isParty = edition === "festival";

  return (
    <li className="min-w-0">
      <div
        className={`hover-sheen group flex h-full flex-col rounded-[1rem] p-1.5 sm:rounded-[1.75rem] sm:p-5 ${
          isParty
            ? "party-surface party-glow party-hover"
            : "brand-surface brand-glow brand-hover"
        }`}
      >
        <div className="flex items-start justify-between gap-1.5 sm:gap-3">
          <div className="min-w-0">
            <h3 className="hyphens-auto text-[0.6rem] leading-tight font-bold tracking-tight break-words sm:text-lg sm:leading-snug">
              {product.name}
            </h3>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2 sm:pt-5">
          <span className="text-[0.6rem] font-extrabold tracking-tight break-words sm:text-lg">
            {product.price}
          </span>
        </div>
      </div>
    </li>
  );
}

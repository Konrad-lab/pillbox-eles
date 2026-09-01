import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, Info, MapPin, Package } from "lucide-react";
import { Ambient } from "@/components/site/Ambient";
import { PageHeader } from "@/components/site/PageHeader";
import { machinesQueryOptions, productsQueryOptions } from "@/data/machineSource";
import { formatPrice, type Product } from "@/data/types";
import { useProductSync } from "@/hooks/useProductSync";
import { productNamesMatch, slugifyProductName } from "@/lib/productMatch";

export const Route = createFileRoute("/termek/$productId")({
  validateSearch: (search: Record<string, unknown>): { gep?: string } => ({
    gep: typeof search.gep === "string" ? search.gep : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Termékinformáció - Pillbox" },
      {
        name: "description",
        content:
          "Részletes termékinformáció a Pillbox automatákban elérhető termékekről: ár, kiszerelés és leírás.",
      },
      { property: "og:title", content: "Termékinformáció - Pillbox" },
      {
        property: "og:description",
        content: "Ár, kiszerelés és részletes leírás a Pillbox automaták termékeiről.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function parseListedPrice(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) || 0 : 0;
}

function ProductPage() {
  const { productId } = Route.useParams();
  const { gep: fromMachineId } = Route.useSearch();
  const { data: catalog, isLoading: catalogLoading } = useQuery(productsQueryOptions);
  const { data: machines = [], isLoading: machinesLoading } = useQuery(machinesQueryOptions);
  const { products: inventory, loading: inventoryLoading } = useProductSync(15);

  const loading = catalogLoading || machinesLoading || inventoryLoading;

  const catalogProduct = catalog?.find((item) => item.id === productId);

  const inventoryMatches = inventory.filter((item) => {
    if (item.catalogId === productId) return true;
    if (slugifyProductName(item.name) === productId) return true;
    if (catalogProduct && productNamesMatch(item.name, catalogProduct.name)) return true;
    return false;
  });

  const fallbackName = inventoryMatches[0]?.name;
  const fallbackPrice = inventoryMatches[0]?.price;

  const product: Product | undefined = catalogProduct
    ? catalogProduct
    : fallbackName
      ? {
          id: productId,
          name: fallbackName,
          price: parseListedPrice(fallbackPrice ?? ""),
          category: inventoryMatches[0]?.category ?? "",
          info: "",
          description: "",
        }
      : undefined;

  if (!loading && !product) throw notFound();

  const availability = inventoryMatches
    .map((entry) => ({
      entry,
      machine: machines.find((machine) => machine.id === entry.machineId),
    }))
    .filter((row) => row.machine);

  const isPartyProduct = availability.some(({ machine }) => machine?.edition === "festival");

  const displayPrice =
    product && product.price > 0
      ? formatPrice(product.price)
      : fallbackPrice
        ? fallbackPrice.includes("Ft")
          ? fallbackPrice
          : `${fallbackPrice} Ft`
        : null;

  const backToMachine = fromMachineId && machines.some((machine) => machine.id === fromMachineId);

  return (
    <main className="relative min-h-[100svh] pb-16 sm:pb-24">
      <Ambient />
      <PageHeader />

      <div className="section-shell pt-24 sm:pt-32">
        {backToMachine && fromMachineId ? (
          <Link
            to="/gep/$machineId"
            params={{ machineId: fromMachineId }}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Vissza az automatához
          </Link>
        ) : (
          <Link
            to="/"
            hash="map"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Vissza a térképhez
          </Link>
        )}

        {!product ? (
          <p className="mt-10 text-sm text-muted-foreground">Termék betöltése…</p>
        ) : (
          <div className="mt-5 grid gap-4 sm:mt-7 sm:gap-6 lg:grid-cols-[1.4fr_1fr]">
            <article
              className={`rounded-[1.5rem] p-5 sm:rounded-[2.5rem] sm:p-9 ${
                isPartyProduct ? "party-surface" : "glass-strong"
              }`}
            >
              <h1 className="text-2xl font-extrabold tracking-tight text-balance sm:text-4xl">
                {product.name}
              </h1>
              {displayPrice && (
                <p
                  className={`mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl ${
                    isPartyProduct ? "text-foreground" : "text-brand-deep"
                  }`}
                >
                  {displayPrice}
                </p>
              )}
              {product.info && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {product.info}
                </p>
              )}
              {product.description && product.description !== product.info && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              )}
              {!product.description && !product.info && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Ehhez a termékhez még nincs részletes leírás a katalógusban.
                </p>
              )}

              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                {product.packageSize && (
                  <div className="glass-subtle rounded-2xl p-4">
                    <dt className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <Package className="h-4 w-4 text-brand" /> Kiszerelés
                    </dt>
                    <dd className="mt-1 text-sm font-semibold">{product.packageSize}</dd>
                  </div>
                )}
                {product.manufacturer && (
                  <div className="glass-subtle rounded-2xl p-4">
                    <dt className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <Building2 className="h-4 w-4 text-brand" /> Forgalmazó
                    </dt>
                    <dd className="mt-1 text-sm font-semibold">{product.manufacturer}</dd>
                  </div>
                )}
              </dl>

              <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                Az árak tájékoztató jellegűek. Gyógyszer jellegű termék esetén olvassa el a
                betegtájékoztatót, vagy kérdezze meg kezelőorvosát, gyógyszerészét.
              </p>
            </article>

            <aside
              className={`h-fit rounded-[1.5rem] p-5 sm:rounded-[2.5rem] sm:p-7 ${
                isPartyProduct ? "party-surface" : "glass-panel"
              }`}
            >
              <h2 className="text-sm font-semibold">Hol érhető el?</h2>
              {availability.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Jelenleg egyik automatában sem elérhető.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {availability.map(({ machine, entry }) =>
                    machine ? (
                      <li key={`${machine.id}-${entry.id}`}>
                        <Link
                          to="/gep/$machineId"
                          params={{ machineId: machine.id }}
                          className="glass-subtle block rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-0.5"
                        >
                          <span className="flex items-center gap-2 text-sm font-semibold">
                            <MapPin className="h-4 w-4 text-brand" />
                            {machine.name}
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            {machine.address}, {machine.city}
                            {entry.price ? ` · ${entry.price}` : ""}
                          </span>
                        </Link>
                      </li>
                    ) : null,
                  )}
                </ul>
              )}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

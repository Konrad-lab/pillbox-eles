import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, Info, MapPin, Package } from "lucide-react";
import { Ambient } from "@/components/site/Ambient";
import { PageHeader } from "@/components/site/PageHeader";
import { machinesQueryOptions, productsQueryOptions } from "@/data/machineSource";
import { formatPrice, STOCK_LABEL } from "@/data/types";

export const Route = createFileRoute("/termek/$productId")({
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

function ProductPage() {
  const { productId } = Route.useParams();
  const { data: products, isLoading } = useQuery(productsQueryOptions);
  const { data: machines = [] } = useQuery(machinesQueryOptions);
  const product = products?.find((item) => item.id === productId);

  if (!isLoading && products && !product) throw notFound();

  const availability = machines
    .map((machine) => ({
      machine,
      entry: machine.products.find((item) => item.id === productId),
    }))
    .filter((row) => row.entry);

  const isPartyProduct = availability.some(({ machine }) => machine.edition === "festival");

  return (
    <main className="relative min-h-[100svh] pb-16 sm:pb-24">
      <Ambient />
      <PageHeader />

      <div className="section-shell pt-24 sm:pt-32">
        <Link
          to="/pillbox"
          hash="map"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Vissza a térképhez
        </Link>

        {!product ? (
          <p className="mt-10 text-sm text-muted-foreground">Termék betöltése…</p>
        ) : (
          <div className="mt-5 grid gap-4 sm:mt-7 sm:gap-6 lg:grid-cols-[1.4fr_1fr]">
            <article className={`rounded-[1.5rem] p-5 sm:rounded-[2.5rem] sm:p-9 ${
              isPartyProduct ? "party-surface" : "glass-strong"
            }`}>
              <h1 className="text-2xl font-extrabold tracking-tight text-balance sm:text-4xl">
                {product.name}
              </h1>
              <p className={`mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl ${
                isPartyProduct ? "text-foreground" : "text-brand-deep"
              }`}>
                {formatPrice(product.price)}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {product.info}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

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

            <aside className={`h-fit rounded-[1.5rem] p-5 sm:rounded-[2.5rem] sm:p-7 ${
              isPartyProduct ? "party-surface" : "glass-panel"
            }`}>
              <h2 className="text-sm font-semibold">Hol érhető el?</h2>
              {availability.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Jelenleg egyik automatában sem elérhető.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {availability.map(({ machine, entry }) => (
                    <li key={machine.id}>
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
                          {machine.address}, {machine.city} ·{" "}
                          {entry ? STOCK_LABEL[entry.stock] : ""}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

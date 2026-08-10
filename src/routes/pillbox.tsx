import { createFileRoute } from "@tanstack/react-router";
import { Ambient } from "@/components/site/Ambient";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { About } from "@/components/site/About";
import { MapSection } from "@/components/site/MapSection";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/pillbox")({
  head: () => ({
    meta: [
      { title: "Pillbox – Egészségügyi automata hálózat Magyarországon" },
      {
        name: "description",
        content:
          "A Pillbox okos automatái vitaminokat, elsősegély- és higiéniai termékeket tesznek elérhetővé 0–24, gyógyszerészi szakmai háttérrel.",
      },
      { property: "og:title", content: "Pillbox – Egészség, karnyújtásnyira" },
      {
        property: "og:description",
        content:
          "Találd meg a hozzád legközelebbi Pillbox automatát, és nézd meg az elérhető termékeket és árakat.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PillboxSite,
});

function PillboxSite() {
  return (
    <main className="relative min-h-screen">
      <Ambient />
      <Navbar />
      <Hero />
      <Features />
      <About />
      <MapSection />
      <Contact />
      <Footer />
    </main>
  );
}

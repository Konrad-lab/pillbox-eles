import type { MachineRow } from "./types";

/**
 * Machine rows shaped exactly like the future spreadsheet export.
 * Each machine references catalogue products by id, so different machines
 * can carry different shelf layouts from the same product database.
 */
export const MOCK_MACHINE_ROWS: MachineRow[] = [
  {
    machine_id: "PB-001",
    name: "Pillbox Kiskunfélegyháza",
    address: "Ficsór József u. 1, 6100",
    city: "Kiskunfélegyháza",
    latitude: 46.7108,
    longitude: 19.8524,
    description:
      "Első Pillbox automatánk gyógyszerészi szakmai felügyelet mellett összeállított kínálattal, a nap 24 órájában elérhetően.",
    products: [
      "PB-P001::1::in_stock",
      "PB-P002::1::in_stock",
      "PB-P003::1::low",
      "PB-P004::2::in_stock",
      "PB-P005::2::in_stock",
      "PB-P006::2::in_stock",
      "PB-P007::2::low",
      "PB-P008::3::in_stock",
      "PB-P009::3::in_stock",
      "PB-P010::3::in_stock",
      "PB-P011::4::in_stock",
      "PB-P012::4::low",
      "PB-P013::4::in_stock",
      "PB-P014::4::in_stock",
      "PB-P015::4::out_of_stock",
    ].join("|"),
    availability: "0–24",
    last_updated: "2026-08-05",
    edition: "health",
  },
  {
    machine_id: "PB-002",
    name: "Pillbox–Partybox Alsóörs",
    address: "Tábor Fesztivál",
    city: "Alsóörs",
    latitude: 46.9781,
    longitude: 17.9822,
    description:
      "Fesztiválautomatánk a Tábor Fesztiválon: másnaposság elleni alapok, elektrolit, fájdalomcsillapítás, higiénia és napvédelem – éjjel-nappal, a helyszínen.",
    products: [
      "PB-P013::1::in_stock",
      "PB-P005::1::in_stock",
      "PB-P004::1::in_stock",
      "PB-P003::1::in_stock",
      "PB-P008::2::in_stock",
      "PB-P010::2::in_stock",
      "PB-P009::2::in_stock",
      "PB-P006::2::in_stock",
      "PB-P007::3::in_stock",
      "PB-P014::3::in_stock",
      "PB-P012::3::low",
      "PB-P002::3::in_stock",
    ].join("|"),
    availability: "0–24 a fesztivál ideje alatt",
    last_updated: "2026-08-09",
    edition: "festival",
    period: "2026.08.26–30.",
  },
];

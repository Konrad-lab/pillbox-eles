import type { MachineRow } from "./types";

export const MOCK_MACHINE_ROWS: MachineRow[] = [
  {
    machine_id: "PB-001",
    name: "Pillbox - Kiskunfélegyháza, Ficsór József utca",
    address: "Ficsór József u. 1, 6100 ",
    city: "Kiskunfélegyháza",
    latitude: 46.7108,
    longitude: 19.8524,
    description:
      "Első Pillbox automatánk gyógyszerészi szakmai felügyelet mellett összeállított kínálattal, a nap 24 órájában elérhetően.",
    availability: "0-24",
    edition: "health",
    status: "temporarily_closed",
  },
  {
    machine_id: "PB-003",
    name: "Pillbox - Budaörs, Hollósy Cukrászat",
    address: "Ibolya u. 1, 2040 ",
    city: "Budaörs",
    latitude: 47.4602,
    longitude: 18.9271,
    availability: "0-24",
    edition: "health",
  },
];

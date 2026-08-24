/**
 * Data contracts mirroring the future Google Sheets / Docs export.
 *
 * Sheet 1 ("products"): one row per product in the permanent catalogue (~200).
 * Sheet 2 ("machines"): one row per vending machine; the `products` column
 * lists which catalogue items sit on which shelf of that machine, so each
 * machine can have a different layout while sharing one product database.
 */

export type StockStatus = "in_stock" | "low" | "out_of_stock";

/** One row of the product catalogue sheet. */
export interface ProductRow {
  product_id: string;
  name: string;
  /** Gross price in HUF. */
  price_huf: number;
  category: string;
  /** One-line summary shown in the list. */
  short_info: string;
  /** Longer description shown on the product page. */
  description: string;
  /** e.g. "10 db tabletta" */
  package_size?: string;
  manufacturer?: string;
}

/** Normalized catalogue product consumed by the UI. */
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  info: string;
  description: string;
  packageSize?: string;
  manufacturer?: string;
}

/** One row of the machine sheet. */
export interface MachineRow {
  machine_id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  description: string;
  /** "PB-P001::1::in_stock|PB-P002::2::low" → product_id::shelf::stock */
  products: string;
  availability: string;
  last_updated?: string;
  /** "health" (default) or "festival" (Pillbox-Partybox edition). */
  edition?: MachineEdition;
  /** Optional operating window, e.g. "2026.08.26-30." */
  period?: string;
  /** "open" (default) or "temporarily_closed". */
  status?: MachineStatus;
}

export type MachineEdition = "health" | "festival";

export type MachineStatus = "open" | "temporarily_closed";

/** A catalogue product as it is available in a given machine. */
export interface MachineProduct extends Product {
  shelf: string;
  stock: StockStatus;
  category: string;
}

/** Normalized machine model consumed by the UI. */
export interface Machine {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  description: string;
  products: MachineProduct[];
  availability: string;
  lastUpdated?: string;
  edition: MachineEdition;
  period?: string;
  status: MachineStatus;
}

export function parseProductRow(row: ProductRow): Product {
  return {
    id: row.product_id,
    name: row.name,
    price: Number(row.price_huf),
    category: row.category,
    info: row.short_info,
    description: row.description,
    packageSize: row.package_size,
    manufacturer: row.manufacturer,
  };
}

export function parseMachineRow(row: MachineRow, catalog: Map<string, Product>): Machine {
  const products = splitList(row.products).flatMap<MachineProduct>((entry) => {
    const [productId, shelf, stock] = entry.split("::").map((part) => part.trim());
    const product = productId ? catalog.get(productId) : undefined;
    if (!product) return [];
    return [
      {
        ...product,
        shelf: shelf || "1",
        stock: (stock as StockStatus) || "in_stock",
        category: product.category,
      },
    ];
  });

  return {
    id: row.machine_id,
    name: row.name,
    address: row.address,
    city: row.city,
    lat: Number(row.latitude),
    lng: Number(row.longitude),
    description: row.description,
    products,
    availability: row.availability,
    lastUpdated: row.last_updated,
    edition: row.edition ?? "health",
    period: row.period,
    status: row.status ?? "open",
  };
}

function splitList(value: string): string[] {
  return (value ?? "")
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function formatPrice(price: number): string {
  return `${new Intl.NumberFormat("hu-HU").format(price)} Ft`;
}

export const MACHINE_STATUS_LABEL: Record<MachineStatus, string> = {
  open: "Nyitva",
  temporarily_closed: "Ideiglenesen zárva",
};

export const STOCK_LABEL: Record<StockStatus, string> = {
  in_stock: "Készleten",
  low: "Fogyóban",
  out_of_stock: "Elfogyott",
};

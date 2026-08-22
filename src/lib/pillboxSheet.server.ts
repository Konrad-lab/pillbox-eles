import { MOCK_MACHINE_ROWS } from "@/data/mockMachines";
import { MOCK_PRODUCT_ROWS } from "@/data/mockProducts";
import type { MachineEdition, MachineRow, MachineStatus, ProductRow } from "@/data/types";
import { readSheet, readServiceAccount } from "./sheets.server";
import type { PillboxSheetPayload } from "./pillbox.functions";

const PRODUCTS_RANGE = "products!A1:H";
const MACHINES_RANGE = "machines!A1:M";

let cache: { payload: PillboxSheetPayload; expiresAt: number } | null = null;
const CACHE_MS = 15 * 60_000; // 15 minutes

function toProductRow(row: Record<string, string>): ProductRow | null {
  if (!row["product_id"] || !row["name"]) return null;
  return {
    product_id: row["product_id"],
    name: row["name"],
    price_huf: Number((row["price_huf"] ?? "0").replace(/[^\d.-]/g, "")) || 0,
    category: row["category"] ?? "",
    short_info: row["short_info"] ?? "",
    description: row["description"] ?? "",
    package_size: row["package_size"] || undefined,
    manufacturer: row["manufacturer"] || undefined,
  };
}

function toMachineRow(row: Record<string, string>): MachineRow | null {
  if (!row["machine_id"] || !row["name"]) return null;
  return {
    machine_id: row["machine_id"],
    name: row["name"],
    address: row["address"] ?? "",
    city: row["city"] ?? "",
    latitude: Number(row["latitude"]) || 0,
    longitude: Number(row["longitude"]) || 0,
    description: row["description"] ?? "",
    products: row["products"] ?? "",
    availability: row["availability"] ?? "",
    last_updated: row["last_updated"] || undefined,
    edition: (row["edition"] as MachineEdition) || undefined,
    period: row["period"] || undefined,
    status: (row["status"] as MachineStatus) || undefined,
  };
}

const mockPayload: PillboxSheetPayload = {
  source: "mock",
  products: MOCK_PRODUCT_ROWS,
  machines: MOCK_MACHINE_ROWS,
};

export async function loadPillboxSheet(): Promise<PillboxSheetPayload> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) return cache.payload;

  const spreadsheetIdKkfha = process.env["GOOGLE_SHEET_ID_KKFHAZA"];
  const spreadsheetIdAlsoors = process.env["GOOGLE_SHEET_ID_ALSOORS"];
  
  if (!readServiceAccount()) return mockPayload;

  try {
    const allProductRows: ProductRow[] = [];
    const allMachineRows: MachineRow[] = [];

    // Read from Kiskunfélegyháza sheet
    if (spreadsheetIdKkfha) {
      const [productRows, machineRows] = await Promise.all([
        readSheet(spreadsheetIdKkfha, PRODUCTS_RANGE),
        readSheet(spreadsheetIdKkfha, MACHINES_RANGE),
      ]);
      allProductRows.push(...productRows.map(toProductRow).filter((row): row is ProductRow => row !== null));
      allMachineRows.push(...machineRows.map(toMachineRow).filter((row): row is MachineRow => row !== null));
    }

    // Read from Alsóörs sheet
    if (spreadsheetIdAlsoors) {
      const [productRows, machineRows] = await Promise.all([
        readSheet(spreadsheetIdAlsoors, PRODUCTS_RANGE),
        readSheet(spreadsheetIdAlsoors, MACHINES_RANGE),
      ]);
      allProductRows.push(...productRows.map(toProductRow).filter((row): row is ProductRow => row !== null));
      allMachineRows.push(...machineRows.map(toMachineRow).filter((row): row is MachineRow => row !== null));
    }

    if (!allProductRows.length || !allMachineRows.length) return mockPayload;

    const payload: PillboxSheetPayload = { source: "sheet", products: allProductRows, machines: allMachineRows };
    cache = { payload, expiresAt: now + CACHE_MS };
    return payload;
  } catch (error) {
    console.error("Pillbox sheet load failed:", error);
    return mockPayload;
  }
}

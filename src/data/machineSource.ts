import { getPillboxData, getProductCatalog } from "@/lib/pillbox.functions";
import { MOCK_MACHINE_ROWS } from "./mockMachines";
import { MOCK_PRODUCT_ROWS } from "./mockProducts";
import {
  parseMachineRow,
  parseProductRow,
  type Machine,
  type MachineRow,
  type Product,
  type ProductRow,
} from "./types";

/**
 * Single seam between the UI and the data source.
 *
 * Default: the live Google Sheet, read on the server (credentials never
 * reach the browser). Falls back to the mock rows when the sheet is not
 * configured or unreachable.
 */
export interface PillboxDataSource {
  id: string;
  label: string;
  fetchProductRows(): Promise<ProductRow[]>;
  fetchMachineRows(): Promise<MachineRow[]>;
}

export const mockSheetSource: PillboxDataSource = {
  id: "mock-sheet",
  label: "Mock spreadsheet export",
  async fetchProductRows() {
    return MOCK_PRODUCT_ROWS;
  },
  async fetchMachineRows() {
    return MOCK_MACHINE_ROWS;
  },
};

export const googleSheetSource: PillboxDataSource = {
  id: "google-sheet",
  label: "Google Sheets (service account)",
  async fetchProductRows() {
    return (await getPillboxData()).products;
  },
  async fetchMachineRows() {
    return (await getPillboxData()).machines;
  },
};

let activeSource: PillboxDataSource = googleSheetSource;

export function setPillboxDataSource(source: PillboxDataSource) {
  activeSource = source;
}

export async function loadProducts(): Promise<Product[]> {
  const catalog = await getProductCatalog();
  if (catalog.products.length) return catalog.products;
  const rows = await activeSource.fetchProductRows();
  return rows.map(parseProductRow);
}

export async function loadMachines(): Promise<Machine[]> {
  const [productRows, machineRows] = await Promise.all([
    activeSource.fetchProductRows(),
    activeSource.fetchMachineRows(),
  ]);
  const catalog = new Map(productRows.map(parseProductRow).map((p) => [p.id, p]));
  return machineRows.map((row) => parseMachineRow(row, catalog));
}

export const machinesQueryOptions = {
  queryKey: ["machines", activeSource.id] as const,
  queryFn: loadMachines,
  staleTime: 5 * 60_000,
};

export const productsQueryOptions = {
  queryKey: ["products", "sheet-4", activeSource.id] as const,
  queryFn: loadProducts,
  staleTime: 5 * 60_000,
};

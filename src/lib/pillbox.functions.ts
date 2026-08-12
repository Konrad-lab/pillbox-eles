import { createServerFn } from "@tanstack/react-start";
import type { MachineRow, ProductRow } from "@/data/types";
import type { MultiSheetProduct } from "./multiSheetService";

export interface PillboxSheetPayload {
  source: "sheet" | "mock";
  products: ProductRow[];
  machines: MachineRow[];
}

/**
 * Public read-only endpoint: returns the product catalogue and machine layouts.
 * Credentials stay on the server; only the parsed, non-sensitive rows go out.
 */
export const getPillboxData = createServerFn({ method: "GET" }).handler(
  async (): Promise<PillboxSheetPayload> => {
    const { loadPillboxSheet } = await import("./pillboxSheet.server");
    return loadPillboxSheet();
  },
);

/**
 * Returns products from multiple Google Sheets (vending machine inventories).
 * Uses the multi-sheet service that reads from SHEET_ID_1, SHEET_ID_2, SHEET_ID_3.
 */
export const getMultiSheetProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; products: MultiSheetProduct[]; timestamp: string; error?: string }> => {
    try {
      const { fetchProductsFromSheets } = await import("./multiSheetService");
      const products = await fetchProductsFromSheets();
      return {
        success: true,
        products,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        success: false,
        products: [],
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  },
);

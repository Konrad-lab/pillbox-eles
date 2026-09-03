import { createServerFn } from "@tanstack/react-start";
import type { MachineRow, Product, ProductRow } from "@/data/types";
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
 * Permanent product catalogue (descriptions) from SHEET_ID_4.
 * Includes items that are not currently stocked in any machine.
 */
export const getProductCatalog = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; products: Product[]; error?: string }> => {
    try {
      const { fetchProductCatalog } = await import("./productCatalog.server");
      const products = await fetchProductCatalog();
      return { success: true, products };
    } catch (error: any) {
      return {
        success: false,
        products: [],
        error: error.message,
      };
    }
  },
);

/**
 * Returns products from multiple Google Sheets (vending machine inventories).
 * Uses the multi-sheet service that reads from SHEET_ID_1, SHEET_ID_2, SHEET_ID_3.
 */
export const getMultiSheetProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    success: boolean;
    products: MultiSheetProduct[];
    timestamp: string;
    error?: string;
  }> => {
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

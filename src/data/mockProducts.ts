import type { ProductRow } from "./types";

/**
 * Permanent product catalogue - shaped exactly like the "products" sheet.
 * Swapping this array for a Google Sheets / Docs API fetch requires no
 * changes anywhere else in the app (see `productCatalogSource`).
 */
export const MOCK_PRODUCT_ROWS: ProductRow[] = [
 

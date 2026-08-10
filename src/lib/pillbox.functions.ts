import { createServerFn } from "@tanstack/react-start";
import type { MachineRow, ProductRow } from "@/data/types";

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

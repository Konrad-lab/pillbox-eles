import { useQuery } from "@tanstack/react-query";

import { getMultiSheetProducts } from "@/lib/pillbox.functions";
import type { MultiSheetProduct } from "@/lib/multiSheetService";

export type Product = MultiSheetProduct;

export const useProductSync = (intervalMinutes = 15) => {
  const query = useQuery({
    queryKey: ["multiSheetProducts"],

    queryFn: async () => {
      const result = await getMultiSheetProducts();

      if (!result.success) {
        throw new Error(
          result.error || "Nem sikerült betölteni a Google Sheet adatokat."
        );
      }

      return result;
    },

    refetchInterval: intervalMinutes * 60 * 1000,

    staleTime: intervalMinutes * 60 * 1000,
  });

  const products = query.data?.products || [];

  const loading = query.isLoading;

  const error = query.error?.message || null;

  const lastSync = query.data?.timestamp || null;

  return {
    products,
    loading,
    error,
    lastSync,
    refetch: () => query.refetch(),
  };
};

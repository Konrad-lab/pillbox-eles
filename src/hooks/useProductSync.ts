import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMultiSheetProducts } from '@/lib/pillbox.functions';

export interface Product {
  id: string;
  price: string;
  name: string;
  source: string;
}

export const useProductSync = (intervalMinutes = 15) => {
  const query = useQuery({
    queryKey: ['multiSheetProducts'],
    queryFn: async () => {
      const result = await getMultiSheetProducts();
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
    refetch: () => query.refetch() 
  };
};
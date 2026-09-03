import { defineEventHandler } from "h3";
import { fetchProductsFromSheets } from "../utils/sheetsService";

export default defineEventHandler(async () => {
  try {
    const products = await fetchProductsFromSheets();
    return {
      success: true,
      products,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      products: [],
    };
  }
});

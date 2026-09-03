import { defineEventHandler, createError } from "h3";
import { fetchProductsFromSheets } from "../utils/sheetsService";

export default defineEventHandler(async () => {
  try {
    const products = await fetchProductsFromSheets();
    return {
      success: true,
      timestamp: new Date().toISOString(),
      count: products.length,
      products,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: "Nem sikerült szinkronizálni a Google Sheets adatokat.",
      data: error.message,
    });
  }
});

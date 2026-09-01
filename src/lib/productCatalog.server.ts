import { google } from "googleapis";
import type { Product } from "@/data/types";
import { loadVariablesEnv } from "./loadVariablesEnv";
import { slugifyProductName } from "./productMatch";

const CACHE_MS = 15 * 60_000;
let cache: { products: Product[]; expiresAt: number } | null = null;

const HEADER_ALIASES = {
  id: ["id", "productid", "product_id", "azonosito", "sku", "kod", "cikkszam"],
  name: ["name", "nev", "termek", "termeknev", "termekneve", "termekek"],
  price: ["price", "ar", "pricehuf", "price_huf", "brutto", "osszeg"],
  info: ["shortinfo", "short_info", "rovidleiras", "info", "osszefoglalo"],
  description: ["description", "leiras", "hosszuleiras", "termekleiras", "reszletesleiras"],
  packageSize: ["packagesize", "package_size", "kiszereles", "mennyiseg"],
  manufacturer: ["manufacturer", "forgalmazo", "gyarto", "brand", "marka"],
  category: ["category", "kategoria"],
} as const;

function normalizeHeader(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function parsePriceHuf(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return 0;
  return Number(digits) || 0;
}

function headerMap(headerRow: string[]): Map<string, number> {
  const map = new Map<string, number>();
  headerRow.forEach((cell, index) => {
    const key = normalizeHeader(cell);
    if (key) map.set(key, index);
  });
  return map;
}

function looksLikeHeaderRow(row: string[]): boolean {
  const keys = row.map(normalizeHeader).filter(Boolean);
  const aliases: string[] = Object.values(HEADER_ALIASES).flat();
  return keys.some((key) => aliases.includes(key));
}

function cell(row: string[], index: number | undefined): string {
  if (index == null) return "";
  return String(row[index] ?? "").trim();
}

function columnIndex(headers: Map<string, number>, aliases: readonly string[]): number | undefined {
  for (const alias of aliases) {
    if (headers.has(alias)) return headers.get(alias);
  }
  return undefined;
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base;
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  used.add(id);
  return id;
}

function toProducts(values: string[][]): Product[] {
  if (!values.length) return [];

  const usedIds = new Set<string>();
  const hasHeader = looksLikeHeaderRow(values[0] ?? []);
  const rows = hasHeader ? values.slice(1) : values;
  const headers = hasHeader ? headerMap(values[0] ?? []) : new Map<string, number>();

  const nameIdx = hasHeader ? columnIndex(headers, HEADER_ALIASES.name) : 0;
  const descIdx = hasHeader ? columnIndex(headers, HEADER_ALIASES.description) : 1;
  const idIdx = hasHeader ? columnIndex(headers, HEADER_ALIASES.id) : undefined;
  const priceIdx = hasHeader ? columnIndex(headers, HEADER_ALIASES.price) : 2;
  const infoIdx = hasHeader ? columnIndex(headers, HEADER_ALIASES.info) : undefined;
  const packIdx = hasHeader ? columnIndex(headers, HEADER_ALIASES.packageSize) : undefined;
  const mfrIdx = hasHeader ? columnIndex(headers, HEADER_ALIASES.manufacturer) : undefined;
  const catIdx = hasHeader ? columnIndex(headers, HEADER_ALIASES.category) : undefined;

  const products: Product[] = [];

  for (const row of rows) {
    if (!row?.some((cellValue) => String(cellValue ?? "").trim())) continue;

    const name = cell(row, nameIdx);
    if (!name) continue;

    const rawId = cell(row, idIdx);
    const id = uniqueId(rawId ? slugifyProductName(rawId) : slugifyProductName(name), usedIds);
    const description = cell(row, descIdx);
    const info = cell(row, infoIdx) || description.slice(0, 180);

    products.push({
      id,
      name,
      price: parsePriceHuf(cell(row, priceIdx)),
      category: cell(row, catIdx),
      info,
      description,
      packageSize: cell(row, packIdx) || undefined,
      manufacturer: cell(row, mfrIdx) || undefined,
    });
  }

  return products;
}

function getAuthClient() {
  const credentialsRaw = process.env.GOOGLE_CREDENTIALS;
  if (!credentialsRaw) {
    throw new Error("GOOGLE_CREDENTIALS környezeti változó hiányzik.");
  }

  return new google.auth.GoogleAuth({
    credentials: JSON.parse(credentialsRaw),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

export async function fetchProductCatalog(): Promise<Product[]> {
  loadVariablesEnv();

  const now = Date.now();
  if (cache && cache.expiresAt > now) return cache.products;

  const spreadsheetId = process.env.SHEET_ID_4;
  if (!spreadsheetId) {
    cache = { products: [], expiresAt: now + CACHE_MS };
    return [];
  }

  const sheets = google.sheets({ version: "v4", auth: getAuthClient() });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "A1:L1000",
  });

  const products = toProducts(response.data.values || []);
  cache = { products, expiresAt: now + CACHE_MS };
  return products;
}

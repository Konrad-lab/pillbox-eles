/** Shared name matching for machine inventory vs. the SHEET_ID_4 catalogue. */

export function slugifyProductName(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "termek";
}

export function normalizeProductName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/^\d+\s*/, "")
    .replace(/([a-z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-z])/g, "$1 $2")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function productNamesMatch(a: string, b: string): boolean {
  const left = normalizeProductName(a);
  const right = normalizeProductName(b);
  return Boolean(left) && left === right;
}

export function findMatchingProduct<T extends { name: string }>(
  name: string,
  catalog: T[],
): T | undefined {
  const needle = normalizeProductName(name);
  if (!needle) return undefined;

  const exact = catalog.find((item) => normalizeProductName(item.name) === needle);
  if (exact) return exact;

  const contained = catalog.filter((item) => {
    const hay = normalizeProductName(item.name);
    if (!hay || hay.length < 8 || needle.length < 8) return false;
    return hay.includes(needle) || needle.includes(hay);
  });

  if (contained.length === 1) return contained[0];
  return undefined;
}

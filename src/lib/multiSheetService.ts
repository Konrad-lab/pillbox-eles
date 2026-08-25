import { google } from "googleapis";

export interface MultiSheetProduct {
  id: string;
  price: string;
  name: string;
  source: string;
  category: string;
  position: number;
  shelf: string;
}

const sheetConfigs = [
  {
    // 1. Google Sheet -> 1. automata
    machineId: "PB-001",
    name: "Kiskunfélegyháza",
    sheetId: process.env.SHEET_ID_1,
    range: "A2:C200",
    idColumn: 0,
    priceColumn: 1,
    nameColumn: 2,
  },
  {
    // 2. Google Sheet -> 2. automata
    machineId: "PB-002",
    name: "Alsóörs partybox",
    sheetId: process.env.SHEET_ID_2,
    range: "A2:C200",
    idColumn: 0,
    priceColumn: 1,
    nameColumn: 2,
  },
  {
    // 3. Google Sheet -> 3. automata
    machineId: "PB-003",
    name: "Budaörs",
    sheetId: process.env.SHEET_ID_3,
    range: "A2:C200",
    idColumn: 0,
    priceColumn: 1,
    nameColumn: 2,
  },
];

const getAuthClient = () => {
  const credentialsRaw = process.env.GOOGLE_CREDENTIALS;

  if (!credentialsRaw) {
    throw new Error("GOOGLE_CREDENTIALS környezeti változó hiányzik.");
  }

  const credentials = JSON.parse(credentialsRaw);

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
};

const parseShelfFromId = (id: string): string => {
  // ID format: A10, A11, B10, B11, etc. (normál gépeknél)
  // OR 10, 11, 12, etc. (partybox-nál)
  // A prefix figyelmen kívül hagyandó, csak a szám számít
  if (!id) return '1. polc';

  // Kinyerjük a számot az ID-ból (legyen A10 vagy 10)
  let positionNumber: number;
  if (/^\d+$/.test(id)) {
    // Csak szám (pl. "10", "11")
    positionNumber = parseInt(id, 10);
  } else {
    // Betű + szám (pl. "A10", "B11")
    const numericPart = id.replace(/^[A-Za-z]/, '');
    positionNumber = parseInt(numericPart, 10);
  }

  if (isNaN(positionNumber)) return '1. polc';

  // Dupla érték kezelése (üres pozíció)
  if (positionNumber === 0) return '1. polc';

  // 10-es csoportok/polcok, 10 polc összesen
  // tízenX (10-19) → 1. polc
  // huszonX (20-29) → 2. polc
  // harmincX (30-39) → 3. polc
  // negyvenX (40-49) → 4. polc
  // ötvenX (50-59) → 5. polc
  // hatvanX (60-69) → 6. polc
  // hetvenX (70-79) → 7. polc
  // nyolcvanX (80-89) → 8. polc
  // kilencvenX (90-99) → 9. polc
  // 100+ → 10. polc
  const shelfIndex = Math.floor((positionNumber - 10) / 10);

  // Ha a szám 10 alatt van, akkor az 1. polcra tesszük (fallback)
  if (positionNumber < 10) {
    return '1. polc';
  }

  const shelfNumber = shelfIndex + 1;
  if (shelfNumber >= 1 && shelfNumber <= 10) {
    return `${shelfNumber}. polc`;
  }

  return '1. polc';
};

/**
 * Az első oszlopból meghatározza a fizikai pozíciót.
 *
 * Elfogadott:
 *   1
 *   2
 *   3
 *   A1
 *   A2
 *   A3
 *
 * 1 = első hely
 * 2 = második hely
 * ...
 * 100 = századik hely
 */
const parsePositionFromId = (id: string): number | null => {
  const value = String(id ?? "").trim();

  if (!value) {
    return null;
  }

  // A "dupla" nem termék.
  if (value.toLowerCase() === "dupla") {
    return null;
  }

  // Kikeressük a számot.
  // Így működik a 1 és az A1 formátum is.
  const match = value.match(/\d+/);

  if (!match) {
    return null;
  }

  const position = Number(match[0]);

  // 1-100 = 100 fizikai hely
  // Megengedjük a 0-t is, mert lehet, hogy van 0-as kód is
  if (position < 0 || position > 100) {
    return null;
  }

  return position;
};

/**
 * A category mezőt meghagyjuk a régi adatszerkezet miatt,
 * de a polcelrendezéshez egyáltalán nem használjuk.
 */
const categorizeProduct = (name: string): string => {
  const nameLower = name.toLowerCase();

  if (
    nameLower.includes("vitamin") ||
    nameLower.includes("c-vitamin") ||
    nameLower.includes("d-vitamin") ||
    nameLower.includes("multivitamin") ||
    nameLower.includes("b-complex") ||
    nameLower.includes("b12") ||
    nameLower.includes("cink") ||
    nameLower.includes("magnézium") ||
    nameLower.includes("vas") ||
    nameLower.includes("kalcium") ||
    nameLower.includes("omega") ||
    nameLower.includes("q10") ||
    nameLower.includes("folsav") ||
    nameLower.includes("szelén") ||
    nameLower.includes("étrend-kiegészítő")
  ) {
    return "Vitaminok és étrend-kiegészítők";
  }

  if (
    nameLower.includes("ibuprofen") ||
    nameLower.includes("paracetamol") ||
    nameLower.includes("aspirin") ||
    nameLower.includes("diclofenac") ||
    nameLower.includes("fájdalom") ||
    nameLower.includes("fejfájás") ||
    nameLower.includes("izom") ||
    nameLower.includes("reuma") ||
    nameLower.includes("nagyfájás")
  ) {
    return "Fájdalomcsillapítók";
  }

  if (
    nameLower.includes("alkohol") ||
    nameLower.includes("másnap") ||
    nameLower.includes("fehérje") ||
    nameLower.includes("elektrolit") ||
    nameLower.includes("hidratál") ||
    nameLower.includes("energia")
  ) {
    return "Másnaposság elleni";
  }

  if (
    nameLower.includes("zsebkendő") ||
    nameLower.includes("maszk") ||
    nameLower.includes(" kéz") ||
    nameLower.includes("fertőtlen") ||
    nameLower.includes("törölköző") ||
    nameLower.includes("papír") ||
    nameLower.includes("wc") ||
    nameLower.includes("szappan") ||
    nameLower.includes("higiénia")
  ) {
    return "Higiénia";
  }

  if (
    nameLower.includes("nap") ||
    nameLower.includes("uv") ||
    nameLower.includes("fényvédő") ||
    nameLower.includes("spf") ||
    nameLower.includes("solar")
  ) {
    return "Napvédelem";
  }

  if (
    nameLower.includes("gyomor") ||
    nameLower.includes("emésztés") ||
    nameLower.includes("sav") ||
    nameLower.includes("hasmenés") ||
    nameLower.includes("székrekedés") ||
    nameLower.includes("probiotikum")
  ) {
    return "Emésztés";
  }

  if (
    nameLower.includes("allergia") ||
    nameLower.includes("orrfolyás") ||
    nameLower.includes("tüsszentés") ||
    nameLower.includes("szem") ||
    nameLower.includes("antihisztamin")
  ) {
    return "Allergia";
  }

  if (
    nameLower.includes("megfázás") ||
    nameLower.includes("influenza") ||
    nameLower.includes("köhögés") ||
    nameLower.includes("torok") ||
    nameLower.includes("orrcsepp") ||
    nameLower.includes("orrspray") ||
    nameLower.includes("csep") ||
    nameLower.includes("gyógynövény")
  ) {
    return "Megfázás és influenza";
  }

  return "Egyéb";
};

export const fetchProductsFromSheets = async (): Promise<
  MultiSheetProduct[]
> => {
  const auth = getAuthClient();

  const sheets = google.sheets({
    version: "v4",
    auth,
  });

  const products: MultiSheetProduct[] = [];

  const results = await Promise.all(
    sheetConfigs.map(async (config) => {
      if (!config.sheetId) {
        return {
          config,
          rows: [],
          error: "Hiányzó Sheet ID",
        };
      }

      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: config.sheetId,
          range: config.range,
        });

        return {
          config,
          rows: response.data.values || [],
        };
      } catch (error: any) {
        return {
          config,
          rows: [],
          error: error?.message || "Ismeretlen Google Sheets hiba",
        };
      }
    })
  );

  for (const result of results) {
    if (result.error) {
      console.error(
        `Hiba a(z) ${result.config.name} sheetnél:`,
        result.error
      );

      continue;
    }

    for (const row of result.rows) {
      if (!row || row.length < 3) {
        continue;
      }

      const idVal = row[result.config.idColumn]
        ? String(row[result.config.idColumn]).trim().replace(/["']/g, '')
        : "";

      const priceVal = row[result.config.priceColumn]
        ? String(row[result.config.priceColumn]).trim().replace(/["']/g, '')
        : "";

      let nameVal = row[result.config.nameColumn]
        ? String(row[result.config.nameColumn]).trim().replace(/["']/g, '')
        : "";

      // Remove numbers from product names for Alsóörs and Budaörs
      if (result.config.name === "Alsóörs partybox" || result.config.name === "Budaörs") {
        nameVal = nameVal.replace(/^\d+/, '').trim();
      }

      // "dupla" = üres hely.
      // Nem jelenítjük meg termékként.
      if (!idVal || idVal.toLowerCase() === "dupla" || !nameVal) {
        continue;
      }

      const position = parsePositionFromId(idVal);

      if (position === null) {
        continue;
      }

      products.push({
        id: `${result.config.machineId}-${idVal}`,
        price: priceVal,
        name: nameVal,

        // A source mostantól stabilan a helyszínt jelenti.
        source: result.config.name,

        category: categorizeProduct(nameVal),

        position,
        shelf: parseShelfFromId(idVal),
      });
    }
  }

  // Biztonsági sorrendezés:
  // minden automata saját termékei 10 -> 69 sorrendben.
  products.sort((a, b) => {
    if (a.source !== b.source) {
      return a.source.localeCompare(b.source, "hu");
    }

    return a.position - b.position;
  });

  return products;
};

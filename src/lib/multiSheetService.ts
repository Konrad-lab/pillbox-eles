import { google } from 'googleapis';

export interface MultiSheetProduct {
  id: string;
  price: string;
  name: string;
  source: string;
  category: string;
  shelf: string;
}

const sheetConfigs = [
  {
    name: 'Kiskunfélegyháza',
    sheetId: process.env.SHEET_ID_1,
    range: 'A2:C90',
    idColumn: 0,
    priceColumn: 1,
    nameColumn: 2,
  },
  {
    name: 'Alsóörs partybox',
    sheetId: process.env.SHEET_ID_2,
    range: 'A11:C80',
    idColumn: 0,
    priceColumn: 1,
    nameColumn: 2,
  },
  {
    name: 'Sheet3',
    sheetId: process.env.SHEET_ID_3,
    range: 'A2:C90',
    idColumn: 0,
    priceColumn: 1,
    nameColumn: 2,
  },
];

const getAuthClient = () => {
  const credentialsRaw = process.env.GOOGLE_CREDENTIALS;
  if (!credentialsRaw) {
    throw new Error('GOOGLE_CREDENTIALS környezeti változó hiányzik.');
  }

  const credentials = JSON.parse(credentialsRaw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
};

const parseShelfFromId = (id: string): string => {
  // ID format: A10, A11, B10, B11, etc. (normál gépeknél)
  // OR 10, 11, 12, etc. (partybox-nál)
  if (!id) return 'A';

  // Ha az ID csak szám (pl. "10", "11"), akkor partybox - osztály szerint
  if (/^\d+$/.test(id)) {
    const num = parseInt(id, 10);
    if (num <= 10) return 'A';
    if (num <= 20) return 'B';
    if (num <= 30) return 'C';
    if (num <= 40) return 'D';
    if (num <= 50) return 'E';
    return 'F';
  }

  // Ha az ID betűvel kezdődik (pl. "A10", "B11")
  if (id.length >= 2) {
    const firstChar = id.charAt(0).toUpperCase();
    if (['A', 'B', 'C', 'D', 'E', 'F'].includes(firstChar)) {
      return firstChar;
    }
  }

  return 'A';
};

const categorizeProduct = (name: string): string => {
  const nameLower = name.toLowerCase();

  // Vitaminok és étrend-kiegészítők
  if (nameLower.includes('vitamin') || nameLower.includes('c-vitamin') || nameLower.includes('d-vitamin') ||
      nameLower.includes('multivitamin') || nameLower.includes('b-complex') || nameLower.includes('b12') ||
      nameLower.includes('cink') || nameLower.includes('magnézium') || nameLower.includes('vas') ||
      nameLower.includes('kalcium') || nameLower.includes('omega') || nameLower.includes('q10') ||
      nameLower.includes('folsav') || nameLower.includes('szelén') || nameLower.includes('étrend-kiegészítő')) {
    return 'Vitaminok és étrend-kiegészítők';
  }

  // Fájdalomcsillapítók és lázcsökkentők
  if (nameLower.includes('ibuprofen') || nameLower.includes('paracetamol') || nameLower.includes('aspirin') ||
      nameLower.includes('diclofenac') || nameLower.includes('fájdalom') || nameLower.includes('fejfájás') ||
      nameLower.includes('izom') || nameLower.includes('reuma') || nameLower.includes('nagyfájás')) {
    return 'Fájdalomcsillapítók';
  }

  // Másnaposság elleni termékek
  if (nameLower.includes('alkohol') || nameLower.includes('másnap') || nameLower.includes('fehérje') ||
      nameLower.includes('elektrolit') || nameLower.includes('hidratál') || nameLower.includes('energia')) {
    return 'Másnaposság elleni';
  }

  // Higiéniai termékek
  if (nameLower.includes('zsebkendő') || nameLower.includes('maszk') || nameLower.includes(' kéz') ||
      nameLower.includes('fertőtlen') || nameLower.includes('törölköző') || nameLower.includes('papír') ||
      nameLower.includes('wc') || nameLower.includes('szappan') || nameLower.includes('higiénia')) {
    return 'Higiénia';
  }

  // Napvédelem
  if (nameLower.includes('nap') || nameLower.includes('uv') || nameLower.includes('fényvédő') ||
      nameLower.includes('spf') || nameLower.includes('solar')) {
    return 'Napvédelem';
  }

  // Gyomorproblémák
  if (nameLower.includes('gyomor') || nameLower.includes('emésztés') || nameLower.includes('sav') ||
      nameLower.includes('hasmenés') || nameLower.includes('székrekedés') || nameLower.includes('probiotikum')) {
    return 'Emésztés';
  }

  // Allergia
  if (nameLower.includes('allergia') || nameLower.includes('orrfolyás') || nameLower.includes('tüsszentés') ||
      nameLower.includes('szem') || nameLower.includes('antihisztamin')) {
    return 'Allergia';
  }

  // Megfázás és influenza
  if (nameLower.includes('megfázás') || nameLower.includes('influenza') || nameLower.includes('köhögés') ||
      nameLower.includes('torok') || nameLower.includes('orrcsepp') || nameLower.includes('orrspray') ||
      nameLower.includes('csep') || nameLower.includes('gyógynövény')) {
    return 'Megfázás és influenza';
  }

  // Egyéb
  return 'Egyéb';
};

export const fetchProductsFromSheets = async (): Promise<MultiSheetProduct[]> => {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });
  const products: MultiSheetProduct[] = [];

  const results = await Promise.all(
    sheetConfigs.map(async (config) => {
      if (!config.sheetId) {
        return { config, rows: [], error: 'Hiányzó Sheet ID' };
      }
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: config.sheetId,
          range: config.range,
        });
        return { config, rows: response.data.values || [] };
      } catch (error: any) {
        return { config, rows: [], error: error.message };
      }
    })
  );

  for (const result of results) {
    if (result.error) {
      console.error(`Hiba a(z) ${result.config.name} sheetnél:`, result.error);
      continue;
    }

    for (const row of result.rows) {
      if (row && row.length >= 3) {
        const idVal = row[result.config.idColumn] ? String(row[result.config.idColumn]).trim() : '';
        const priceVal = row[result.config.priceColumn] ? String(row[result.config.priceColumn]).trim() : '';
        const nameVal = row[result.config.nameColumn] ? String(row[result.config.nameColumn]).trim() : '';

        if (nameVal) {
          products.push({
            id: `${result.config.name}-${idVal}`,
            price: priceVal,
            name: nameVal,
            source: result.config.name,
            category: categorizeProduct(nameVal),
            shelf: parseShelfFromId(idVal),
          });
        }
      }
    }
  }

  return products;
};

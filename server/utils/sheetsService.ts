import { google } from 'googleapis';

export interface Product {
  id: string;
  price: string;
  name: string;
  source: string;
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
    name: 'Budaörs',
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

export const fetchProductsFromSheets = async (): Promise<Product[]> => {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });
  const products: Product[] = [];

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
          });
        }
      }
    }
  }

  return products;
};

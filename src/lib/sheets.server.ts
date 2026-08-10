/**
 * Server-only Google Sheets reader.
 *
 * Uses the service account stored in the GOOGLE_SERVICE_ACCOUNT_JSON secret.
 * The credentials never leave the server: this file is blocked from client
 * bundles by its `.server.ts` filename and is only imported inside server
 * function handlers.
 */

interface ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri: string;
}

const SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

function base64url(input: ArrayBuffer | string): string {
  const bytes =
    typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemToPkcs8(pem: string): ArrayBuffer {
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(account: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt - 60 > now) return cachedToken.value;

  const tokenUri = account.token_uri || "https://oauth2.googleapis.com/token";
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: account.client_email,
      scope: SCOPE,
      aud: tokenUri,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signingInput = `${header}.${claim}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToPkcs8(account.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput),
  );
  const assertion = `${signingInput}.${base64url(signature)}`;

  const response = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!response.ok) {
    throw new Error(`Google token request failed [${response.status}]`);
  }
  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: now + (data.expires_in ?? 3600) };
  return data.access_token;
}

export function readServiceAccount(): ServiceAccount | null {
  const raw = process.env["GOOGLE_SERVICE_ACCOUNT_JSON"];
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ServiceAccount;
  } catch {
    return null;
  }
}

/** Reads a sheet tab and returns rows as objects keyed by the header row. */
export async function readSheet(
  spreadsheetId: string,
  range: string,
): Promise<Record<string, string>[]> {
  const account = readServiceAccount();
  if (!account) throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON");

  const token = await getAccessToken(account);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    spreadsheetId,
  )}/values/${encodeURIComponent(range)}?majorDimension=ROWS`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sheets request failed [${response.status}]: ${body}`);
  }
  const data = (await response.json()) as { values?: string[][] };
  const [header, ...rows] = data.values ?? [];
  if (!header) return [];
  return rows
    .filter((row) => row.some((cell) => (cell ?? "").trim() !== ""))
    .map((row) => {
      const record: Record<string, string> = {};
      header.forEach((key, index) => {
        record[key.trim()] = (row[index] ?? "").trim();
      });
      return record;
    });
}

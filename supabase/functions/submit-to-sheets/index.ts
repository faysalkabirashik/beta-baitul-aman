import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// JWT creation for Google API authentication
async function createJWT(serviceAccount: any): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const claimB64 = btoa(JSON.stringify(claim)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const unsignedToken = `${headerB64}.${claimB64}`;

  // Parse the private key
  const pemContent = serviceAccount.private_key
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\n/g, "");
  
  const binaryKey = Uint8Array.from(atob(pemContent), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    encoder.encode(unsignedToken)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${unsignedToken}.${signatureB64}`;
}

async function getAccessToken(serviceAccount: any): Promise<string> {
  const jwt = await createJWT(serviceAccount);
  
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Token error:", data);
    throw new Error(`Failed to get access token: ${data.error_description || data.error}`);
  }
  
  return data.access_token;
}

// Check if a sheet exists
async function sheetExists(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string
): Promise<boolean> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error("Error checking spreadsheet:", await response.json());
    return false;
  }

  const data = await response.json();
  const sheets = data.sheets || [];
  return sheets.some((sheet: any) => sheet.properties?.title === sheetName);
}

// Create a new sheet
async function createSheet(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  headers: string[]
): Promise<void> {
  // First, add the sheet
  const addSheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
  
  const addSheetResponse = await fetch(addSheetUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [{
        addSheet: {
          properties: {
            title: sheetName,
          },
        },
      }],
    }),
  });

  if (!addSheetResponse.ok) {
    const error = await addSheetResponse.json();
    console.error("Error creating sheet:", error);
    throw new Error(`Failed to create sheet: ${error.error?.message || 'Unknown error'}`);
  }

  console.log(`Created sheet: ${sheetName}`);

  // Then add headers
  const headersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:${String.fromCharCode(64 + headers.length)}1?valueInputOption=USER_ENTERED`;
  
  const headersResponse = await fetch(headersUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [headers] }),
  });

  if (!headersResponse.ok) {
    const error = await headersResponse.json();
    console.error("Error adding headers:", error);
    // Don't throw - sheet is created, headers can be added manually
  } else {
    console.log(`Added headers to sheet: ${sheetName}`);
  }
}

async function appendToSheet(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  values: string[][],
  headers: string[]
): Promise<void> {
  // Check if sheet exists, create if not
  const exists = await sheetExists(accessToken, spreadsheetId, sheetName);
  
  if (!exists) {
    console.log(`Sheet "${sheetName}" does not exist, creating it...`);
    await createSheet(accessToken, spreadsheetId, sheetName, headers);
  }

  const range = `${sheetName}!A:Z`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Sheets API error:", error);
    throw new Error(`Failed to append to sheet: ${error.error?.message || 'Unknown error'}`);
  }
  
  console.log("Successfully appended data to sheet");
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
    const spreadsheetId = Deno.env.get("GOOGLE_SPREADSHEET_ID");

    if (!serviceAccountJson) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not configured");
    }
    if (!spreadsheetId) {
      throw new Error("GOOGLE_SPREADSHEET_ID not configured");
    }

    const serviceAccount = JSON.parse(serviceAccountJson);
    const { formType, data } = await req.json();

    console.log(`Processing ${formType} form submission:`, data);

    // Get access token
    const accessToken = await getAccessToken(serviceAccount);

    // Determine sheet name, headers, and format data based on form type
    let sheetName: string;
    let headers: string[];
    let rowData: string[];
    const timestamp = new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' });

    if (formType === "order") {
      sheetName = "Orders";
      headers = ["Timestamp", "Name", "Phone", "Address", "Book Title", "Price", "Quantity", "Order Type", "Status"];
      rowData = [
        timestamp,
        data.name || "",
        data.phone || "",
        data.address || "",
        data.bookTitle || "",
        data.bookPrice || "",
        data.quantity || "1",
        data.orderType || "buy",
        "Pending"
      ];
    } else if (formType === "registration") {
      sheetName = "Registrations";
      headers = ["Timestamp", "Name", "Phone", "Email", "Address", "Status"];
      rowData = [
        timestamp,
        data.name || "",
        data.phone || "",
        data.email || "",
        data.address || "",
        "Active"
      ];
    } else {
      throw new Error(`Unknown form type: ${formType}`);
    }

    await appendToSheet(accessToken, spreadsheetId, sheetName, [rowData], headers);

    return new Response(
      JSON.stringify({ success: true, message: "Data saved successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in submit-to-sheets:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

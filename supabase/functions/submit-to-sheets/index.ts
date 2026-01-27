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

async function appendToSheet(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
  values: string[][]
): Promise<void> {
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

    // Determine sheet name and format data based on form type
    let sheetName: string;
    let rowData: string[];
    const timestamp = new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' });

    if (formType === "order") {
      sheetName = "Orders";
      rowData = [
        timestamp,
        data.name || "",
        data.phone || "",
        data.address || "",
        data.bookTitle || "",
        data.bookPrice || "",
        data.orderType || "",
        data.paymentMethod || "",
        "Pending"
      ];
    } else if (formType === "registration") {
      sheetName = "Registrations";
      rowData = [
        timestamp,
        data.name || "",
        data.phone || "",
        data.email || "",
        data.age || "",
        "Active"
      ];
    } else {
      throw new Error(`Unknown form type: ${formType}`);
    }

    await appendToSheet(accessToken, spreadsheetId, sheetName, [rowData]);

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

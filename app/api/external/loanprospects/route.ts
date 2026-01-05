import { NextResponse } from "next/server";
import type { LoanProspectPayload, LoanProspectResponse, LoanProspectError } from "@/lib/api/types";
import { createHmac } from "crypto";

/**
 * Generate HMAC-SHA256 signature
 */
function generateSignature(timestamp: string, clientPassword: string): string {
  const hmac = createHmac("sha256", clientPassword);
  hmac.update(timestamp);
  return hmac.digest("base64");
}

/**
 * POST /api/external/loanprospects
 * Proxy untuk external API dengan HMAC authentication
 */
export async function POST(req: Request) {
  try {
    const body: LoanProspectPayload = await req.json();

    // Get configuration from environment variables
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || "1003";
    const clientPassword = process.env.NEXT_PUBLIC_CLIENT_PASSWORD || "";
    const useMockAPI = process.env.NODE_ENV === "development" && !baseUrl;

    // Fallback ke mock API di development jika baseUrl tidak dikonfigurasi
    if (useMockAPI) {
      console.log("🔵 [MOCK API] Menggunakan Mock API - Development Mode");
      console.log("📦 [MOCK API] Payload:", JSON.stringify(body, null, 2));
      
      // Simulasi response dari mock API
      const mockResponse: LoanProspectResponse = {
        data: {
          prpect_uuid: `MOCK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          prpect_channel_id: 3508,
          prpect_status: "PENDING",
          prpect_bp_fullname: body.full_name,
        },
        message: "Pengajuan berhasil (Mock API - Development Mode)",
      };

      // Simulasi delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("✅ [MOCK API] Response:", JSON.stringify(mockResponse, null, 2));
      console.log("🆔 [MOCK API] UUID:", mockResponse.data?.prpect_uuid);
      
      return NextResponse.json(mockResponse, { status: 201 });
    }

    if (!baseUrl) {
      return NextResponse.json(
        { 
          message: "API base URL tidak dikonfigurasi",
          userMessage: "API base URL tidak dikonfigurasi. Silakan setup environment variable NEXT_PUBLIC_API_BASE_URL."
        },
        { status: 500 }
      );
    }

    if (!clientPassword) {
      return NextResponse.json(
        { 
          message: "Client password tidak dikonfigurasi",
          userMessage: "Client password tidak dikonfigurasi. Silakan setup environment variable NEXT_PUBLIC_CLIENT_PASSWORD."
        },
        { status: 500 }
      );
    }

    // Generate timestamp dan signature
    const timestamp = new Date().getTime().toString();
    const signature = generateSignature(timestamp, clientPassword);

    console.log("🟢 [REAL API] Menggunakan Real API:", baseUrl);
    console.log("📦 [REAL API] Payload:", JSON.stringify(body, null, 2));
    console.log("🔐 [REAL API] Headers:", {
      "X-Access-Type": "external",
      "X-TimeStamp": timestamp,
      "X-Signature": signature.substring(0, 20) + "..." + signature.substring(signature.length - 10), // Partial signature untuk security
      "Client-ID": clientId,
    });

    // Call external API
    const response = await fetch(`${baseUrl}/api/external/loanprospects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Access-Type": "external",
        "X-TimeStamp": timestamp,
        "X-Signature": signature,
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    console.log("📊 [REAL API] Response Status:", response.status);
    
    if (!response.ok) {
      console.error("❌ [REAL API] Error Response:", JSON.stringify(responseData, null, 2));
      const error: LoanProspectError = responseData;
      
      // Map error codes ke pesan user-friendly
      let errorMessage = "Terjadi kesalahan saat mengirim pengajuan";
      
      if (response.status === 400) {
        errorMessage = error.message || "Data yang dikirim tidak valid. Silakan periksa kembali.";
      } else if (response.status === 401) {
        errorMessage = "Autentikasi gagal. Silakan coba lagi.";
      } else if (response.status === 403) {
        errorMessage = "Akses ditolak. Silakan hubungi administrator.";
      } else if (response.status === 404) {
        errorMessage = "Endpoint tidak ditemukan.";
      } else if (response.status === 409) {
        errorMessage = "Data dengan NIK ini sudah terdaftar.";
      } else if (response.status === 500) {
        errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
      }

      return NextResponse.json(
        {
          ...error,
          userMessage: errorMessage,
        },
        { status: response.status }
      );
    }

    console.log("✅ [REAL API] Success Response:", JSON.stringify(responseData, null, 2));
    if (responseData.data?.prpect_uuid) {
      console.log("🆔 [REAL API] UUID:", responseData.data.prpect_uuid);
    }

    return NextResponse.json(responseData as LoanProspectResponse, {
      status: response.status,
    });
  } catch (error) {
    console.error("Error submitting loan prospect:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat mengirim pengajuan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


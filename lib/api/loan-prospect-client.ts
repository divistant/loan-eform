import type { LoanProspectPayload, LoanProspectResponse, LoanProspectError } from "./types";

/**
 * Generate HMAC-SHA256 signature untuk authentication
 */
function generateSignature(timestamp: string, clientPassword: string): string {
  // Note: Untuk client-side, kita perlu menggunakan crypto API browser
  // Atau lebih baik, pindahkan ke server-side API route untuk security
  // Untuk sekarang, kita akan handle di server-side route
  
  // Placeholder - akan diimplementasikan di server-side
  return "";
}

/**
 * Submit loan prospect ke external API
 * Note: Server-side route akan handle fallback ke mock API jika environment variables tidak dikonfigurasi
 */
export async function submitLoanProspect(
  data: LoanProspectPayload
): Promise<LoanProspectResponse> {
  // Langsung call ke Next.js API route
  // Server-side akan handle semua logic termasuk fallback ke mock API jika perlu
  const response = await fetch("/api/external/loanprospects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const error: LoanProspectError = responseData;
    throw {
      status: response.status,
      ...error,
    };
  }

  return responseData as LoanProspectResponse;
}


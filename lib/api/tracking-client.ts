import type { ApplicationTracking } from "@/types/status-tracking";
import type { TrackingApiResponse } from "./tracking-types";

/**
 * Fetch status tracking dari API
 */
export async function fetchTrackingStatus(uuid: string): Promise<ApplicationTracking> {
  const response = await fetch(`/api/tracking/${uuid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    cache: 'no-store', // Prevent caching untuk real-time updates
  });

  const data: TrackingApiResponse = await response.json();

  if (!response.ok || !data.success) {
    const error = data.success === false ? data.error : {
      code: 'NETWORK_ERROR' as const,
      message: 'Network error',
      userMessage: 'Terjadi kesalahan saat mengambil data. Silakan coba lagi.',
    };

    throw {
      status: response.status,
      ...error,
    };
  }

  return data.data;
}

/**
 * Validate UUID format
 */
export function validateUUID(uuid: string): { valid: boolean; error?: string } {
  if (!uuid || !uuid.trim()) {
    return {
      valid: false,
      error: 'Nomor referensi tidak boleh kosong',
    };
  }

  const trimmedUuid = uuid.trim();
  const uuidPattern = /^[a-f0-9-]{36}$/i;

  if (!uuidPattern.test(trimmedUuid)) {
    return {
      valid: false,
      error: 'Format nomor referensi tidak valid. Format yang benar: xxxx-xxxx-xxxx',
    };
  }

  return { valid: true };
}


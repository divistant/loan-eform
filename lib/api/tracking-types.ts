import type { ApplicationTracking, ApplicationStatus } from "@/types/status-tracking";

/**
 * API Types untuk Status Tracking
 */

export type TrackingResponse = {
  success: true;
  data: ApplicationTracking;
};

export type TrackingError = {
  success: false;
  error: {
    code: 'NOT_FOUND' | 'INVALID_UUID' | 'SERVER_ERROR' | 'NETWORK_ERROR';
    message: string;
    userMessage: string; // User-friendly message dalam Bahasa Indonesia
  };
};

export type TrackingApiResponse = TrackingResponse | TrackingError;

/**
 * Polling Configuration
 */
export type PollingConfig = {
  interval: number; // milliseconds (default: 30000 = 30 seconds)
  enabled: boolean; // Auto-enable jika status belum final
  stopOnFinal: boolean; // Stop jika status APPROVED/REJECTED/DISBURSED
  retryOnError: boolean;
  maxRetries: number;
};

export const DEFAULT_POLLING_CONFIG: PollingConfig = {
  interval: 30000, // 30 seconds
  enabled: true,
  stopOnFinal: true,
  retryOnError: true,
  maxRetries: 3,
};


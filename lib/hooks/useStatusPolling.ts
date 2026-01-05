"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ApplicationTracking } from "@/types/status-tracking";
import { fetchTrackingStatus } from "@/lib/api/tracking-client";
import { isFinalStatus } from "@/types/status-tracking";
import type { PollingConfig } from "@/lib/api/tracking-types";
import { DEFAULT_POLLING_CONFIG } from "@/lib/api/tracking-types";

/**
 * Custom hook untuk polling status tracking
 * Auto-stop jika status sudah final (APPROVED/REJECTED/DISBURSED)
 */
export function useStatusPolling(
  uuid: string | null,
  config: Partial<PollingConfig> = {}
) {
  const pollingConfig = { ...DEFAULT_POLLING_CONFIG, ...config };
  const retryCountRef = useRef(0);

  const {
    data,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery<ApplicationTracking>({
    queryKey: ['tracking', uuid],
    queryFn: () => {
      if (!uuid) {
        throw new Error('UUID is required');
      }
      return fetchTrackingStatus(uuid);
    },
    enabled: !!uuid && pollingConfig.enabled,
    refetchInterval: (query) => {
      // Stop polling jika status sudah final
      if (pollingConfig.stopOnFinal) {
        const data = query.state.data;
        if (data && isFinalStatus(data.currentStatus)) {
          return false; // Stop polling
        }
      }

      // Stop polling jika disabled
      if (!pollingConfig.enabled) {
        return false;
      }

      return pollingConfig.interval;
    },
    retry: pollingConfig.retryOnError ? pollingConfig.maxRetries : false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 0, // Always consider data stale untuk real-time updates
  });

  // Reset retry count on success
  useEffect(() => {
    if (data) {
      retryCountRef.current = 0;
    }
  }, [data]);

  // Handle retry on error
  useEffect(() => {
    if (isError && pollingConfig.retryOnError) {
      if (retryCountRef.current < pollingConfig.maxRetries) {
        retryCountRef.current += 1;
        const timer = setTimeout(() => {
          refetch();
        }, 1000 * retryCountRef.current); // Exponential backoff

        return () => clearTimeout(timer);
      }
    }
  }, [isError, pollingConfig.retryOnError, pollingConfig.maxRetries, refetch]);

  const isPolling = !!uuid && pollingConfig.enabled && data && !isFinalStatus(data.currentStatus);
  const isFinal = data ? isFinalStatus(data.currentStatus) : false;

  return {
    data,
    error,
    isLoading,
    isError,
    isPolling,
    isFinal,
    refetch,
  };
}


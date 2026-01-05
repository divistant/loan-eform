"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TrackingMetadata } from "@/components/features/tracking/TrackingMetadata";
import { StatusTimeline } from "@/components/features/tracking/StatusTimeline";
import { StatusBadge } from "@/components/features/tracking/StatusBadge";
import { useStatusPolling } from "@/lib/hooks/useStatusPolling";
import { fetchTrackingStatus } from "@/lib/api/tracking-client";
import type { ApplicationTracking } from "@/types/status-tracking";
import { getStatusDescription } from "@/types/status-tracking";

type TrackingDetailContentProps = {
  uuid: string;
};

export function TrackingDetailContent({ uuid }: TrackingDetailContentProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [manualData, setManualData] = useState<ApplicationTracking | null>(null);

  // Use polling hook untuk real-time updates
  const {
    data: pollingData,
    error: pollingError,
    isLoading,
    isError,
    isPolling,
    isFinal,
    refetch,
  } = useStatusPolling(uuid, {
    interval: 30000, // 30 seconds
    enabled: true,
    stopOnFinal: true,
  });

  // Use manual data if polling hasn't loaded yet
  const tracking = pollingData || manualData;

  // Fetch initial data
  useEffect(() => {
    if (!pollingData && !isLoading) {
      fetchTrackingStatus(uuid)
        .then((data) => {
          setManualData(data);
          setError(null);
        })
        .catch((err: any) => {
          console.error("Error fetching tracking status:", err);
          setError(err.userMessage || "Terjadi kesalahan saat mengambil data status");
          toast.error(err.userMessage || "Terjadi kesalahan saat mengambil data status");
        });
    }
  }, [uuid, pollingData, isLoading]);

  // Handle error
  useEffect(() => {
    if (isError && pollingError) {
      const errorMessage = (pollingError as any)?.userMessage || "Terjadi kesalahan saat mengambil data status";
      setError(errorMessage);
    }
  }, [isError, pollingError]);

  if (isLoading && !tracking) {
    return (
      <div className="min-h-[calc(100vh-64px-100px)] bg-zinc-50 py-16">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || (isError && !tracking)) {
    return (
      <div className="min-h-[calc(100vh-64px-100px)] bg-zinc-50 py-16">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Gagal Memuat Status
                </h2>
                <p className="text-gray-600 mb-6">
                  {error || "Terjadi kesalahan saat mengambil data status"}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Coba Lagi
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/tracking">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Kembali ke Pencarian
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tracking) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-64px-100px)] bg-zinc-50 py-16">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            <Link href="/tracking">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Pencarian
            </Link>
          </Button>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-brand-500 via-brand-500 to-brand-600 p-6 sm:p-8 text-white relative overflow-hidden">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')]"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white drop-shadow-sm">
                      Status Pengajuan Kredit
                    </h1>
                    <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                      {getStatusDescription(tracking.currentStatus)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge 
                      status={tracking.currentStatus} 
                      size="lg" 
                      showIcon={true}
                      className="bg-white text-brand-600 border-2 border-white/30 shadow-lg"
                    />
                  </div>
                </div>
                {isPolling && (
                  <div className="mt-4 sm:mt-6 flex items-center gap-2 text-sm text-white/90 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 w-fit">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-sm shadow-green-400/50"></div>
                    <span className="font-medium">Memperbarui status secara real-time...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Metadata */}
              <TrackingMetadata
                uuid={tracking.uuid}
                metadata={tracking.metadata}
                submittedAt={tracking.submittedAt}
                lastUpdated={tracking.lastUpdated}
              />

              {/* Timeline */}
              <StatusTimeline tracking={tracking} />

              {/* Actions */}
              <div className="pt-8 border-t-2 border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    asChild 
                    variant="outline" 
                    className="flex-1 h-11 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 font-medium"
                  >
                    <Link href="/tracking">
                      Cek Status Lain
                    </Link>
                  </Button>
                  <Button 
                    onClick={() => refetch()} 
                    variant="outline"
                    className="flex-1 h-11 border-brand-300 hover:bg-brand-50 hover:border-brand-400 text-brand-700 font-medium"
                    disabled={isPolling}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isPolling ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button 
                    asChild 
                    className="flex-1 h-11 bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <a href="tel:+62212345678">
                      <Phone className="mr-2 h-4 w-4" />
                      Hubungi CS
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



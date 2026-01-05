"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { TrackingMetadata as TrackingMetadataType } from "@/types/status-tracking";
import { formatTimestamp } from "@/lib/utils/status-utils";

type TrackingMetadataProps = {
  uuid: string;
  metadata?: TrackingMetadataType;
  submittedAt: string;
  lastUpdated: string;
};

export function TrackingMetadata({
  uuid,
  metadata,
  submittedAt,
  lastUpdated,
}: TrackingMetadataProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUUID = () => {
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    toast.success("Nomor referensi berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/tracking/${uuid}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Status Pengajuan Kredit Bank Jakarta",
          text: `Cek status pengajuan kredit saya: ${uuid}`,
          url,
        });
        toast.success("Link berhasil dibagikan!");
      } catch (error) {
        // User cancelled atau error
        if (error instanceof Error && error.name !== 'AbortError') {
          // Fallback ke copy
          navigator.clipboard.writeText(url);
          toast.success("Link berhasil disalin!");
        }
      }
    } else {
      // Fallback ke copy jika share API tidak tersedia
      navigator.clipboard.writeText(url);
      toast.success("Link berhasil disalin!");
    }
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* UUID Section */}
      <div className="bg-gradient-to-br from-brand-50 to-white border-2 border-brand-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Nomor Referensi Pengajuan</p>
            <p className="text-base font-mono font-bold text-gray-900 break-all">{uuid}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyUUID}
              className="h-9 border-brand-300 hover:bg-brand-50 hover:border-brand-400 text-brand-700"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1.5" />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1.5" />
                  Salin
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-9 border-brand-300 hover:bg-brand-50 hover:border-brand-400 text-brand-700"
            >
              <Share2 className="h-4 w-4 mr-1.5" />
              Bagikan
            </Button>
          </div>
        </div>
      </div>

      {/* Metadata Section */}
      {metadata && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Informasi Pengajuan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-brand-300 hover:shadow-sm transition-all duration-200">
              <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Produk</p>
              <p className="text-base font-semibold text-gray-900">{metadata.productName}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-brand-300 hover:shadow-sm transition-all duration-200">
              <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Jumlah Pinjaman</p>
              <p className="text-base font-bold text-brand-600">{formatRupiah(metadata.loanAmount)}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-brand-300 hover:shadow-sm transition-all duration-200">
              <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Nama Pemohon</p>
              <p className="text-base font-semibold text-gray-900">{metadata.applicantName}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-brand-300 hover:shadow-sm transition-all duration-200">
              <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Email</p>
              <p className="text-base font-semibold text-gray-900 break-all">{metadata.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Timeline</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-brand-300 hover:shadow-sm transition-all duration-200">
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Tanggal Pengajuan</p>
            <p className="text-base font-semibold text-gray-900">{formatTimestamp(submittedAt)}</p>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-brand-300 hover:shadow-sm transition-all duration-200">
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Terakhir Diupdate</p>
            <p className="text-base font-semibold text-gray-900">{formatTimestamp(lastUpdated)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


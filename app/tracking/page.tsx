import { TrackingSearch } from "@/components/features/tracking/TrackingSearch";
import { Search, FileText, Clock, Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek Status Pengajuan | Bank Jakarta",
  description: "Cek status pengajuan kredit Anda dengan nomor referensi pengajuan",
};

export default function TrackingSearchPage() {
  return (
    <div className="min-h-[calc(100vh-64px-100px)] bg-zinc-50 py-16">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 mb-6">
              <Search className="h-8 w-8 text-brand-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Cek Status Pengajuan Kredit
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Masukkan nomor referensi pengajuan Anda untuk melihat status terkini
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
            <TrackingSearch />
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Nomor Referensi
              </h3>
              <p className="text-xs text-gray-600">
                Dapat ditemukan di email konfirmasi pengajuan Anda
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Update Real-time
              </h3>
              <p className="text-xs text-gray-600">
                Status akan diperbarui secara otomatis setiap 30 detik
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Aman & Privat
              </h3>
              <p className="text-xs text-gray-600">
                Data Anda terlindungi dan tidak perlu login
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


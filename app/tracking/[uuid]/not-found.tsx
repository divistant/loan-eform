import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Search } from "lucide-react";

export default function TrackingNotFound() {
  return (
    <div className="min-h-[calc(100vh-64px-100px)] bg-zinc-50 py-16">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Pengajuan Tidak Ditemukan
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Pengajuan dengan nomor referensi tersebut tidak ditemukan. 
                Silakan periksa kembali nomor referensi Anda atau hubungi customer service jika Anda yakin nomor referensi sudah benar.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Tips:
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Pastikan nomor referensi sudah benar (format: xxxx-xxxx-xxxx)</li>
                    <li>• Nomor referensi dapat ditemukan di email konfirmasi pengajuan</li>
                    <li>• Pastikan tidak ada spasi atau karakter tambahan</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/tracking">
                    <Search className="mr-2 h-4 w-4" />
                    Cari Lagi
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Beranda
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


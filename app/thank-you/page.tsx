"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Download, Clock, Mail, MessageSquare, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");
  const [copied, setCopied] = useState(false);

  const handleCopyUUID = () => {
    if (uuid) {
      navigator.clipboard.writeText(uuid);
      setCopied(true);
      toast.success("Nomor referensi berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <div className="min-h-[calc(100vh-64px-100px)] bg-zinc-50 flex items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-8 lg:px-16 max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-100">
          {/* Header Section */}
          <div className="bg-brand-500 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto bg-white rounded-full h-20 w-20 flex items-center justify-center mb-4"
            >
              <CheckCircle className="h-10 w-10 text-brand-500" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Pengajuan Berhasil Diterima!
            </h1>
            <p className="text-brand-100 text-sm">
              Terima kasih, data Anda telah tersimpan aman di sistem kami.
            </p>
          </div>

          {/* Body Section */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Reference Number */}
              {uuid && (
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Nomor Referensi Pengajuan</p>
                      <p className="text-sm font-mono font-semibold text-gray-900 break-all">{uuid}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyUUID}
                      className="shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Salin
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Simpan nomor referensi ini untuk keperluan follow-up pengajuan Anda.
                  </p>
                </div>
              )}

              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
                Apa langkah selanjutnya?
              </h2>

              {/* Timeline Steps */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Verifikasi Data</h3>
                    <p className="text-sm text-gray-500">
                      Tim analis kami sedang memverifikasi kelengkapan data Anda.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Konfirmasi WhatsApp</h3>
                    <p className="text-sm text-gray-500">
                      Tunggu pesan dari WhatsApp Official Bank Jakarta (08xxx) dalam 1x24 jam.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Keputusan Kredit</h3>
                    <p className="text-sm text-gray-500">
                      Notifikasi persetujuan final akan dikirimkan melalui Email Anda.
                    </p>
                  </div>
                </div>
              </div>

              {/* JakOne Mobile Banner */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between gap-4 mt-8">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Download JakOne Mobile</h3>
                  <p className="text-xs text-gray-500">Pantau status pengajuan lebih mudah.</p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 h-8 text-xs" asChild>
                  <a href="#" target="_blank">
                    <Download className="mr-2 h-3 w-3" />
                    Install
                  </a>
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                {uuid && (
                  <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold h-11 transition-all duration-300" asChild>
                    <Link href={`/tracking/${uuid}`}>
                      Lacak Status Pengajuan
                    </Link>
                  </Button>
                )}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-11" asChild>
                    <Link href="/tracking">
                      Cek Status Lain
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1 h-11" asChild>
                    <Link href="/">
                      Kembali ke Beranda
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-64px-100px)] bg-zinc-50 flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}


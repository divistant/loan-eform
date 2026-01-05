"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useFormStore } from "@/lib/store/useFormStore";
import { consentSchema, type ConsentFormValues } from "@/lib/validators/form-schema";
import { toast } from "sonner";
import { Loader2, ArrowRight, Edit2, User, Mail, Phone, CreditCard, DollarSign, Calendar, MapPin, Briefcase, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { submitLoanProspect } from "@/lib/api/loan-prospect-client";
import { transformFormDataToAPI } from "@/lib/utils/api-transformer";

export function StepConsent() {
  const { draft, updateDraft, reset, selectedProduct, setStep, verification } = useFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<ConsentFormValues>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      consent: draft.consent,
    },
  });

  const isChecked = form.watch("consent");

  // Helper untuk format rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Helper untuk mask NIK (format: 1234********5678)
  const maskNIK = (nik: string) => {
    if (nik.length !== 16) return nik;
    return `${nik.substring(0, 4)}${"*".repeat(8)}${nik.substring(12)}`;
  };

  const submitForm = async (data: ConsentFormValues) => {
    if (!selectedProduct || !verification.phoneNumber) {
      toast.error("Data tidak lengkap. Silakan lengkapi form terlebih dahulu.");
      return;
    }

    updateDraft("consent", data.consent as any);
    setIsSubmitting(true);
    setLastError(null);

    try {
      // Transform form data ke format API
      const apiPayload = transformFormDataToAPI(
        { ...draft, consent: data.consent },
        selectedProduct,
        verification.phoneNumber
      );

      // Submit ke API
      console.log("📤 [CLIENT] Submitting loan prospect...");
      console.log("📦 [CLIENT] Payload:", JSON.stringify(apiPayload, null, 2));
      
      const response = await submitLoanProspect(apiPayload);

      console.log("📥 [CLIENT] API Response:", response);
      console.log("🆔 [CLIENT] UUID:", response.data?.prpect_uuid);

      // Cek apakah Mock atau Real API berdasarkan UUID format
      if (response.data?.prpect_uuid?.startsWith("MOCK-")) {
        console.log("🔵 [CLIENT] Menggunakan MOCK API");
      } else {
        console.log("🟢 [CLIENT] Menggunakan REAL API");
      }

      // Success
      if (response.data?.prpect_uuid) {
        toast.success("Pengajuan berhasil dikirim!");
        reset();
        router.push(`/thank-you?uuid=${encodeURIComponent(response.data.prpect_uuid)}`);
      } else {
        toast.error("Pengajuan berhasil dikirim, namun tidak ada UUID yang diterima.");
        reset();
        router.push("/thank-you");
      }
    } catch (error: any) {
      // Handle error responses
      let errorMessage = "Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.";

      if (error.status === 400) {
        errorMessage = error.userMessage || error.message || "Data yang dikirim tidak valid. Silakan periksa kembali.";
      } else if (error.status === 401) {
        errorMessage = "Autentikasi gagal. Silakan coba lagi.";
      } else if (error.status === 403) {
        errorMessage = "Akses ditolak. Silakan hubungi administrator.";
      } else if (error.status === 404) {
        errorMessage = "Endpoint tidak ditemukan.";
      } else if (error.status === 409) {
        errorMessage = "Data dengan NIK ini sudah terdaftar.";
      } else if (error.status === 500) {
        // Check if it's a configuration error
        if (error.userMessage && error.userMessage.includes("tidak dikonfigurasi")) {
          errorMessage = error.userMessage + " Lihat ENV_SETUP.md untuk panduan setup.";
        } else {
          errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setLastError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: ConsentFormValues) => {
    submitForm(data);
  };

  const handleRetry = () => {
    const currentData = form.getValues();
    submitForm(currentData);
  };

  return (
    <div className="space-y-6">
      {/* Data Summary Card */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Ringkasan Data Pengajuan</h3>
          <p className="text-xs text-gray-500">Periksa kembali data Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informasi Pribadi */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Nama Lengkap</p>
                <p className="text-sm font-medium text-gray-900">{draft.personal.fullName || "-"}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 hover:bg-gray-200"
                onClick={() => setStep(0)}
                type="button"
              >
                <Edit2 className="h-3 w-3 text-gray-400" />
              </Button>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Email</p>
                <p className="text-sm font-medium text-gray-900">{draft.personal.email || "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Nomor WhatsApp</p>
                <p className="text-sm font-medium text-gray-900">{verification.phoneNumber || "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Tanggal Lahir</p>
                <p className="text-sm font-medium text-gray-900">
                  {draft.personal.birthdate 
                    ? new Date(draft.personal.birthdate).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })
                    : "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Alamat</p>
                <p className="text-sm font-medium text-gray-900">{draft.personal.address || "-"}</p>
              </div>
            </div>
          </div>

          {/* Data Pengajuan */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <CreditCard className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">NIK</p>
                <p className="text-sm font-medium text-gray-900 font-mono">{draft.screening.nik ? maskNIK(draft.screening.nik) : "-"}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 hover:bg-gray-200"
                onClick={() => setStep(2)}
                type="button"
              >
                <Edit2 className="h-3 w-3 text-gray-400" />
              </Button>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Pendapatan Bulanan</p>
                <p className="text-sm font-medium text-gray-900">{draft.screening.monthlyIncome ? formatRupiah(draft.screening.monthlyIncome) : "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Jangka Waktu</p>
                <p className="text-sm font-medium text-gray-900">
                  {draft.screening.requestedTenor 
                    ? `${draft.screening.requestedTenor} ${selectedProduct?.constraints.tenor_type === "YEAR" ? "Tahun" : "Bulan"}` 
                    : "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Briefcase className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Pekerjaan</p>
                <p className="text-sm font-medium text-gray-900">{draft.screening.occupation || "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Lama Bekerja</p>
                <p className="text-sm font-medium text-gray-900">
                  {draft.screening.workDuration ? `${draft.screening.workDuration} Tahun` : "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">Jumlah Pinjaman</p>
                <p className="text-sm font-medium text-gray-900">
                  {draft.screening.loanAmount ? formatRupiah(draft.screening.loanAmount) : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Consent */}
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 h-64 overflow-y-auto">
          <h3 className="font-bold text-brand-900 mb-2">Syarat dan Ketentuan</h3>
          <p className="mb-2">
            Dengan melanjutkan pengajuan ini, saya menyatakan bahwa:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Data yang saya berikan adalah benar, akurat, dan lengkap.</li>
            <li>Saya memberikan persetujuan kepada Bank Jakarta untuk melakukan pemeriksaan data ke pihak ketiga (termasuk SLIK OJK) dalam rangka pemrosesan kredit.</li>
            <li>Saya mengerti bahwa Bank Jakarta berhak menyetujui atau menolak pengajuan ini berdasarkan kebijakan internal Bank.</li>
            <li>Saya menyetujui bahwa data kontak saya dapat digunakan oleh Bank Jakarta untuk keperluan penawaran produk atau layanan lainnya di masa mendatang.</li>
          </ul>
          <p className="mt-4">
            Harap baca dokumen Syarat dan Ketentuan Umum Produk Pinjaman Bank Jakarta selengkapnya di website resmi kami sebelum menyetujui.
          </p>
        </div>

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-4 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                  className="mt-0.5 shrink-0"
                />
              </FormControl>
              <div className="flex-1 space-y-1">
                <FormLabel className="text-sm font-normal leading-relaxed cursor-pointer flex flex-wrap items-center gap-x-1 gap-y-1">
                  <span>Saya menyetujui data saya diproses oleh</span>
                  <span>Bank Jakarta sesuai dengan</span>
                  <a 
                    href="https://www.bankdki.co.id/syarat-ketentuan" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brand-500 font-medium underline hover:text-brand-600 transition-colors inline-flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Syarat & Ketentuan
                  </a>
                  <span>dan</span>
                  <a 
                    href="https://www.bankdki.co.id/kebijakan-privasi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brand-500 font-medium underline hover:text-brand-600 transition-colors inline-flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Kebijakan Privasi
                  </a>
                  <span>.</span>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {lastError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 mb-1">Pengajuan Gagal</p>
                <p className="text-sm text-red-700">{lastError}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetry}
                disabled={isSubmitting}
                className="shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Mencoba...
                  </>
                ) : (
                  "Coba Lagi"
                )}
              </Button>
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold h-12 rounded-md transition-all duration-300 mt-6"
          disabled={!isChecked || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengirim Pengajuan...
            </>
          ) : (
            <>
              Ajukan Sekarang <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        </form>
      </Form>
    </div>
  );
}

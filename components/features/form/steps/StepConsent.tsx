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
import { Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function StepConsent() {
  const { draft, updateDraft, reset } = useFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<ConsentFormValues>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      consent: draft.consent,
    },
  });

  const isChecked = form.watch("consent");

  const onSubmit = async (data: ConsentFormValues) => {
    updateDraft("consent", data.consent as any); // Type assertion needed due to boolean being primitive not object
    setIsSubmitting(true);

    // Prepare payload
    const payload = {
      ...draft,
      consent: data.consent,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/mock/leads", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        reset(); // Reset form store
        router.push("/thank-you"); // Redirect to thank you page
      } else {
        toast.error("Gagal mengirim pengajuan");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal leading-relaxed">
                  Saya menyetujui data saya diproses oleh Bank Jakarta sesuai dengan{" "}
                  <a 
                    href="https://www.bankdki.co.id/syarat-ketentuan" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brand-500 underline hover:text-brand-600 transition-colors"
                  >
                    Syarat & Ketentuan
                  </a>{" "}
                  dan{" "}
                  <a 
                    href="https://www.bankdki.co.id/kebijakan-privasi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-brand-500 underline hover:text-brand-600 transition-colors"
                  >
                    Kebijakan Privasi
                  </a>.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

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
  );
}

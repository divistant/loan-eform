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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormStore } from "@/lib/store/useFormStore";
import {
  screeningSchema,
  type ScreeningFormValues,
} from "@/lib/validators/form-schema";
import { ArrowRight, Loader2, Info } from "lucide-react";
import { NumericFormat } from "react-number-format";

export function StepScreening() {
  const { draft, updateDraft, nextStep, selectedProduct } = useFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper untuk format rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Dynamic validation untuk monthlyIncome dan loanAmount berdasarkan produk
  const dynamicScreeningSchema = screeningSchema
    .refine(
      (data) => {
        if (selectedProduct) {
          // Validasi monthlyIncome harus >= min_income produk
          return data.monthlyIncome >= selectedProduct.constraints.min_income;
        }
        return true;
      },
      {
        message: `Penghasilan minimal untuk produk ini adalah ${formatRupiah(selectedProduct?.constraints.min_income || 0)} per bulan`,
        path: ["monthlyIncome"],
      }
    )
    .refine(
      (data) => {
        if (selectedProduct) {
          // Minimal loan amount biasanya 10% dari annual income atau minimum tertentu
          const minLoanAmount = Math.max(1000000, selectedProduct.constraints.min_income * 12 * 0.1);
          return data.loanAmount >= minLoanAmount;
        }
        return true;
      },
      {
        message: `Jumlah pinjaman minimal ${formatRupiah(Math.max(1000000, (selectedProduct?.constraints.min_income || 0) * 12 * 0.1))}`,
        path: ["loanAmount"],
      }
    );

  const form = useForm<ScreeningFormValues>({
    resolver: zodResolver(dynamicScreeningSchema),
    defaultValues: {
      nik: draft.screening.nik,
      monthlyIncome: draft.screening.monthlyIncome,
      requestedTenor: draft.screening.requestedTenor,
      occupation: draft.screening.occupation || "",
      workDuration: draft.screening.workDuration || 0,
      loanAmount: draft.screening.loanAmount || 0,
    },
  });

  const onSubmit = async (data: ScreeningFormValues) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    updateDraft("screening", data);
    setIsSubmitting(false);
    nextStep();
  };

  if (!selectedProduct) return null;

  return (
    <div className="space-y-6">
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-1">Mengapa kami meminta data ini?</p>
          <p>
            Data pekerjaan dan penghasilan membantu kami memberikan rekomendasi tenor yang sesuai dengan kemampuan Anda. 
            <strong className="ml-1">Minimal penghasilan untuk produk ini: {formatRupiah(selectedProduct.constraints.min_income)}</strong>
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nik"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Induk Kependudukan (NIK)</FormLabel>
              <FormControl>
                <Input
                  placeholder="16 digit NIK"
                  maxLength={16}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monthlyIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pendapatan Bulanan</FormLabel>
              <FormControl>
                <NumericFormat
                  customInput={Input}
                  prefix="Rp "
                  thousandSeparator="."
                  decimalSeparator=","
                  placeholder="Rp 0"
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.floatValue || 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requestedTenor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Jangka Waktu ({selectedProduct.constraints.tenor_type === "YEAR" ? "Tahun" : "Bulan"})
              </FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value ? String(field.value) : undefined}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih tenor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedProduct.constraints.tenor_options.map((tenor) => (
                    <SelectItem key={tenor} value={String(tenor)}>
                      {tenor} {selectedProduct.constraints.tenor_type === "YEAR" ? "Tahun" : "Bulan"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pekerjaan</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Karyawan Swasta, Wiraswasta, PNS"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lama Bekerja (Tahun)</FormLabel>
              <FormControl>
                <NumericFormat
                  customInput={Input}
                  placeholder="0"
                  allowNegative={false}
                  decimalScale={0}
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.floatValue || 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="loanAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Pinjaman</FormLabel>
              <FormControl>
                <NumericFormat
                  customInput={Input}
                  prefix="Rp "
                  thousandSeparator="."
                  decimalSeparator=","
                  placeholder="Rp 0"
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.floatValue || 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold h-12 rounded-md transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Cek Kelayakan <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        </form>
      </Form>
    </div>
  );
}

import { z } from "zod";

export const identitySchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  phoneNumber: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .regex(/^(08|628)\d+$/, "Nomor HP harus diawali 08 atau 628"),
});

export const otpSchema = z.object({
  code: z.string().length(4, "Kode OTP harus 4 digit"),
});

export const screeningSchema = z.object({
  nik: z
    .string()
    .length(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK harus berupa angka"),
  monthlyIncome: z.number().min(0, "Penghasilan tidak boleh negatif"), // Validasi minimum tergantung produk nanti
  requestedTenor: z.number().min(1, "Tenor harus dipilih"),
});

export const consentSchema = z.object({
  consent: z.boolean().refine((val) => val === true, {
    message: "Anda harus menyetujui syarat dan ketentuan",
  }),
});

export type IdentityFormValues = z.infer<typeof identitySchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type ScreeningFormValues = z.infer<typeof screeningSchema>;
export type ConsentFormValues = z.infer<typeof consentSchema>;

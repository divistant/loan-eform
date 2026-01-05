import { z } from "zod";

export const identitySchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  phoneNumber: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .regex(/^(08|628)\d+$/, "Nomor HP harus diawali 08 atau 628"),
  birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
    .refine((date) => {
      const parsed = new Date(date);
      const today = new Date();
      const minAge = new Date();
      minAge.setFullYear(today.getFullYear() - 100);
      return parsed <= today && parsed >= minAge;
    }, "Tanggal lahir tidak valid"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
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
  occupation: z.string().min(2, "Pekerjaan minimal 2 karakter"),
  workDuration: z.number().min(0, "Lama kerja tidak boleh negatif").max(50, "Lama kerja maksimal 50 tahun"),
  loanAmount: z.number().min(1000000, "Jumlah pinjaman minimal Rp 1.000.000"),
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

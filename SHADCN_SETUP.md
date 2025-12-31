# Instruksi Setup Shadcn UI

Setelah menjalankan `npx shadcn@latest init`, tambahkan komponen-komponen berikut sesuai dengan TECHNICAL_BLUEPRINT.md:

## Komponen yang Perlu Ditambahkan

Jalankan perintah berikut satu per satu:

```bash
# Input OTP (untuk StepOtp.tsx)
npx shadcn@latest add input-otp

# Button (untuk semua tombol)
npx shadcn@latest add button

# Card (untuk ProductCard dan layout)
npx shadcn@latest add card

# Form components (untuk form validation dengan react-hook-form)
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add label

# Stepper/Progress indicator (untuk FormLayout wizard)
npx shadcn@latest add progress

# Toast/Notification (untuk menampilkan OTP code "8888")
npx shadcn@latest add sonner

# Optional: Select (jika diperlukan untuk dropdown)
npx shadcn@latest add select
```

## Catatan

- Semua komponen akan otomatis terinstall di `components/ui/`
- Pastikan sudah menjalankan `npx shadcn@latest init` terlebih dahulu
- Setelah init, pastikan `tailwind.config.ts` sudah dikonfigurasi dengan brand colors Bank Jakarta sesuai blueprint


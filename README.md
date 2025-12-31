# Bank Jakarta E-Form Application

Aplikasi formulir digital untuk pengajuan produk Bank Jakarta dengan multi-step wizard form.

## 🚀 Fitur

- **Landing Page** dengan informasi produk pinjaman
- **Product Selection** - Pilih produk pinjaman yang sesuai
- **Multi-Step Form Wizard**:
  - Step 1: Screening (kelayakan awal)
  - Step 2: Identity (data pribadi)
  - Step 3: OTP Verification
  - Step 4: Consent (persetujuan)
- **Responsive Design** - Optimized untuk desktop & mobile
- **Modern UI** - Menggunakan Tailwind CSS & Shadcn/ui
- **Form Validation** - Validasi menggunakan Zod & React Hook Form
- **State Management** - Zustand untuk global state
- **Mock API** - Built-in mock API untuk development

## 📋 Prerequisites

- Node.js 18.x atau lebih tinggi
- npm atau yarn

## 🛠️ Instalasi

1. Clone repository:
```bash
git clone https://github.com/divistant/loan-eform.git
cd loan-eform
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm run dev
```

4. Buka browser di [http://localhost:3000](http://localhost:3000)

## 📦 Build untuk Production

```bash
npm run build
npm start
```

## 🌐 Deploy ke Vercel

### Opsi 1: Deploy via Vercel Dashboard (Recommended)

1. Push kode ke GitHub repository
2. Buka [Vercel Dashboard](https://vercel.com/new)
3. Import repository GitHub Anda
4. Vercel akan otomatis mendeteksi Next.js dan konfigurasi yang tepat
5. Klik "Deploy"

### Opsi 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login ke Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Untuk production deployment:
```bash
vercel --prod
```

## 🏗️ Struktur Project

```
bank-jakarta-eform/
├── app/                      # Next.js App Router
│   ├── api/mock/            # Mock API endpoints
│   ├── apply/[productId]/   # Form wizard pages
│   ├── thank-you/           # Success page
│   └── page.tsx             # Landing page
├── components/
│   ├── features/            # Feature-specific components
│   │   ├── form/           # Form wizard components
│   │   └── product/        # Product components
│   ├── landing/            # Landing page sections
│   ├── layout/             # Layout components
│   ├── ui/                 # Shadcn/ui components
│   └── providers/          # React Query provider
├── lib/
│   ├── store/              # Zustand store
│   └── validators/         # Zod schemas
├── types/                   # TypeScript types
└── public/                  # Static assets
```

## 🔧 Tech Stack

- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Animation**: Framer Motion

## 📝 Environment Variables

Tidak ada environment variables yang required untuk menjalankan aplikasi ini karena menggunakan mock API. 

Jika Anda ingin mengintegrasikan dengan API eksternal di masa depan, Anda bisa menambahkan:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

## 🎨 Customization

### Mengubah Tema
Edit file `app/globals.css` untuk mengubah color scheme.

### Menambah Produk
Edit file `app/api/mock/products/route.ts` untuk menambah atau mengubah produk.

### Mengubah Form Fields
Edit schema di `lib/validators/form-schema.ts` dan komponen di `components/features/form/steps/`.

## 📄 Dokumentasi Tambahan

- [PRD.md](./PRD.md) - Product Requirements Document
- [TECHNICAL_BLUEPRINT.md](./TECHNICAL_BLUEPRINT.md) - Technical Blueprint
- [SHADCN_SETUP.md](./SHADCN_SETUP.md) - Shadcn/ui Setup Guide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

Untuk pertanyaan atau dukungan, silakan buka issue di GitHub repository.

## 📜 License

This project is licensed under the MIT License.


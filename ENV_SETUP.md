# Setup Environment Variables

## ⚡ Quick Start (Development Mode)

**TIDAK PERLU SETUP APAPUN!** Aplikasi akan otomatis menggunakan **Mock API** di development mode jika environment variables tidak dikonfigurasi. Langsung bisa test tanpa error!

## 🎯 Untuk Demo POC dengan Real API

**Lihat panduan lengkap di [DEMO_POC_SETUP.md](./DEMO_POC_SETUP.md)** untuk setup demo POC dengan Real API, termasuk:
- Step-by-step setup guide
- Pre-demo testing checklist
- Troubleshooting guide
- Tips untuk demo

## Development Mode (Tanpa API Eksternal)

Aplikasi akan **otomatis** menggunakan **Mock API** di development mode jika:
- File `.env.local` tidak ada, ATAU
- `NEXT_PUBLIC_API_BASE_URL` tidak di-set

**Tidak perlu membuat file `.env.local` untuk development!** Aplikasi sudah siap digunakan langsung.

## Production Mode / Testing dengan API Eksternal

**Hanya perlu setup jika ingin menggunakan API eksternal yang sebenarnya.**

Untuk menggunakan API eksternal yang sebenarnya, buat file `.env.local` di root project dengan konfigurasi berikut:

```env
# API Configuration
# Untuk demo POC, lihat DEMO_POC_SETUP.md untuk panduan lengkap

# Base URL API (dari tim API)
NEXT_PUBLIC_API_BASE_URL=http://149.129.194.51:9200/fincoreplus-mblbackend

# Client ID (default: 1003, konfirmasi dengan tim API)
NEXT_PUBLIC_CLIENT_ID=1003

# Client Password untuk HMAC signature (dari tim API)
# Default dari Postman: 20260103extScrt20260103
# Pastikan dapat credentials yang benar dari tim API
NEXT_PUBLIC_CLIENT_PASSWORD=your-client-password-here
```

### Quick Reference (dari Postman Collection)

- **Client Password (default)**: `20260103extScrt20260103`
- **Client ID (default)**: `1003`
- **Base URL**: Akan diberikan oleh tim API

**⚠️ Catatan**: Credentials di Postman adalah contoh. Pastikan dapat credentials yang benar dari tim API untuk demo POC.

### Cara Setup:

1. **Buat file `.env.local`** di root directory project (sama level dengan `package.json`)

2. **Copy dan isi dengan konfigurasi API Anda:**
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://149.129.194.51:9200/fincoreplus-mblbackend
   NEXT_PUBLIC_CLIENT_ID=1003
   NEXT_PUBLIC_CLIENT_PASSWORD=20260103extScrt20260103
   ```

3. **Restart development server** setelah membuat/update `.env.local`:
   ```bash
   npm run dev
   ```

### Catatan Penting:

- File `.env.local` sudah di-ignore oleh git (tidak akan ter-commit)
- Jangan commit file `.env.local` yang berisi credentials ke repository
- Untuk production, setup environment variables di platform hosting (Vercel, dll)
- Di development mode, jika `NEXT_PUBLIC_API_BASE_URL` tidak di-set, aplikasi akan otomatis menggunakan Mock API

### Testing:

1. **Tanpa API eksternal (Mock Mode):**
   - Tidak perlu setup apapun
   - Aplikasi akan menggunakan mock response
   - Cocok untuk development dan testing UI

2. **Dengan API eksternal:**
   - Setup `.env.local` dengan credentials yang benar
   - Pastikan API endpoint accessible
   - Test dengan data yang valid

### Troubleshooting:

**Error: "API base URL tidak dikonfigurasi"**
- ✅ **Sudah diperbaiki!** Di development mode, aplikasi akan otomatis menggunakan Mock API tanpa error
- Jika masih muncul error, pastikan development server sudah di-restart setelah perubahan
- Di production: Pastikan environment variables sudah di-set di hosting platform (Vercel, dll)

**Error: "Client password tidak dikonfigurasi"**
- Hanya muncul jika `NEXT_PUBLIC_API_BASE_URL` sudah di-set tapi `NEXT_PUBLIC_CLIENT_PASSWORD` belum
- Setup `NEXT_PUBLIC_CLIENT_PASSWORD` di `.env.local`
- Atau hapus `.env.local` untuk kembali ke Mock API mode

**Cara kembali ke Mock API mode:**
- Hapus atau rename file `.env.local`
- Restart development server
- Aplikasi akan otomatis menggunakan Mock API


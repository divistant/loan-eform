# Setup Demo POC dengan Real API

Panduan lengkap untuk setup aplikasi Bank Jakarta E-Form agar terhubung ke Real API untuk demo POC.

## 📋 Prerequisites

Sebelum memulai setup, pastikan Anda memiliki:

- ✅ Akses ke repository project
- ✅ Node.js dan npm terinstall
- ✅ Development server bisa berjalan (`npm run dev`)
- ✅ **Credentials dari tim API**:
  - Base URL API: `http://149.129.194.51:9200/fincoreplus-mblbackend`
  - Client Password (default dari Postman: `20260103extScrt20260103`)
  - Client ID (default: `1003`)

## 🚀 Step-by-Step Setup

### Step 1: Dapatkan Credentials dari Tim API

Hubungi tim API untuk mendapatkan:
1. **Base URL API** - URL endpoint API eksternal
2. **Client Password** - Password untuk HMAC signature (mungkin berbeda dari Postman)
3. **Client ID** - ID client (default: `1003`, konfirmasi jika berbeda)

**Note**: Credentials di Postman collection (`20260103extScrt20260103`) adalah contoh. Pastikan dapat credentials yang benar dari tim API.

### Step 2: Buat File `.env.local`

1. **Buat file `.env.local`** di root directory project (sama level dengan `package.json`)

2. **Copy template berikut dan isi dengan credentials yang benar:**

```env
# API Configuration untuk Demo POC
# Pastikan credentials ini sesuai dengan yang diberikan tim API

# Base URL API (dari tim API)
NEXT_PUBLIC_API_BASE_URL=http://149.129.194.51:9200/fincoreplus-mblbackend

# Client ID (default: 1003, konfirmasi dengan tim API)
NEXT_PUBLIC_CLIENT_ID=1003

# Client Password untuk HMAC signature (dari tim API)
NEXT_PUBLIC_CLIENT_PASSWORD=20260103extScrt20260103
```

3. **Ganti values dengan credentials yang benar:**
   - `NEXT_PUBLIC_API_BASE_URL`: Ganti dengan base URL yang diberikan tim API
   - `NEXT_PUBLIC_CLIENT_PASSWORD`: Ganti dengan password yang diberikan tim API
   - `NEXT_PUBLIC_CLIENT_ID`: Ganti jika berbeda dari default

### Step 3: Restart Development Server

**PENTING**: Next.js hanya membaca environment variables saat server start. Setelah membuat/update `.env.local`, **WAJIB restart server**.

```bash
# Stop server (Ctrl+C di terminal)
# Kemudian start lagi
npm run dev
```

### Step 4: Verifikasi Setup

#### 4.1 Cek Environment Variables Terbaca

Cek di terminal server saat start, tidak ada error tentang missing environment variables.

#### 4.2 Test dengan Submit Form

1. Buka aplikasi di browser: `http://localhost:3001`
2. Isi form lengkap dengan data valid
3. Submit form
4. **Cek di terminal server** - harus muncul log:
   ```
   🟢 [REAL API] Menggunakan Real API: http://149.129.194.51:9200/fincoreplus-mblbackend
   📦 [REAL API] Payload: {...}
   ✅ [REAL API] Success Response: {...}
   🆔 [REAL API] UUID: eca8f6ae-4ef2-d541-930b-37fa79a500e3
   ```

5. **Cek di browser console** (F12 → Console) - harus muncul:
   ```
   🟢 [CLIENT] Menggunakan REAL API
   🆔 [CLIENT] UUID: eca8f6ae-4ef2-d541-930b-37fa79a500e3
   ```

6. **Cek di Network tab** (F12 → Network):
   - Request ke `/api/external/loanprospects`
   - Response body harus berisi UUID format standar (bukan `MOCK-xxx`)
   - Status code: 201 Created

#### 4.3 Verifikasi UUID Format

- ✅ **Real API**: UUID format standar seperti `eca8f6ae-4ef2-d541-930b-37fa79a500e3`
- ❌ **Mock API**: UUID format `MOCK-1767579449121-ilor60gcl`

## ✅ Pre-Demo Testing Checklist

Sebelum demo POC, pastikan semua item berikut sudah ditest:

### Functional Testing
- [ ] Form bisa diisi lengkap tanpa error
- [ ] Validasi form bekerja dengan benar
- [ ] OTP verification berjalan
- [ ] Submit form berhasil
- [ ] Response dari API berisi `prpect_uuid` yang valid
- [ ] UUID format adalah format standar (bukan `MOCK-xxx`)

### API Connection Testing
- [ ] Terminal server menunjukkan log `🟢 [REAL API]`
- [ ] Browser console menunjukkan `🟢 [CLIENT] Menggunakan REAL API`
- [ ] Network tab menunjukkan request ke Real API endpoint
- [ ] Response status code: 201 Created
- [ ] Response body berisi data yang valid

### Error Handling Testing
- [ ] Test dengan data invalid (harus return error yang jelas)
- [ ] Test dengan NIK duplicate (jika API support, harus return 409)
- [ ] Test dengan network error (harus handle dengan baik)

### Data Validation
- [ ] Semua field terkirim dengan format yang benar
- [ ] Product name ter-mapping dengan benar (KPR, KMG, Mikro)
- [ ] Date format: YYYY-MM-DD
- [ ] Phone number format: hanya angka
- [ ] Number fields: format number (bukan string)

## 🔧 Troubleshooting

### Masalah: Masih Menggunakan Mock API

**Gejala**: UUID dimulai dengan `MOCK-xxx`, log menunjukkan `🔵 [MOCK API]`

**Solusi**:
1. Pastikan file `.env.local` ada di root project
2. Pastikan `NEXT_PUBLIC_API_BASE_URL` terisi dengan benar
3. **Restart development server** (wajib!)
4. Cek tidak ada typo di nama variable (case-sensitive)
5. Cek tidak ada spasi di sekitar `=` (contoh: `KEY = value` ❌, `KEY=value` ✅)

### Masalah: Error "Client password tidak dikonfigurasi"

**Gejala**: Error muncul saat submit form

**Solusi**:
1. Pastikan `NEXT_PUBLIC_CLIENT_PASSWORD` terisi di `.env.local`
2. Pastikan tidak ada spasi atau karakter aneh
3. Restart development server

### Masalah: Error 401 Unauthorized

**Gejala**: API return 401 dengan message "Invalid signature"

**Solusi**:
1. Pastikan `NEXT_PUBLIC_CLIENT_PASSWORD` benar (dari tim API)
2. Cek apakah password berbeda dari Postman collection
3. Pastikan timestamp dan signature di-generate dengan benar
4. Hubungi tim API untuk verifikasi credentials

### Masalah: Error 404 Not Found

**Gejala**: API return 404

**Solusi**:
1. Pastikan `NEXT_PUBLIC_API_BASE_URL` benar
2. Pastikan endpoint path benar: `/api/external/loanprospects`
3. Test dengan Postman untuk verifikasi endpoint accessible
4. Cek apakah base URL perlu trailing slash atau tidak

### Masalah: Error 400 Bad Request

**Gejala**: API return 400 dengan validation error

**Solusi**:
1. Cek payload di terminal log (`📦 [REAL API] Payload`)
2. Pastikan semua field required terisi
3. Pastikan format data sesuai (date: YYYY-MM-DD, numbers: number bukan string)
4. Cek product name mapping (KPR, KMG, Mikro)

## 🔄 Switch Antara Mock dan Real API

### Kembali ke Mock API (untuk development)

1. **Hapus atau rename file `.env.local`**:
   ```bash
   mv .env.local .env.local.backup
   # atau
   rm .env.local
   ```

2. **Restart development server**

3. Aplikasi akan otomatis menggunakan Mock API

### Kembali ke Real API

1. **Restore file `.env.local`**:
   ```bash
   mv .env.local.backup .env.local
   ```

2. **Restart development server**

3. Aplikasi akan menggunakan Real API

## 💡 Tips untuk Demo POC

### 1. Backup Plan

Siapkan backup jika API down selama demo:
- **Quick switch ke Mock API**: Hapus `.env.local` dan restart server
- **Siapkan data test yang valid** sebelumnya
- **Test semua flow** sebelum demo

### 2. Monitoring Selama Demo

Buka tools berikut selama demo:
- **Terminal server**: Monitor logs untuk melihat request/response
- **Browser DevTools → Network tab**: Monitor API calls
- **Browser DevTools → Console**: Monitor client-side logs

### 3. Data Test yang Valid

Siapkan data test yang sudah terverifikasi:
- NIK valid (16 digit)
- Nomor HP valid (format: 08xx atau 628xx)
- Tanggal lahir valid (format: YYYY-MM-DD)
- Data lain sesuai requirement

### 4. Pre-Demo Verification

**1 hari sebelum demo**:
- [ ] Test full flow dengan Real API
- [ ] Verifikasi semua credentials benar
- [ ] Test dengan berbagai skenario
- [ ] Siapkan backup plan

**1 jam sebelum demo**:
- [ ] Test sekali lagi dengan Real API
- [ ] Pastikan server running
- [ ] Buka monitoring tools (terminal, Network tab)
- [ ] Siapkan data test yang akan digunakan

### 5. Quick Fixes

Jika ada masalah selama demo:

**API Timeout/Error**:
1. Cek Network tab untuk detail error
2. Cek terminal server untuk logs
3. Jika perlu, quick switch ke Mock API (hapus `.env.local`, restart)

**Form Error**:
1. Cek browser console untuk error details
2. Pastikan semua field terisi dengan benar
3. Cek validasi form

## 📊 Verifikasi Real API vs Mock API

### Cara Cek di Terminal Server

**Mock API**:
```
🔵 [MOCK API] Menggunakan Mock API - Development Mode
🆔 [MOCK API] UUID: MOCK-1767579449121-ilor60gcl
```

**Real API**:
```
🟢 [REAL API] Menggunakan Real API: http://149.129.194.51:9200/fincoreplus-mblbackend
🆔 [REAL API] UUID: eca8f6ae-4ef2-d541-930b-37fa79a500e3
```

### Cara Cek di Browser Console

**Mock API**:
```
🔵 [CLIENT] Menggunakan MOCK API
🆔 [CLIENT] UUID: MOCK-1767579449121-ilor60gcl
```

**Real API**:
```
🟢 [CLIENT] Menggunakan REAL API
🆔 [CLIENT] UUID: eca8f6ae-4ef2-d541-930b-37fa79a500e3
```

### Cara Cek di Network Tab

**Mock API**:
- Response body: `{"data": {"prpect_uuid": "MOCK-xxx", ...}, "message": "Mock API - Development Mode"}`

**Real API**:
- Response body: `{"data": {"prpect_uuid": "eca8f6ae-4ef2-d541-930b-37fa79a500e3", ...}}`
- Tidak ada message "Mock API"

## 🔐 Security Notes

- ⚠️ **JANGAN commit file `.env.local`** ke repository
- ⚠️ File `.env.local` sudah di-ignore oleh git
- ⚠️ Jangan share credentials di chat/email yang tidak aman
- ⚠️ Untuk production, setup environment variables di hosting platform (Vercel, dll)

## 📞 Support

Jika ada masalah yang tidak teratasi:
1. Cek troubleshooting section di atas
2. Cek logs di terminal server dan browser console
3. Hubungi tim API untuk verifikasi credentials
4. Hubungi tim development untuk bantuan teknis

## 📚 Referensi

- [ENV_SETUP.md](./ENV_SETUP.md) - Setup environment variables umum
- [LoanProspectExternal-API.postman_collection.json](./LoanProspectExternal-API.postman_collection.json) - Dokumentasi API dari tim


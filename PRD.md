# **PRODUCT REQUIREMENTS DOCUMENT (PRD)**

| Project Metadata | Detail |
| :---- | :---- |
| **Project Name** | E-Form Digital Page Lending (Web Self-Service Channel) |
| **Product Owner** | Solution Architect Team |
| **Phase** | Proof of Concept (POC) \- High Fidelity Prototype |
| **Version** | 2.1 (Final \- Brand Assets Aligned) |
| **Date** | 31 Desember 2025 |
| **Status** | **APPROVED FOR DEVELOPMENT** |

## **1\. Executive Summary**

Pengembangan aplikasi web berbasis E-Form sebagai kanal akuisisi prospek kredit (*Lead Generation*) Bank Jakarta. Aplikasi ini dirancang sebagai *entry point* satelit yang memungkinkan calon nasabah melakukan simulasi, validasi identitas, dan pengajuan minat secara mandiri (*self-service*) tanpa harus login ke aplikasi Mobile Banking utama. Desain antarmuka mengacu pada standar visual Bank Jakarta yang modern, bersih, dan profesional.

## **2\. Business Objectives**

1. **Speed to Market:** Menyediakan antarmuka pengajuan kredit cepat untuk kebutuhan POC dalam waktu \< 2 minggu.  
2. **Qualified Leads:** Meningkatkan kualitas data prospek dengan mekanisme validasi nomor HP (OTP) sebelum data masuk ke tim sales.  
3. **Brand Consistency:** Mengadopsi identitas visual Bank Jakarta ("Membangun Masa Depan") untuk membangun kepercayaan nasabah.  
4. **Compliance:** Memastikan persetujuan nasabah (Consent) tertangkap secara digital sesuai regulasi.

## **3\. Tech Stack Recommendation**

* **Frontend Framework:** Next.js 14 (App Router) \+ React.  
* **UI Library:** Shadcn/UI (Radix Primitives) untuk komponen Enterprise.  
* **Styling:** Tailwind CSS.  
* **State Management:** Zustand (Global State & Persistence).  
* **Data Fetching:** TanStack Query (React Query).  
* **Form Engine:** React Hook Form \+ Zod Validator.

---

## **4\. Design System & UI Guidelines (Updated)**

Berdasarkan aset visual Bank Jakarta yang dilampirkan, berikut adalah panduan *styling* yang wajib diterapkan:

### **A. Brand Identity**

* **Logo:** Gunakan logo Bank Jakarta (Icon Api \+ Teks) pada Header sisi kiri.  
* **Tagline:** Gunakan frasa "Membangun Masa Depan" pada bagian Hero atau Footer.

### **B. Color Palette**

Mengacu pada logo dan tampilan website eksisting:

* **Primary Brand (Jakarta Orange):** \#D94E27 (Estimasi dari warna logo Api). Digunakan untuk:  
  * Tombol Utama (CTA).  
  * Highlight Text / Link aktif.  
  * Border aktif pada input form.  
* **Primary Text (Deep Black):** \#000000 atau \#1A1A1A. Digunakan untuk Judul "Bank Jakarta" dan Heading utama.  
* **Surface/Background:**  
  * **Page Background:** \#FFFFFF (Putih bersih) sesuai style website eksisting.  
  * **Section Background (Alt):** \#FFF5F2 (Very light orange/pink tint) untuk membedakan section Hero atau Footer, mirip dengan nuansa footer website asli.  
* **Functional Colors:**  
  * Success: \#16A34A (Green).  
  * Error: \#DC2626 (Red).

### **C. Typography & Layout**

* **Font Family:** Gunakan **Inter** atau **Plus Jakarta Sans** (Google Fonts). Karakter font harus tegas, modern, dan geometris menyerupai font logo.  
* **Header Style:** Minimalis. Logo di kiri, Menu (Syariah, Digital Banking, Produk) di kanan (opsional untuk POC, bisa disederhanakan).  
* **Footer Style:** Background warna lembut/putih dengan informasi "Terdaftar dan diawasi oleh OJK".

---

## **5\. User Flow & Functional Requirements**

### **Flow 1: Landing Page (Hero & Product Discovery)**

Halaman depan harus mencerminkan nuansa "Digital Banking" yang bersih.

* **Hero Section:**  
  * **Background:** Putih bersih atau gradasi sangat halus.  
  * **Headline:** "Wujudkan Rencana, Membangun Masa Depan."  
  * **Sub-headline:** "Ajukan pinjaman mudah dan cepat melalui E-Form Bank Jakarta."  
  * **Visual:** Gunakan ilustrasi profesional (orang memegang gadget/laptop) yang senada dengan *imagery* website eksisting.  
* **Credit Simulator Section:**  
  * Section interaktif untuk simulasi kredit sebelum melihat produk.  
  * User dapat memilih produk, input jumlah pinjaman dan tenor, lalu melihat estimasi cicilan secara real-time.  
  * Menampilkan breakdown cicilan, total bunga, dan total pembayaran.  
  * Layout user-friendly dengan visual feedback yang jelas.  
* **Product Grid:**  
  * Menampilkan Card Produk (KPR, KMG, Mikro).  
  * Setiap Card memiliki aksen border atas berwarna Orange \#D94E27.  
  * Setiap Card memiliki button "Coba Simulasi" yang membuka modal simulator untuk quick preview.

### **Flow 2: Lead Capture & Verification (The Hook)**

Memastikan nomor HP valid sebelum user mengisi form panjang.

* **Step A: Input Data Diri**  
  * Field: Nama Lengkap, Email, Nomor WhatsApp.  
  * **UX:** Input field dengan style rounded-md dan focus ring warna Orange.  
* **Step B: OTP Simulation**  
  * **Trigger:** User klik "Lanjut".  
  * **Action:** Simulasi loading 1.5 detik.  
  * **Feedback:** Toast Notification *"DEMO CODE: 8888"*.  
  * **Input:** Komponen InputOTP (4 digit).  
  * **Logic:** Jika input 8888, lanjut ke step berikutnya.

### **Flow 3: Pre-Screening (Filtering)**

Formulir dinamis sesuai produk yang dipilih.

* **Fields (Wajib Masking Visual):**  
  1. **NIK:** 16 Digit.  
  2. **Penghasilan:** Format Rupiah (Rp 10.000.000).  
  3. **Tenor:** Dropdown (Bulan/Tahun sesuai config produk).  
* **Logic:** Validasi Gaji Minimum sesuai Produk.

### **Flow 4: Submission & Legal**

* **Legal Consent:**  
  * Checkbox wajib centang: *"Saya menyetujui data saya diproses oleh Bank Jakarta dan telah membaca Syarat Ketentuan."*  
* **Feedback UI:**  
  * **Success:** Redirect ke "Thank You Page".  
  * **Duplicate:** Alert "Data dengan NIK ini sudah terdaftar".

---

## **6\. Technical Specifications (API Mock Contract)**

### **A. Endpoint: Get Products (GET /api/mock/products)**

Response JSON:

JSON

```
{
  "data": [
    {
      "id": "PROD-KPR",
      "name": "KPR Griya Jakarta",
      "rate": "4.5% eff.p.a",
      "description": "Solusi hunian impian keluarga.",
      "constraints": { "tenor_type": "YEAR", "min_income": 8000000 }
    },
    {
      "id": "PROD-KTA",
      "name": "Kredit Multiguna",
      "rate": "0.8% flat/bln",
      "description": "Dana tunai untuk segala kebutuhan.",
      "constraints": { "tenor_type": "MONTH", "min_income": 3000000 }
    }
  ]
}
```

### **B. Endpoint: OTP Services (POST /api/mock/otp/...)**

* **Request:** { phone: "0812..." } \-\> Response: { demo\_code: "8888" }  
* **Verify:** { code: "8888" } \-\> Response: 200 OK.

### **C. Endpoint: Submit Lead (POST /api/mock/leads)**

* Payload: Profile \+ Screening Data.  
* Response: 200 OK (Success) atau 409 Conflict (Duplicate).

### **D. Credit Simulator Feature**

* **Placement Strategy (Hybrid Approach):**
  * **Quick Simulator Modal:** Button "Coba Simulasi" di setiap ProductCard yang membuka modal dengan simulator sederhana untuk quick preview.
  * **Dedicated Simulator Section:** Section lengkap di landing page sebelum ProductGrid untuk detailed exploration.

* **Calculation Logic:**
  * **KPR (Effective Rate - Annuity):**
    * Formula: `PMT = P × [r(1+r)^n] / [(1+r)^n - 1]`
    * r = effective rate per bulan (4.5% p.a / 12)
    * n = tenor dalam bulan (tenor tahun × 12)
  * **KMG (Flat Rate):**
    * Formula: `Monthly Payment = (Principal / Tenor) + (Principal × Flat Rate)`
    * Flat Rate = 0.8% per bulan
  * **Mikro (Flat Rate):**
    * Formula: `Monthly Payment = (Principal / Tenor) + (Principal × Flat Rate)`
    * Flat Rate = 0.5% per bulan

* **Features:**
  * Real-time calculation dengan debouncing (300ms)
  * Input validation (min/max amounts, tenor validation)
  * Visual breakdown untuk 12 bulan pertama
  * Responsive design untuk mobile dan desktop
  * Smooth animations dengan framer-motion

* **Product Data Enhancement:**
  * Setiap produk memiliki `calculation` object dengan:
    * `type`: "EFFECTIVE" atau "FLAT"
    * `rate`: Annual rate untuk EFFECTIVE, monthly rate untuk FLAT
    * `min_amount`: Minimum loan amount
    * `max_amount`: Maximum loan amount

---

## **7\. Development Roadmap & Deployment Strategy**

### **Phase 1: Setup & Styling (Hari 1-2)**

* Init Project Next.js.  
* **Theme Config:** Setup tailwind.config.ts dengan warna *primary* \#D94E27.  
* Download & Setup Font *Inter/Plus Jakarta Sans*.  
* Setup Layout (Header dengan Logo & Footer Sederhana).

### **Phase 2: Core Components (Hari 3-5)**

* Build HeroSection (Responsive).  
* Build StepWizard (Form Multi-step).  
* Implementasi InputOTP dan MoneyInput.

### **Phase 3: Logic & Integration (Hari 6-8)**

* Wiring Mock API.  
* Implementasi Zustand Store (useFormStore) dengan *Persistence*.  
* Handling Error & Validation (Zod).

### **Phase 4: Final Polish & Deployment (Hari 9-10)**

* **Deployment:** Deploy ke Vercel (Preview Mode).  
* **Demo Preparation:** Pastikan QR Code generate link Vercel agar stakeholder bisa scan dan coba di HP.

### **Phase 5: Credit Simulator Feature (Enhancement)**

* **Core Calculation Engine:**
  * Implement calculation functions untuk KPR (effective rate), KMG dan Mikro (flat rate).
  * Add input validation dan error handling.

* **Simulator Components:**
  * Build CreditSimulator component dengan real-time calculation.
  * Build SimulatorInput dan SimulatorResult components.
  * Add debouncing untuk performance optimization.

* **Modal Integration:**
  * Create SimulatorModal untuk quick preview dari ProductCard.
  * Update ProductCard dengan button "Coba Simulasi".

* **Landing Page Section:**
  * Create SimulatorSection untuk full-featured simulator.
  * Integrate dengan landing page layout.

* **Product Data Update:**
  * Add calculation parameters ke Product type.
  * Update mock product data dengan calculation config.

### **Phase 5: Credit Simulator Feature (Enhancement)**

* **Core Calculation Engine:**
  * Implement calculation functions untuk KPR (effective rate), KMG dan Mikro (flat rate).
  * Add input validation dan error handling.

* **Simulator Components:**
  * Build CreditSimulator component dengan real-time calculation.
  * Build SimulatorInput dan SimulatorResult components.
  * Add debouncing untuk performance optimization.

* **Modal Integration:**
  * Create SimulatorModal untuk quick preview dari ProductCard.
  * Update ProductCard dengan button "Coba Simulasi".

* **Landing Page Section:**
  * Create SimulatorSection untuk full-featured simulator.
  * Integrate dengan landing page layout.

* **Product Data Update:**
  * Add calculation parameters ke Product type.
  * Update mock product data dengan calculation config.
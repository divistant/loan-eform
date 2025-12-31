# **TECHNICAL BLUEPRINT (TRD LITE)**

**Project:** Bank Jakarta E-Form POC **Reference:** PRD v2.1 (Brand Aligned) **Context:** Context provider for AI Coding Assistant

## **1\. Project Architecture & Standards**

### **Tech Stack**

* **Framework:** Next.js 14 (App Router)  
* **Language:** TypeScript (Strict Mode)  
* **Styling:** Tailwind CSS \+ Shadcn/UI  
* **Design Tokens:** Bank Jakarta Brand Colors (Orange/Black)  
* **Animation:** Framer Motion (untuk Hero & Step transitions)  
* **Icons:** Lucide React  
* **State:** Zustand (Global Persisted) \+ React Hook Form  
* **Validation:** Zod  
* **Data Fetching:** TanStack Query v5

### **Coding Conventions**

1. **Design System:** Gunakan variabel CSS / Tailwind config untuk warna `primary` agar konsisten dengan branding Bank Jakarta.  
2. **Components:** Pisahkan *Domain Components* (`features/`) dan *UI Primitives* (`ui/`).  
3. **Client Boundaries:** Gunakan `'use client'` se-spesifik mungkin (di level komponen interaktif, bukan di page wrapper jika tidak perlu).  
4. **Mocking:** Semua logic backend disimulasikan di `app/api/mock/...`.

---

## **2\. Directory Structure**

Plaintext

```
/
├── app/
│   ├── layout.tsx                  # Root Layout (Fonts: Plus Jakarta Sans/Inter)
│   ├── page.tsx                    # Landing Page (Hero + Product List)
│   ├── apply/
│   │   └── [productId]/
│   │       └── page.tsx            # Multi-step Form Wizard (Main Container)
│   └── api/
│       └── mock/
│           ├── products/
│           │   └── route.ts        # Mock GET Products
│           ├── otp/                # NEW: OTP Mocking
│           │   ├── request/
│           │       └── route.ts
│           │   └── verify/
│           │       └── route.ts
│           └── leads/
│               └── route.ts        # Mock POST Leads
├── components/
│   ├── ui/                         # Shadcn: input-otp, button, card, form, etc.
│   ├── landing/                    # NEW: Landing Page Components
│   │   ├── HeroSection.tsx         # "Membangun Masa Depan" Banner
│   │   ├── ProductGrid.tsx
│   │   └── FeatureHighlights.tsx
│   └── features/
│       ├── product/
│       │   └── ProductCard.tsx
│       └── form/
│           ├── FormLayout.tsx      # Wizard Wrapper (Stepper UI)
│           ├── steps/
│           │   ├── StepIdentity.tsx # Input Nama/WA
│           │   ├── StepOtp.tsx      # Input OTP (4 Digit)
│           │   ├── StepScreening.tsx
│           │   └── StepConsent.tsx
├── lib/
│   ├── store/
│   │   └── useFormStore.ts         # Zustand Store (Updated with OTP state)
│   ├── validators/
│   │   └── form-schema.ts          # Zod Schemas
│   └── utils.ts
├── types/
│   └── domain.ts
└── tailwind.config.ts              # Custom Brand Colors defined here
```

---

## **3\. Data Models & State Management**

### **A. Domain Types (`types/domain.ts`)**

TypeScript

```
export interface Product {
  id: string;
  name: string;
  rate: string;
  description: string;
  constraints: {
    min_income: number;
    tenor_type: 'MONTH' | 'YEAR';
    tenor_options: number[]; // e.g., [12, 24, 36] or [5, 10, 15]
  };
}

// State Aplikasi
export interface ApplicationState {
  // Selection
  selectedProduct: Product | null;
  
  // Verification Status
  verification: {
    isVerified: boolean;
    phoneNumber: string | null;
    otpStatus: 'IDLE' | 'SENDING' | 'SENT' | 'VERIFIED';
  };

  // Form Draft
  draft: {
    personal: {
      fullName: string;
      email: string;
    };
    screening: {
      nik: string;
      monthlyIncome: number;
      requestedTenor: number;
    };
    consent: boolean;
  };
}
```

### **B. Zustand Store (`lib/store/useFormStore.ts`)**

Store ini menangani *Business Logic* di sisi frontend.

TypeScript

```
interface FormStore extends ApplicationState {
  // Actions
  setProduct: (p: Product) => void;
  requestOtp: (phone: string) => Promise<void>; // Call API -> Set status 'SENT'
  verifyOtp: (code: string) => Promise<boolean>; // Call API -> Set status 'VERIFIED'
  updateDraft: (section: keyof ApplicationState['draft'], data: any) => void;
  reset: () => void;
}
// Note: Gunakan middleware 'persist' untuk menyimpan draft saat refresh.
```

---

## **4\. Brand Styling & Tailwind Config**

Agar AI memahami instruksi "Gunakan warna Bank Jakarta", definisikan ini di `tailwind.config.ts`.

TypeScript

```
// tailwind.config.ts snippet
theme: {
  extend: {
    colors: {
      brand: {
        50: '#FFF5F2',  // Background Tint (Very light orange)
        100: '#FFE0D6',
        500: '#D94E27', // PRIMARY: Bank Jakarta Orange (from Logo)
        600: '#B83D1B', // Hover State
        900: '#0F172A', // Text Primary (Slate 900)
      }
    },
    fontFamily: {
      sans: ["var(--font-inter)", ...fontFamily.sans],
    }
  }
}
```

---

## **5\. Mock API Logic**

### **`POST /api/mock/otp/request`**

* **Logic:** Simulasi delay 1.5 detik.  
* **Response:** `{ status: "success", demo_code: "8888", message: "OTP sent to WhatsApp" }`.

### **`POST /api/mock/otp/verify`**

* **Logic:** Cek body `{ code }`.  
* **Response:**  
  * If `code === "8888"`: Return 200 `{ status: "valid" }`.  
  * Else: Return 400 `{ message: "Kode OTP salah" }`.

### **`GET /api/mock/products`**

* **Data:** Return JSON hardcoded (KPR & KTA) sesuai PRD.  
* **Constraints:** Pastikan `tenor_options` berbeda antara KPR (Tahun) dan KTA (Bulan).

---

## **6\. Implementation Notes for AI Coder**

1. **Hero Section:** Buat komponen `HeroSection` menggunakan `framer-motion` untuk animasi teks masuk yang halus ("Membangun Masa Depan"). Background gunakan warna putih bersih atau gradient sangat halus dari `brand-50`.  
2. **OTP Component:** Gunakan komponen `InputOTP` dari Shadcn. Saat user klik "Kirim OTP", trigger `toast` (Sonner) yang menampilkan kode "8888".  
3. **Input Masking:**  
   * **NIK:** Gunakan `react-number-format` format `#### #### #### ####`.  
   * **Rupiah:** Format `Rp #.###.###` prefix Rp.  
4. **Navigation Guard:** User tidak boleh akses Step Screening jika `verification.isVerified` masih `false`.


"use client";

import { useEffect, useState } from "react";
import { useFormStore } from "@/lib/store/useFormStore";
import { FormLayout } from "./FormLayout";
import { StepIdentity } from "./steps/StepIdentity";
import { StepOtp } from "./steps/StepOtp";
import { StepScreening } from "./steps/StepScreening";
import { StepConsent } from "./steps/StepConsent";
import type { Product } from "@/types/domain";
import { Loader2 } from "lucide-react";

type FormWizardProps = {
  product: Product;
};

export function FormWizard({ product }: FormWizardProps) {
  const { currentStep, setProduct, verification, selectedProduct } = useFormStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Set product to store on mount
  useEffect(() => {
    setProduct(product);
    setIsHydrated(true);
  }, [product, setProduct]);

  if (!isHydrated || !selectedProduct) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepIdentity />;
      case 1:
        return <StepOtp />;
      case 2:
        if (!verification.isVerified) {
          return (
            <div className="text-center py-10">
              <p className="text-red-500 mb-4">Anda belum melakukan verifikasi.</p>
              <button 
                onClick={() => useFormStore.getState().setStep(1)}
                className="text-brand-500 underline hover:text-brand-600"
              >
                Kembali ke Verifikasi
              </button>
            </div>
          );
        }
        return <StepScreening />;
      case 3:
        if (!verification.isVerified) return null;
        return <StepConsent />;
      default:
        return <StepIdentity />;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 0: return "Informasi Pribadi";
      case 1: return "Verifikasi Nomor HP";
      case 2: return "Data Pengajuan";
      case 3: return "Persetujuan";
      default: return "";
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 0: return "Masukkan nama lengkap sesuai KTP, email aktif, dan nomor WhatsApp yang bisa dihubungi.";
      case 1: return "Kami mengirim kode OTP ke WhatsApp Anda untuk memastikan keamanan data.";
      case 2: return "Isi NIK, penghasilan bulanan, dan tenor yang Anda inginkan.";
      case 3: return "Baca syarat & ketentuan, lalu berikan persetujuan untuk memproses pengajuan Anda.";
      default: return "";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Compact Product Context Card - Fixed Styling */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <p className="text-xs text-orange-600 font-medium uppercase tracking-wider">Pengajuan Untuk</p>
          <h3 className="font-bold text-gray-900 text-lg">{selectedProduct.name}</h3>
          <p className="text-sm text-gray-600">{selectedProduct.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-brand-500 bg-white px-3 py-1 rounded-full border border-orange-100 shadow-sm">
            {selectedProduct.rate}
          </p>
        </div>
      </div>

      <FormLayout
        currentStep={currentStep}
        title={getStepTitle(currentStep)}
        description={getStepDescription(currentStep)}
      >
        {renderStep()}
      </FormLayout>
    </div>
  );
}

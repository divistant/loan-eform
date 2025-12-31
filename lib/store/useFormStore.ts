import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product, ApplicationState, ApplicationDraft } from "@/types/domain";

type State = ApplicationState & {
  currentStep: number;
};

type Actions = {
  setProduct: (product: Product) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateDraft: <K extends keyof ApplicationDraft>(
    section: K,
    data: Partial<ApplicationDraft[K]>
  ) => void;
  setVerificationStatus: (
    status: ApplicationState["verification"]["otpStatus"],
    phoneNumber?: string
  ) => void;
  setVerified: (isVerified: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  selectedProduct: null,
  currentStep: 0,
  verification: {
    isVerified: false,
    phoneNumber: null,
    otpStatus: "IDLE",
  },
  draft: {
    personal: {
      fullName: "",
      email: "",
    },
    screening: {
      nik: "",
      monthlyIncome: 0,
      requestedTenor: 0,
    },
    consent: false,
  },
};

export const useFormStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,

      setProduct: (product) => set({ selectedProduct: product }),
      
      setStep: (step) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      
      prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
      
      updateDraft: (section, data) =>
        set((state) => {
          if (section === 'consent') {
            return {
              draft: {
                ...state.draft,
                consent: data as unknown as boolean,
              },
            };
          }
          return {
            draft: {
              ...state.draft,
              [section]: { ...(state.draft[section] as object), ...data },
            },
          };
        }),

      setVerificationStatus: (status, phoneNumber) =>
        set((state) => ({
          verification: {
            ...state.verification,
            otpStatus: status,
            ...(phoneNumber ? { phoneNumber } : {}),
          },
        })),

      setVerified: (isVerified) =>
        set((state) => ({
          verification: {
            ...state.verification,
            isVerified,
            otpStatus: isVerified ? "VERIFIED" : state.verification.otpStatus,
          },
        })),

      reset: () => set(initialState),
    }),
    {
      name: "bank-jakarta-form-storage",
      storage: createJSONStorage(() => sessionStorage), // Use session storage for security
      partialize: (state) => ({
        selectedProduct: state.selectedProduct,
        draft: state.draft,
        verification: state.verification,
        currentStep: state.currentStep,
      }),
    }
  )
);

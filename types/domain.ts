export type Product = {
  id: string;
  name: string;
  rate: string;
  description: string;
  constraints: {
    min_income: number;
    tenor_type: 'MONTH' | 'YEAR';
    tenor_options: Array<number>;
  };
};

export type VerificationStatus = {
  isVerified: boolean;
  phoneNumber: string | null;
  otpStatus: 'IDLE' | 'SENDING' | 'SENT' | 'VERIFIED';
};

export type ApplicationDraft = {
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

export type ApplicationState = {
  selectedProduct: Product | null;
  verification: VerificationStatus;
  draft: ApplicationDraft;
};

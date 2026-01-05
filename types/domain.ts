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
  calculation?: {
    type: 'EFFECTIVE' | 'FLAT';
    rate: number; // Annual rate untuk EFFECTIVE, monthly rate untuk FLAT
    min_amount: number;
    max_amount: number;
  };
  simulatorConfig?: {
    fields: {
      required: Array<'loanAmount' | 'tenor'>;
      kpr?: Array<'purpose' | 'collateralType' | 'downPayment' | 'housePrice'>;
      kmg?: Array<'loanPurpose'>;
      mikro?: Array<'businessType'>;
    };
    options?: {
      purpose?: Array<{ value: string; label: string }>;
      collateralType?: Array<{ value: string; label: string }>;
      downPayment?: Array<{ value: number; label: string }>;
      loanPurpose?: Array<{ value: string; label: string }>;
      businessType?: Array<{ value: string; label: string }>;
    };
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
    birthdate: string;
    address: string;
  };
  screening: {
    nik: string;
    monthlyIncome: number;
    requestedTenor: number;
    occupation: string;
    workDuration: number;
    loanAmount: number;
  };
  consent: boolean;
};

export type ApplicationState = {
  selectedProduct: Product | null;
  verification: VerificationStatus;
  draft: ApplicationDraft;
};

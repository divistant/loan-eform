export type SimulatorInput = {
  productId: string;
  loanAmount: number;
  tenor: number;
  // KPR specific fields
  purpose?: string; // Tujuan penggunaan
  collateralType?: string; // Jenis agunan
  downPayment?: number; // Uang muka (percentage)
  housePrice?: number; // Harga rumah
  // KMG specific fields
  loanPurpose?: string; // Tujuan pinjaman
  // Mikro specific fields
  businessType?: string; // Jenis usaha
};

export type SimulatorResult = {
  monthlyInstallment: number;
  totalInterest: number;
  totalPayment: number;
  effectiveRate: number;
  maxLoanAmount?: number; // Maksimal limit kredit (untuk KPR dengan DP)
  downPaymentAmount?: number; // Jumlah uang muka (untuk KPR)
  breakdown?: {
    month: number;
    principal: number;
    interest: number;
    remaining: number;
  }[];
};


import type { SimulatorInput, SimulatorResult } from "@/types/simulator";
import type { Product } from "@/types/domain";

/**
 * Calculate KPR (Effective Rate - Annuity)
 * Formula: PMT = P × [r(1+r)^n] / [(1+r)^n - 1]
 * r = effective rate per bulan (annual rate / 12 / 100)
 * n = tenor dalam bulan
 */
function calculateKPR(
  loanAmount: number,
  tenor: number,
  annualRate: number,
  housePrice?: number,
  downPaymentPercent?: number
): SimulatorResult {
  const monthlyRate = annualRate / 12 / 100;
  const tenorInMonths = tenor * 12; // KPR tenor dalam tahun, convert ke bulan

  // Calculate down payment amount if provided
  let downPaymentAmount = 0;
  let maxLoanAmount = loanAmount;

  if (housePrice && downPaymentPercent !== undefined) {
    downPaymentAmount = housePrice * (downPaymentPercent / 100);
    maxLoanAmount = housePrice - downPaymentAmount;
    
    // Use maxLoanAmount if loanAmount exceeds it
    if (loanAmount > maxLoanAmount) {
      // This should be validated before calculation
    }
  }

  // Calculate monthly payment using annuity formula
  const monthlyPayment =
    loanAmount *
    ((monthlyRate * Math.pow(1 + monthlyRate, tenorInMonths)) /
      (Math.pow(1 + monthlyRate, tenorInMonths) - 1));

  const totalPayment = monthlyPayment * tenorInMonths;
  const totalInterest = totalPayment - loanAmount;

  // Generate breakdown (first 12 months for preview)
  const breakdown = [];
  let remaining = loanAmount;

  for (let month = 1; month <= Math.min(12, tenorInMonths); month++) {
    const interest = remaining * monthlyRate;
    const principal = monthlyPayment - interest;
    remaining = remaining - principal;

    breakdown.push({
      month,
      principal: Math.round(principal),
      interest: Math.round(interest),
      remaining: Math.max(0, Math.round(remaining)),
    });
  }

  const result: SimulatorResult = {
    monthlyInstallment: Math.round(monthlyPayment),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    effectiveRate: annualRate,
    breakdown,
  };

  // Add KPR-specific fields if available
  if (housePrice && downPaymentPercent !== undefined) {
    result.maxLoanAmount = Math.round(maxLoanAmount);
    result.downPaymentAmount = Math.round(downPaymentAmount);
  }

  return result;
}

/**
 * Calculate KMG or Mikro (Flat Rate)
 * Formula: Monthly Payment = (Principal / Tenor) + (Principal × Flat Rate)
 */
function calculateFlatRate(
  loanAmount: number,
  tenor: number,
  monthlyRate: number
): SimulatorResult {
  const monthlyInterest = loanAmount * (monthlyRate / 100);
  const monthlyPrincipal = loanAmount / tenor;
  const monthlyPayment = monthlyPrincipal + monthlyInterest;

  const totalPayment = monthlyPayment * tenor;
  const totalInterest = monthlyInterest * tenor;

  // Generate breakdown (first 12 months for preview)
  const breakdown = [];
  let remaining = loanAmount;

  for (let month = 1; month <= Math.min(12, tenor); month++) {
    const interest = monthlyInterest;
    const principal = monthlyPrincipal;
    remaining = remaining - principal;

    breakdown.push({
      month,
      principal: Math.round(principal),
      interest: Math.round(interest),
      remaining: Math.max(0, Math.round(remaining)),
    });
  }

  // Calculate effective rate (approximation)
  const effectiveRate = (totalInterest / loanAmount / tenor) * 12 * 100;

  return {
    monthlyInstallment: Math.round(monthlyPayment),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    effectiveRate: Math.round(effectiveRate * 100) / 100,
    breakdown,
  };
}

/**
 * Main calculation function
 */
export function calculateCredit(
  input: SimulatorInput,
  product: Product
): SimulatorResult | null {
  const { loanAmount, tenor, housePrice, downPayment } = input;

  // Validation
  if (loanAmount <= 0 || tenor <= 0) {
    return null;
  }

  // Check if tenor is valid for product
  if (!product.constraints.tenor_options.includes(tenor)) {
    return null;
  }

  // Get calculation parameters from product
  const calculation = product.calculation;

  if (!calculation) {
    return null;
  }

  // Calculate based on calculation type
  if (calculation.type === "EFFECTIVE") {
    // KPR: Effective rate (annuity) with optional DP
    return calculateKPR(
      loanAmount,
      tenor,
      calculation.rate,
      housePrice,
      downPayment
    );
  } else if (calculation.type === "FLAT") {
    // KMG or Mikro: Flat rate
    return calculateFlatRate(loanAmount, tenor, calculation.rate);
  }

  return null;
}

/**
 * Validate simulator input
 */
export function validateSimulatorInput(
  input: SimulatorInput,
  product: Product
): { valid: boolean; error?: string } {
  const { loanAmount, tenor, housePrice, downPayment } = input;

  if (!product.calculation) {
    return { valid: false, error: "Produk tidak memiliki konfigurasi kalkulasi" };
  }

  // Validate loan amount
  if (loanAmount < product.calculation.min_amount) {
    return {
      valid: false,
      error: `Jumlah pinjaman minimal ${formatRupiah(product.calculation.min_amount)}`,
    };
  }

  // For KPR with DP: validate against maxLoanAmount
  if (product.id === "PROD-KPR" && housePrice && downPayment !== undefined) {
    const downPaymentAmount = housePrice * (downPayment / 100);
    const maxLoanAmount = housePrice - downPaymentAmount;
    
    if (loanAmount > maxLoanAmount) {
      return {
        valid: false,
        error: `Jumlah pinjaman maksimal ${formatRupiah(Math.round(maxLoanAmount))} berdasarkan harga rumah dan uang muka`,
      };
    }
    
    if (loanAmount > product.calculation.max_amount) {
      return {
        valid: false,
        error: `Jumlah pinjaman maksimal ${formatRupiah(product.calculation.max_amount)}`,
      };
    }
  } else if (loanAmount > product.calculation.max_amount) {
    return {
      valid: false,
      error: `Jumlah pinjaman maksimal ${formatRupiah(product.calculation.max_amount)}`,
    };
  }

  // Validate tenor
  if (!product.constraints.tenor_options.includes(tenor)) {
    return {
      valid: false,
      error: `Tenor harus salah satu dari: ${product.constraints.tenor_options.join(", ")} ${
        product.constraints.tenor_type === "YEAR" ? "tahun" : "bulan"
      }`,
    };
  }

  // Validate KPR-specific fields
  // Note: purpose dan collateralType optional untuk calculation
  // Hanya housePrice dan downPayment required untuk auto-calculate loanAmount
  if (product.id === "PROD-KPR") {
    const config = product.simulatorConfig;
    if (config?.fields.kpr) {
      // housePrice dan downPayment required untuk calculation
      if (config.fields.kpr.includes("housePrice") && (!housePrice || housePrice <= 0)) {
        return {
          valid: false,
          error: "Harga rumah harus diisi",
        };
      }
      if (config.fields.kpr.includes("downPayment") && downPayment === undefined) {
        return {
          valid: false,
          error: "Uang muka harus dipilih",
        };
      }
      // purpose dan collateralType optional - tidak block calculation
      // Removed strict validation for purpose and collateralType
    }
  }

  // Validate KMG-specific fields
  if (product.id === "PROD-KMG") {
    const config = product.simulatorConfig;
    if (config?.fields.kmg?.includes("loanPurpose") && !input.loanPurpose) {
      return {
        valid: false,
        error: "Tujuan penggunaan harus dipilih",
      };
    }
  }

  // Validate Mikro-specific fields
  if (product.id === "PROD-MIKRO") {
    const config = product.simulatorConfig;
    if (config?.fields.mikro?.includes("businessType") && !input.businessType) {
      return {
        valid: false,
        error: "Jenis usaha harus dipilih",
      };
    }
  }

  return { valid: true };
}

/**
 * Format currency helper
 */
function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}


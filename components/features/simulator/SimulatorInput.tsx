"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { NumericFormat } from "react-number-format";
import type { Product } from "@/types/domain";
import type { SimulatorInput } from "@/types/simulator";
import { Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimulatorFieldTenorSlider } from "./fields/SimulatorFieldTenorSlider";
import { SimulatorFieldPurpose } from "./fields/SimulatorFieldPurpose";
import { SimulatorFieldCollateral } from "./fields/SimulatorFieldCollateral";
import { SimulatorFieldDownPayment } from "./fields/SimulatorFieldDownPayment";
import { SimulatorFieldHousePrice } from "./fields/SimulatorFieldHousePrice";
import { SimulatorFieldLoanPurpose } from "./fields/SimulatorFieldLoanPurpose";
import { SimulatorFieldBusinessType } from "./fields/SimulatorFieldBusinessType";

type SimulatorInputProps = {
  product: Product;
  value: SimulatorInput;
  onChange: (value: SimulatorInput) => void;
  onValidationChange?: (isValid: boolean) => void;
  onDisclaimerChange?: (accepted: boolean) => void;
};

export function SimulatorInput({
  product,
  value,
  onChange,
  onValidationChange,
  onDisclaimerChange,
}: SimulatorInputProps) {
  const [loanAmount, setLoanAmount] = useState(value.loanAmount || 0);
  const [tenor, setTenor] = useState(value.tenor || product.constraints.tenor_options[0]);
  const [purpose, setPurpose] = useState(value.purpose);
  const [collateralType, setCollateralType] = useState(value.collateralType);
  const [downPayment, setDownPayment] = useState(value.downPayment);
  const [housePrice, setHousePrice] = useState(value.housePrice);
  const [loanPurpose, setLoanPurpose] = useState(value.loanPurpose);
  const [businessType, setBusinessType] = useState(value.businessType);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // Sync state dengan value prop saat product berubah
  useEffect(() => {
    setLoanAmount(value.loanAmount || 0);
    setTenor(value.tenor || product.constraints.tenor_options[0]);
    setPurpose(value.purpose);
    setCollateralType(value.collateralType);
    setDownPayment(value.downPayment);
    setHousePrice(value.housePrice);
    setLoanPurpose(value.loanPurpose);
    setBusinessType(value.businessType);
  }, [product.id]); // Reset saat product berubah

  // Auto-calculate loanAmount untuk KPR dari housePrice dan downPayment
  // Only auto-calculate if user hasn't manually edited loanAmount after housePrice/downPayment change
  useEffect(() => {
    if (product.id === "PROD-KPR" && housePrice && housePrice > 0 && downPayment !== undefined && downPayment > 0) {
      const downPaymentAmount = housePrice * (downPayment / 100);
      const calculatedLoanAmount = housePrice - downPaymentAmount;
      
      // Only auto-update if calculated amount is valid and significantly different from current
      // This allows manual override while still providing auto-calculation
      if (calculatedLoanAmount > 0 && Math.abs(calculatedLoanAmount - loanAmount) > 1000) {
        setLoanAmount(Math.round(calculatedLoanAmount));
      }
    }
  }, [housePrice, downPayment, product.id]); // Exclude loanAmount from deps to avoid loop

  // Update parent when any field changes
  useEffect(() => {
    onChange({
      productId: product.id,
      loanAmount,
      tenor,
      purpose,
      collateralType,
      downPayment,
      housePrice,
      loanPurpose,
      businessType,
    });
  }, [loanAmount, tenor, purpose, collateralType, downPayment, housePrice, loanPurpose, businessType, product.id, onChange]);

  // Notify parent about disclaimer status
  useEffect(() => {
    if (onDisclaimerChange) {
      onDisclaimerChange(disclaimerAccepted);
    }
  }, [disclaimerAccepted, onDisclaimerChange]);

  // Validation logic (simplified - full validation is in credit-calculator)
  useEffect(() => {
    if (onValidationChange) {
      const isValid =
        loanAmount >= (product.calculation?.min_amount || 0) &&
        loanAmount <= (product.calculation?.max_amount || 10000000000) &&
        product.constraints.tenor_options.includes(tenor);
      onValidationChange(isValid);
    }
  }, [loanAmount, tenor, product, onValidationChange]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const minAmount = product.calculation?.min_amount || 0;
  const maxAmount = product.calculation?.max_amount || 10000000000;

  // Validation states
  const amountValidation = useMemo(() => {
    if (loanAmount === 0) return { valid: null, message: "" };
    if (loanAmount < minAmount) {
      return { 
        valid: false, 
        message: `Jumlah pinjaman minimal ${formatRupiah(minAmount)}` 
      };
    }
    if (loanAmount > maxAmount) {
      return { 
        valid: false, 
        message: `Jumlah pinjaman maksimal ${formatRupiah(maxAmount)}` 
      };
    }
    return { valid: true, message: "" };
  }, [loanAmount, minAmount, maxAmount]);

  const tenorValidation = useMemo(() => {
    const isValid = product.constraints.tenor_options.includes(tenor);
    return { valid: isValid, message: isValid ? "" : "Tenor tidak valid" };
  }, [tenor, product.constraints.tenor_options]);

  // Get dynamic fields configuration
  const config = product.simulatorConfig;
  const kprFields = config?.fields.kpr || [];
  const kmgFields = config?.fields.kmg || [];
  const mikroFields = config?.fields.mikro || [];

  // Determine which product-specific fields to show
  const isKPR = product.id === "PROD-KPR";
  const isKMG = product.id === "PROD-KMG";
  const isMikro = product.id === "PROD-MIKRO";

  return (
    <div className="space-y-6">
      {/* Dynamic Product-Specific Fields - KPR */}
      {isKPR && (
        <>
          {kprFields.includes("purpose") && (
            <SimulatorFieldPurpose
              product={product}
              value={purpose}
              onChange={setPurpose}
            />
          )}
          {kprFields.includes("collateralType") && (
            <SimulatorFieldCollateral
              product={product}
              value={collateralType}
              onChange={setCollateralType}
            />
          )}
          {kprFields.includes("housePrice") && (
            <SimulatorFieldHousePrice
              product={product}
              value={housePrice}
              onChange={setHousePrice}
            />
          )}
          {kprFields.includes("downPayment") && (
            <SimulatorFieldDownPayment
              product={product}
              value={downPayment}
              onChange={setDownPayment}
            />
          )}
        </>
      )}

      {/* Dynamic Product-Specific Fields - KMG */}
      {isKMG && (
        <>
          {kmgFields.includes("loanPurpose") && (
            <SimulatorFieldLoanPurpose
              product={product}
              value={loanPurpose}
              onChange={setLoanPurpose}
            />
          )}
        </>
      )}

      {/* Dynamic Product-Specific Fields - Mikro */}
      {isMikro && (
        <>
          {mikroFields.includes("businessType") && (
            <SimulatorFieldBusinessType
              product={product}
              value={businessType}
              onChange={setBusinessType}
            />
          )}
        </>
      )}

      {/* Common Fields: Loan Amount */}
      <div>
        <Label htmlFor="loan-amount" className="text-sm font-semibold text-gray-900 mb-2 block">
          {isKPR ? "Plafond Diajukan (Rp.)" : "Jumlah Pinjaman"}
        </Label>
        <div className="relative">
          <NumericFormat
            id="loan-amount"
            customInput={Input}
            prefix="Rp "
            thousandSeparator="."
            decimalSeparator=","
            placeholder="Rp 0"
            value={loanAmount}
            onValueChange={(values) => {
              setLoanAmount(values.floatValue || 0);
            }}
            className={cn(
              "w-full h-11 text-base",
              amountValidation.valid === false && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/30",
              amountValidation.valid === true && loanAmount > 0 && "border-green-300 focus-visible:border-green-500"
            )}
            aria-invalid={amountValidation.valid === false}
            aria-describedby={amountValidation.valid === false ? "loan-amount-error" : "loan-amount-help"}
          />
          {amountValidation.valid === true && loanAmount > 0 && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
          )}
          {amountValidation.valid === false && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
          )}
        </div>
        {amountValidation.valid === false && (
          <p id="loan-amount-error" className="mt-2 text-xs text-red-600 flex items-center gap-1.5" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {amountValidation.message}
          </p>
        )}
        {amountValidation.valid !== false && (
          <p id="loan-amount-help" className="mt-2 flex items-start gap-2 text-xs text-gray-500">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>
              Minimal {formatRupiah(minAmount)} - Maksimal {formatRupiah(maxAmount)}
            </span>
          </p>
        )}
      </div>

      {/* Common Fields: Tenor with Slider */}
      <SimulatorFieldTenorSlider
        product={product}
        value={tenor}
        onChange={setTenor}
        validationMessage={!tenorValidation.valid ? tenorValidation.message : undefined}
      />

      {/* Disclaimer Checkbox */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-start gap-3">
          <Checkbox
            id="disclaimer"
            checked={disclaimerAccepted}
            onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
            className="mt-0.5"
          />
          <Label
            htmlFor="disclaimer"
            className="text-sm text-gray-700 leading-relaxed cursor-pointer"
          >
            Saya memahami bahwa hasil simulasi ini merupakan estimasi, hasil akhir sebenarnya dapat berbeda.
          </Label>
        </div>
        {!disclaimerAccepted && (
          <p className="mt-2 text-xs text-amber-600 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Harap centang kotak di atas untuk melanjutkan
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import type { Product } from "@/types/domain";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type SimulatorFieldHousePriceProps = {
  product: Product;
  value?: number;
  onChange: (value: number) => void;
  validationMessage?: string;
};

export function SimulatorFieldHousePrice({
  product,
  value,
  onChange,
  validationMessage,
}: SimulatorFieldHousePriceProps) {
  const [housePrice, setHousePrice] = useState(value || 0);
  
  // Sync with value prop
  useEffect(() => {
    if (value !== undefined) {
      setHousePrice(value);
    }
  }, [value]);

  const hasError = validationMessage && validationMessage.includes("housePrice");
  const isValid = housePrice > 0 && !hasError;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleChange = (values: { floatValue?: number }) => {
    const newValue = values.floatValue || 0;
    setHousePrice(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="house-price" className="text-sm font-semibold text-gray-900 mb-2 block">
        Harga Rumah
      </Label>
      <div className="relative">
        <NumericFormat
          id="house-price"
          customInput={Input}
          prefix="Rp "
          thousandSeparator="."
          decimalSeparator=","
          placeholder="Rp 0"
          value={housePrice}
          onValueChange={handleChange}
          className={cn(
            "w-full h-11 text-base pr-10",
            hasError && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/30",
            isValid && "border-green-300 focus-visible:border-green-500"
          )}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={hasError ? "house-price-error" : "house-price-help"}
        />
        {isValid && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
        )}
        {hasError && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
        )}
      </div>
      {hasError ? (
        <p id="house-price-error" className="text-xs text-red-600 flex items-center gap-1.5" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {validationMessage}
        </p>
      ) : (
        <p id="house-price-help" className="text-xs text-gray-500 flex items-start gap-2">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Masukkan harga rumah yang akan dibeli</span>
        </p>
      )}
    </div>
  );
}


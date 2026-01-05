"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import type { Product } from "@/types/domain";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

type SimulatorFieldTenorSliderProps = {
  product: Product;
  value: number;
  onChange: (value: number) => void;
  validationMessage?: string;
};

export function SimulatorFieldTenorSlider({
  product,
  value,
  onChange,
  validationMessage,
}: SimulatorFieldTenorSliderProps) {
  const [sliderValue, setSliderValue] = useState(value);
  const [inputValue, setInputValue] = useState(String(value));

  const tenorOptions = product.constraints.tenor_options;
  const minTenor = Math.min(...tenorOptions);
  const maxTenor = Math.max(...tenorOptions);
  const isYear = product.constraints.tenor_type === "YEAR";

  // Sync slider and input when value prop changes
  useEffect(() => {
    setSliderValue(value);
    setInputValue(String(value));
  }, [value]);

  // Find closest valid tenor option
  const findClosestTenor = (val: number): number => {
    return tenorOptions.reduce((prev, curr) =>
      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
    );
  };

  const handleSliderChange = (newValue: number[]) => {
    const selectedValue = newValue[0];
    const closestTenor = findClosestTenor(selectedValue);
    setSliderValue(closestTenor);
    setInputValue(String(closestTenor));
    onChange(closestTenor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);

    const numValue = parseInt(inputVal, 10);
    if (!isNaN(numValue) && numValue >= minTenor && numValue <= maxTenor) {
      const closestTenor = findClosestTenor(numValue);
      setSliderValue(closestTenor);
      onChange(closestTenor);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < minTenor || numValue > maxTenor) {
      const closestTenor = findClosestTenor(sliderValue);
      setInputValue(String(closestTenor));
      setSliderValue(closestTenor);
      onChange(closestTenor);
    }
  };

  const isValid = !validationMessage || !validationMessage.includes("tenor");
  const hasError = validationMessage && validationMessage.includes("tenor");

  return (
    <div className="space-y-4">
      <Label htmlFor="tenor-slider" className="text-sm font-semibold text-gray-900 mb-2 block">
        Jangka Waktu ({isYear ? "Tahun" : "Bulan"})
      </Label>

      {/* Slider */}
      <div className="px-2">
        <Slider
          value={[sliderValue]}
          onValueChange={handleSliderChange}
          min={minTenor}
          max={maxTenor}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{minTenor} {isYear ? "thn" : "bln"}</span>
          <span className="font-semibold text-brand-600">{sliderValue} {isYear ? "tahun" : "bulan"}</span>
          <span>{maxTenor} {isYear ? "thn" : "bln"}</span>
        </div>
      </div>

      {/* Text Input */}
      <div className="relative">
        <Input
          id="tenor-slider"
          type="number"
          min={minTenor}
          max={maxTenor}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={`Pilih ${isYear ? "tahun" : "bulan"}`}
          className={cn(
            "w-full h-11 text-base",
            hasError && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/30",
            isValid && value > 0 && !hasError && "border-green-300 focus-visible:border-green-500"
          )}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={hasError ? "tenor-error" : "tenor-help"}
        />
        {isValid && value > 0 && !hasError && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
        )}
        {hasError && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
        )}
      </div>

      {/* Help Text / Error Message */}
      {hasError ? (
        <p id="tenor-error" className="text-xs text-red-600 flex items-center gap-1.5" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {validationMessage}
        </p>
      ) : (
        <p id="tenor-help" className="text-xs text-gray-500">
          Pilih tenor: {tenorOptions.join(", ")} {isYear ? "tahun" : "bulan"}
        </p>
      )}
    </div>
  );
}


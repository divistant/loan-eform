"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/types/domain";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SimulatorFieldBusinessTypeProps = {
  product: Product;
  value?: string;
  onChange: (value: string) => void;
  validationMessage?: string;
};

export function SimulatorFieldBusinessType({
  product,
  value,
  onChange,
  validationMessage,
}: SimulatorFieldBusinessTypeProps) {
  const options = product.simulatorConfig?.options?.businessType || [];
  const hasError = validationMessage && validationMessage.includes("businessType");
  const isValid = value && value.length > 0 && !hasError;

  return (
    <div className="space-y-2">
      <Label htmlFor="business-type" className="text-sm font-semibold text-gray-900 mb-2 block">
        Jenis Usaha
      </Label>
      <div className="relative">
        <Select value={value || ""} onValueChange={onChange}>
          <SelectTrigger
            id="business-type"
            className={cn(
              "w-full h-11 text-base",
              hasError && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/30",
              isValid && "border-green-300 focus-visible:border-green-500"
            )}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={hasError ? "business-type-error" : undefined}
          >
            <SelectValue placeholder="Pilih jenis usaha" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-base">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isValid && (
          <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500 pointer-events-none" />
        )}
        {hasError && (
          <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none" />
        )}
      </div>
      {hasError && (
        <p id="business-type-error" className="text-xs text-red-600 flex items-center gap-1.5" role="alert">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {validationMessage}
        </p>
      )}
    </div>
  );
}


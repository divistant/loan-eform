"use client";

import { useState, useMemo, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { motion } from "framer-motion";
import { SimulatorInput } from "./SimulatorInput";
import { SimulatorResult } from "./SimulatorResult";
import type { Product } from "@/types/domain";
import type { SimulatorInput as SimulatorInputType, SimulatorResult as SimulatorResultType } from "@/types/simulator";
import { calculateCredit, validateSimulatorInput } from "@/lib/utils/credit-calculator";

type CreditSimulatorProps = {
  product: Product;
  onApply?: (input: SimulatorInputType) => void;
  compact?: boolean;
};

export function CreditSimulator({ product, onApply, compact = false }: CreditSimulatorProps) {
  const [input, setInput] = useState<SimulatorInputType>({
    productId: product.id,
    loanAmount: product.calculation?.min_amount || 10000000,
    tenor: product.constraints.tenor_options[0],
  });

  const [isValid, setIsValid] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // Debounced calculation untuk performance
  const debouncedCalculate = useDebouncedCallback(
    (inputValue: SimulatorInputType) => {
      setIsCalculating(true);
      
      // Validate input
      const validation = validateSimulatorInput(inputValue, product);
      setIsValid(validation.valid);

      if (validation.valid) {
        // Small delay untuk smooth UX
        setTimeout(() => {
          setIsCalculating(false);
        }, 100);
      } else {
        setIsCalculating(false);
      }
    },
    300
  );

  const handleInputChange = useCallback((newInput: SimulatorInputType) => {
    setInput(newInput);
    debouncedCalculate(newInput);
  }, [debouncedCalculate]);

  // Calculate result - only if disclaimer is accepted
  const result = useMemo(() => {
    if (!isValid || isCalculating || !disclaimerAccepted) {
      return null;
    }

    const validation = validateSimulatorInput(input, product);
    if (!validation.valid) {
      return null;
    }

    return calculateCredit(input, product);
  }, [input, product, isValid, isCalculating, disclaimerAccepted]);

  if (!product.calculation) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
        <p className="text-sm font-medium text-yellow-800">
          Produk ini belum memiliki konfigurasi simulasi kredit.
        </p>
      </div>
    );
  }

  return (
    <div className={`${compact ? "space-y-6" : "grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"}`}>
      {/* Left Column: Input Form */}
      <div className={compact ? "space-y-5" : "space-y-6"}>
        <SimulatorInput
          product={product}
          value={input}
          onChange={handleInputChange}
          onValidationChange={setIsValid}
          onDisclaimerChange={setDisclaimerAccepted}
        />
        
        {onApply && result && isValid && disclaimerAccepted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-6 border-t border-gray-200"
          >
            <button
              onClick={() => onApply(input)}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Ajukan Sekarang
            </button>
          </motion.div>
        )}
      </div>

      {/* Right Column: Result Display */}
      <div className={compact ? "" : "lg:sticky lg:top-24 lg:self-start"}>
        <SimulatorResult result={result} isLoading={isCalculating} />
      </div>
    </div>
  );
}


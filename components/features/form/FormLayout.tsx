"use client";

import { Check, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { useFormStore } from "@/lib/store/useFormStore";

type Step = {
  id: number;
  title: string;
};

const steps: Array<Step> = [
  { id: 0, title: "Identitas" },
  { id: 1, title: "Verifikasi" },
  { id: 2, title: "Screening" },
  { id: 3, title: "Persetujuan" },
];

type FormLayoutProps = {
  currentStep: number;
  children: React.ReactNode;
  title: string;
  description: string;
};

export function FormLayout({
  currentStep,
  children,
  title,
  description,
}: FormLayoutProps) {
  return (
    <div className="w-full">
      {/* Modern Stepper UI */}
      <div className="mb-10 px-2">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index;
            const isCurrent = currentStep === index;
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                {/* Step Item */}
                <div className="flex flex-col items-center relative z-10">
                  {/* Circle Indicator */}
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200",
                      isCompleted
                        ? "border-green-600 bg-green-600 text-white"
                        : isCurrent
                        ? "bg-brand-500 text-white border-brand-500 shadow-[0_0_0_4px_rgba(217,78,39,0.2)]"
                        : "bg-white text-gray-400 border-gray-300"
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      "mt-2 text-xs transition-colors duration-200 absolute top-8 w-20 text-center",
                      "hidden sm:block", // Default hide di mobile
                      isCurrent && "!block", // Paksa tampil jika step aktif (override hidden)
                      isCurrent ? "font-bold text-gray-900" : "text-gray-500",
                      isCompleted && "text-gray-900"
                    )}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector Line (Render if not last item) */}
                {!isLast && (
                  <div className="flex-1 h-[2px] bg-gray-200 mx-2 relative">
                    {/* Active Line Progress */}
                    <div 
                      className={cn(
                        "absolute inset-y-0 left-0 bg-brand-500 transition-all duration-300",
                        isCompleted ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-zinc-200 mt-12">
        <div className="mb-8 border-b border-zinc-100 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
            {currentStep > 0 && (
              <BackButton />
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function BackButton() {
  const { prevStep, currentStep } = useFormStore();

  const handleBack = () => {
    prevStep();
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleBack}
      className="flex items-center gap-2 shrink-0"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Kembali</span>
    </Button>
  );
}

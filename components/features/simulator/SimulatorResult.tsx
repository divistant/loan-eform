"use client";

import type { SimulatorResult } from "@/types/simulator";
import { Calculator, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { motion } from "framer-motion";

type SimulatorResultProps = {
  result: SimulatorResult | null;
  isLoading?: boolean;
};

export function SimulatorResult({ result, isLoading }: SimulatorResultProps) {
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-8">
        <div className="animate-pulse space-y-6">
          <div className="text-center space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-28"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-sm font-medium">
          Masukkan jumlah pinjaman dan tenor untuk melihat simulasi
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-gradient-to-br from-brand-50 via-white to-brand-50/30 border-2 border-brand-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-center pb-4 border-b border-brand-200"
      >
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
          Estimasi Cicilan Bulanan
        </h3>
        <div className="flex items-baseline justify-center gap-3">
          <Calculator className="h-6 w-6 text-brand-500 shrink-0" />
          <p className="text-4xl sm:text-5xl font-bold text-brand-600 tracking-tight">
            {formatRupiah(result.monthlyInstallment)}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="space-y-2 bg-white/60 rounded-lg p-4 border border-brand-100"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <DollarSign className="h-4 w-4 text-brand-500" />
            <span>Total Bunga</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatRupiah(result.totalInterest)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="space-y-2 bg-white/60 rounded-lg p-4 border border-brand-100"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <TrendingUp className="h-4 w-4 text-brand-500" />
            <span>Total Pembayaran</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatRupiah(result.totalPayment)}
          </p>
        </motion.div>
      </div>

      {/* KPR-specific fields: Max Loan Amount and Down Payment */}
      {result.maxLoanAmount !== undefined && result.downPaymentAmount !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-200"
        >
          <div className="space-y-1 bg-white/60 rounded-lg p-3 border border-brand-100">
            <div className="text-xs font-medium text-gray-600">Maksimal Limit Kredit</div>
            <p className="text-lg font-bold text-gray-900">{formatRupiah(result.maxLoanAmount)}</p>
          </div>
          <div className="space-y-1 bg-white/60 rounded-lg p-3 border border-brand-100">
            <div className="text-xs font-medium text-gray-600">Uang Muka</div>
            <p className="text-lg font-bold text-gray-900">{formatRupiah(result.downPaymentAmount)}</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="pt-4 border-t border-brand-200"
      >
        <div className="flex items-center justify-between text-sm bg-white/40 rounded-lg px-4 py-3">
          <span className="text-gray-600 font-medium">Suku Bunga Efektif</span>
          <span className="font-bold text-gray-900 text-lg">{result.effectiveRate.toFixed(2)}% p.a</span>
        </div>
      </motion.div>

      {result.breakdown && result.breakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: result.maxLoanAmount !== undefined ? 0.4 : 0.35, duration: 0.3 }}
          className="pt-6 border-t border-brand-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-brand-500" />
            <h4 className="text-sm font-semibold text-gray-900">Preview 12 Bulan Pertama</h4>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {result.breakdown.map((item, index) => (
              <motion.div
                key={item.month}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.02, duration: 0.2 }}
                className="flex items-center justify-between text-xs bg-white rounded-lg p-3 border border-gray-200 hover:border-brand-300 hover:shadow-sm transition-all duration-200"
              >
                <span className="text-gray-700 font-medium">Bulan {item.month}</span>
                <div className="flex items-center gap-3 sm:gap-4 text-xs">
                  <span className="text-gray-600">
                    <span className="font-medium text-gray-700">Pokok:</span> {formatRupiah(item.principal)}
                  </span>
                  <span className="text-gray-600">
                    <span className="font-medium text-gray-700">Bunga:</span> {formatRupiah(item.interest)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}


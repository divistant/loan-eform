"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditSimulator } from "./CreditSimulator";
import type { Product } from "@/types/domain";
import { Loader2, Calculator } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

async function getProducts() {
  const res = await fetch("/api/mock/products");
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  const json = await res.json();
  return json.data as Array<Product>;
}

export function SimulatorSection() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const selectedProduct = products?.find((p) => p.id === selectedProductId);

  if (isLoading) {
    return (
      <section className="py-24 bg-brand-50">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section id="simulator" className="py-24 bg-brand-50 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 mb-6 shadow-sm"
            >
              <Calculator className="h-10 w-10 text-brand-500" />
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl mb-4">
              Simulasi Kredit Interaktif
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Hitung estimasi cicilan bulanan Anda dengan mudah. Pilih produk, masukkan jumlah pinjaman dan tenor, 
              lalu lihat hasil simulasi secara real-time.
            </p>
          </div>

          {/* Product Selector */}
          <div className="mb-10">
            <label htmlFor="product-selector" className="block text-sm font-semibold text-gray-900 mb-3">
              Pilih Produk
            </label>
            <Select
              value={selectedProductId}
              onValueChange={setSelectedProductId}
            >
              <SelectTrigger id="product-selector" className="w-full h-11 text-base bg-white">
                <SelectValue placeholder="Pilih produk untuk simulasi" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id} className="text-base">
                    {product.name} - {product.rate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Simulator */}
          {selectedProduct ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 lg:p-10 w-full"
            >
              <CreditSimulator product={selectedProduct} compact={false} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300 p-12 sm:p-16 text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6"
              >
                <Calculator className="h-8 w-8 text-gray-400" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Mulai Simulasi Kredit
              </h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Pilih produk di atas untuk melihat estimasi cicilan bulanan dan total pembayaran
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}


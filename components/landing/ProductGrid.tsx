"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/features/product/ProductCard";
import type { Product } from "@/types/domain";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

async function getProducts() {
  const res = await fetch("/api/mock/products");
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  const json = await res.json();
  return json.data as Array<Product>;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export function ProductGrid() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Gagal memuat produk. Silakan coba lagi nanti.
      </div>
    );
  }

  return (
    <section id="products" className="py-24 bg-white scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
            Produk yang Tepat untuk Setiap Kebutuhan
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Pilih produk pinjaman yang sesuai dengan tujuan dan kemampuan finansial Anda.
            <br className="hidden sm:block" />
            Mulai dari KPR, dana tunai, hingga modal usaha.
          </p>
        </motion.div>
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products?.map((product) => (
            <motion.div key={product.id} variants={item}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

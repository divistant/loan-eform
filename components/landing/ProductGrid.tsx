"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/features/product/ProductCard";
import type { Product } from "@/types/domain";
import { Loader2 } from "lucide-react";

async function getProducts() {
  const res = await fetch("/api/mock/products");
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  const json = await res.json();
  return json.data as Array<Product>;
}

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
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
            Produk yang Tepat untuk Setiap Kebutuhan
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            Pilih produk pinjaman yang sesuai dengan tujuan dan kemampuan finansial Anda.
            <br className="hidden sm:block" />
            Mulai dari KPR, dana tunai, hingga modal usaha.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

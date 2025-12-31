"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const scrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-brand-50 pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[80vh] flex items-center">
      <div className="container relative z-30">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-brand-900 sm:text-6xl">
              Wujudkan Rencana, <br />
              <span className="text-brand-500">Membangun Masa Depan</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Ajukan pinjaman <strong>mudah dan cepat</strong> melalui E-Form Bank Jakarta. 
              <br />
              Proses 100% online, transparan, dan terpercaya. Tanpa perlu datang ke kantor cabang.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Button 
                onClick={scrollToProducts}
                size="lg" 
                className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-base pointer-events-auto cursor-pointer relative z-30 w-full sm:w-auto"
              >
                Ajukan Pinjaman <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={scrollToProducts}
                variant="outline" 
                size="lg" 
                className="border-2 border-brand-200 text-brand-900 hover:bg-brand-50 px-8 py-6 rounded-full font-semibold text-base pointer-events-auto cursor-pointer relative z-30 w-full sm:w-auto"
              >
                Pelajari Produk <Info className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl opacity-30 z-0 pointer-events-none" aria-hidden="true">
        <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-brand-100 to-brand-500" 
             style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} 
        />
      </div>
    </section>
  );
}

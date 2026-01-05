"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, ChevronRight, Home, Banknote, Store, Calculator } from "lucide-react";
import type { Product } from "@/types/domain";
import { useFormStore } from "@/lib/store/useFormStore";
import { SimulatorModal } from "@/components/features/simulator/SimulatorModal";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const setProduct = useFormStore((state) => state.setProduct);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Helper untuk format rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSelectProduct = () => {
    setProduct(product);
    router.push(`/apply/${product.id}`);
  };

  const getProductIcon = (id: string) => {
    if (id.includes("KPR")) return <Home className="h-6 w-6 text-brand-500" />;
    if (id.includes("KMG")) return <Banknote className="h-6 w-6 text-brand-500" />;
    return <Store className="h-6 w-6 text-brand-500" />;
  };

  return (
    <Card 
      onClick={(e) => {
        // Prevent card click jika modal sedang terbuka
        // Also check if click target is from dialog overlay
        const target = e.target as HTMLElement;
        const isDialogOverlay = target.closest('[data-slot="dialog-overlay"]') || 
                                 target.closest('[data-slot="dialog-content"]');
        
        if (!isSimulatorOpen && !isDialogOverlay) {
          handleSelectProduct();
        } else {
          // Prevent navigation if modal is open or clicking on dialog
          e.stopPropagation();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!isSimulatorOpen) {
            handleSelectProduct();
          }
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Pilih produk ${product.name}`}
      className="group flex flex-col border-t-4 border-t-brand-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 group-hover:scale-110 transition-transform duration-300">
            {getProductIcon(product.id)}
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 leading-tight group-hover:text-brand-500 transition-colors duration-300">
              {product.name}
            </CardTitle>
            <CardDescription className="text-base font-bold text-brand-500 mt-1">
              {product.rate}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-gray-600 mb-6 text-sm leading-relaxed min-h-[4.5rem]">
          {product.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-gray-50 p-2 rounded-md">
            <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            <span className="text-sm text-gray-700 font-medium">Min. Pendapatan: <br/>{formatRupiah(product.constraints.min_income)}</span>
          </div>
          <div className="flex items-start gap-3 bg-gray-50 p-2 rounded-md">
            <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            <span className="text-sm text-gray-700 font-medium">
              Tenor hingga {Math.max(...product.constraints.tenor_options)} {product.constraints.tenor_type === 'YEAR' ? 'Tahun' : 'Bulan'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-col gap-2">
        <Button 
          variant="outline"
          className="w-full border-brand-300 text-brand-600 hover:bg-brand-50 hover:border-brand-400 font-medium transition-all duration-300 h-10"
          onClick={(e) => {
            e.stopPropagation();
            setIsSimulatorOpen(true);
          }}
        >
          <Calculator className="mr-2 h-4 w-4" />
          Coba Simulasi
        </Button>
        <Button 
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-md hover:shadow-xl group-hover:scale-105 transition-all duration-300 h-11"
          onClick={(e) => {
            e.stopPropagation(); // Mencegah double trigger jika card diklik
            handleSelectProduct();
          }}
        >
          Ajukan Sekarang
          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
      <SimulatorModal
        product={product}
        open={isSimulatorOpen}
        onOpenChange={setIsSimulatorOpen}
      />
    </Card>
  );
}

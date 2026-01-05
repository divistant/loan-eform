"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditSimulator } from "./CreditSimulator";
import type { Product } from "@/types/domain";
import type { SimulatorInput } from "@/types/simulator";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/lib/store/useFormStore";

type SimulatorModalProps = {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SimulatorModal({ product, open, onOpenChange }: SimulatorModalProps) {
  const router = useRouter();
  const setProduct = useFormStore((state) => state.setProduct);

  const handleApply = (input: SimulatorInput) => {
    setProduct(product);
    onOpenChange(false);
    router.push(`/apply/${product.id}`);
  };

  // Handle modal close - hanya menutup modal, tidak redirect
  const handleOpenChange = (newOpen: boolean) => {
    // Prevent any navigation when modal is closed
    if (!newOpen) {
      // Modal ditutup - hanya tutup modal, tidak redirect
      // Direct call tanpa setTimeout untuk immediate response
      onOpenChange(false);
      return;
    }
    // Modal dibuka
    onOpenChange(true);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent 
        className="max-w-[95vw] lg:max-w-7xl max-h-[90vh] overflow-y-auto sm:max-h-[85vh] p-0"
        aria-describedby="simulator-modal-description"
      >
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              Simulasi Kredit
            </DialogTitle>
            <DialogDescription 
              id="simulator-modal-description"
              className="text-base text-gray-600 leading-relaxed"
            >
              {product.name} - {product.rate}
              <br />
              <span className="text-sm">
                Masukkan jumlah pinjaman dan tenor untuk melihat estimasi cicilan bulanan Anda.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <CreditSimulator product={product} onApply={handleApply} compact={false} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


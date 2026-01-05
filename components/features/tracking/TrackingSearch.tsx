"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, Loader2 } from "lucide-react";
import { validateUUID } from "@/lib/api/tracking-client";
import { toast } from "sonner";

export function TrackingSearch() {
  const [uuid, setUuid] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate UUID
    const validation = validateUUID(uuid);
    if (!validation.valid) {
      setError(validation.error || "Format nomor referensi tidak valid");
      toast.error(validation.error || "Format nomor referensi tidak valid");
      return;
    }

    setIsValidating(true);

    try {
      // Navigate to tracking detail page
      router.push(`/tracking/${uuid.trim()}`);
    } catch (error) {
      console.error("Error navigating to tracking page:", error);
      setError("Terjadi kesalahan. Silakan coba lagi.");
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="uuid-input" className="text-sm font-medium text-gray-700">
          Nomor Referensi Pengajuan
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="uuid-input"
            type="text"
            placeholder="Masukkan nomor referensi (contoh: xxxx-xxxx-xxxx)"
            value={uuid}
            onChange={(e) => {
              setUuid(e.target.value);
              setError(null); // Clear error saat user mengetik
            }}
            className={cn(
              "pl-10 h-12 text-base",
              error && "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/30"
            )}
            disabled={isValidating}
            aria-invalid={!!error}
            aria-describedby={error ? "uuid-error" : "uuid-help"}
          />
        </div>
        {error ? (
          <p id="uuid-error" className="text-sm text-red-600 flex items-center gap-1.5" role="alert">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        ) : (
          <p id="uuid-help" className="text-xs text-gray-500">
            Nomor referensi dapat ditemukan di email konfirmasi pengajuan Anda
          </p>
        )}
      </div>
      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold"
        disabled={isValidating || !uuid.trim()}
      >
        {isValidating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Memeriksa...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Cek Status
          </>
        )}
      </Button>
    </form>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}


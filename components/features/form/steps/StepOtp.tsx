"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useFormStore } from "@/lib/store/useFormStore";
import { otpSchema, type OtpFormValues } from "@/lib/validators/form-schema";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function StepOtp() {
  const { verification, setVerificationStatus, setVerified, nextStep } = useFormStore();
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { phoneNumber } = verification;

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  });

  const requestOtp = async () => {
    if (!phoneNumber) return;

    setIsLoading(true);
    setVerificationStatus("SENDING");

    try {
      const res = await fetch("/api/mock/otp/request", {
        method: "POST",
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const data = await res.json();

      if (res.ok) {
        setVerificationStatus("SENT");
        toast.success(`Kode OTP: ${data.demo_code}`, {
          description: "Gunakan kode ini untuk verifikasi.",
          duration: 10000,
        });
        setCountdown(60);
      } else {
        toast.error("OTP Tidak Terkirim", {
          description: "Pastikan nomor WhatsApp Anda aktif, lalu coba kirim ulang.",
        });
        setVerificationStatus("IDLE");
      }
    } catch {
      toast.error("Koneksi Internet Bermasalah", {
        description: "Cek koneksi Anda dan coba lagi dalam beberapa saat.",
      });
      setVerificationStatus("IDLE");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: OtpFormValues) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/mock/otp/verify", {
        method: "POST",
        body: JSON.stringify({ code: data.code }),
      });
      
      if (res.ok) {
        setVerified(true);
        toast.success("Verifikasi Berhasil!");
        nextStep();
      } else {
        form.setError("code", { message: "Kode OTP Salah. Periksa kembali atau kirim ulang OTP." });
      }
    } catch {
      toast.error("Verifikasi Gagal. Silakan coba beberapa saat lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (verification.otpStatus === "IDLE") {
      requestOtp();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Kode OTP telah dikirim ke WhatsApp
        </p>
        <p className="font-bold text-lg text-gray-900">{phoneNumber}</p>
        <Button 
          variant="link" 
          className="text-xs text-brand-500 h-auto p-0 hover:text-brand-600"
          onClick={() => alert("Fitur ganti nomor belum tersedia di POC ini")}
        >
          Ganti Nomor?
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel className="sr-only">Kode OTP</FormLabel>
                <FormControl>
                  <InputOTP maxLength={4} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Masukkan 4 digit kode yang Anda terima.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-[#D94E27] hover:bg-[#B83D1B] text-white font-semibold h-12 rounded-md transition-colors"
            disabled={isLoading || form.watch("code").length !== 4}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verifikasi
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">Tidak menerima kode?</p>
        <Button
          variant="outline"
          size="sm"
          onClick={requestOtp}
          disabled={countdown > 0 || isLoading}
          className="w-full max-w-xs mx-auto"
        >
          {countdown > 0 ? `Kirim Ulang (${countdown}s)` : "Kirim Ulang OTP"}
        </Button>
      </div>
    </div>
  );
}

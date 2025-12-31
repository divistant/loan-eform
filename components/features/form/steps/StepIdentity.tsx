"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStore } from "@/lib/store/useFormStore";
import { identitySchema, type IdentityFormValues } from "@/lib/validators/form-schema";
import { ArrowRight, Loader2 } from "lucide-react";

export function StepIdentity() {
  const { draft, verification, updateDraft, setVerificationStatus, nextStep } = useFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<IdentityFormValues>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      fullName: draft.personal.fullName,
      email: draft.personal.email,
      phoneNumber: verification.phoneNumber || "",
    },
  });

  const onSubmit = async (data: IdentityFormValues) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updateDraft("personal", {
      fullName: data.fullName,
      email: data.email,
    });
    
    setVerificationStatus("IDLE", data.phoneNumber);
    
    setIsSubmitting(false);
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap (Sesuai KTP)</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Budi Santoso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="budi@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor WhatsApp</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="0812xxxxxxxx"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold h-12 rounded-md transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              Lanjut ke Verifikasi <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

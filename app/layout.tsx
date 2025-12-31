import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bank Jakarta E-Form",
  description: "Ajukan pinjaman mudah dan cepat melalui E-Form Bank Jakarta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <QueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Toaster richColors theme="light" />
          <footer className="py-12 bg-zinc-50 border-t border-zinc-200">
            <div className="container">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <p className="text-sm text-zinc-900 font-medium">
                    © 2025 Bank Jakarta. Terdaftar dan diawasi oleh OJK.
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Produk pinjaman ini dijamin oleh LPS sesuai ketentuan yang berlaku.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-600">
                  <a href="https://www.bankdki.co.id/syarat-ketentuan" target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                    Syarat & Ketentuan
                  </a>
                  <span>•</span>
                  <a href="https://www.bankdki.co.id/kebijakan-privasi" target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                    Kebijakan Privasi
                  </a>
                  <span>•</span>
                  <a href="https://www.bankdki.co.id/hubungi-kami" target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">
                    Hubungi Kami
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}

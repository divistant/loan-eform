"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleServiceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("Fitur layanan digital akan segera hadir.");
  };

  const scrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        isScrolled
          ? "border-zinc-200 bg-white/80 backdrop-blur-md"
          : "border-transparent bg-white"
      )}
    >
      <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 2xl:px-24 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/Bank_Jakarta.svg"
            alt="Bank Jakarta Logo"
            width={140}
            height={40}
            className="h-8 w-auto md:h-10"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={scrollToProducts}
            className="text-sm font-medium text-zinc-600 hover:text-brand-500 transition-colors cursor-pointer"
          >
            Produk
          </button>
          <button
            onClick={handleServiceClick}
            className="text-sm font-medium text-zinc-600 hover:text-brand-500 transition-colors cursor-pointer"
          >
            Layanan
          </button>
          <a
            href="https://www.bankdki.co.id/home"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-600 hover:text-brand-500 transition-colors"
          >
            Tentang Kami
          </a>
        </nav>

        {/* Mobile Menu Placeholder - Bisa ditambahkan hamburger menu nanti */}
      </div>
    </header>
  );
}

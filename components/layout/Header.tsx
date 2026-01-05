"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Improved scroll function with retry mechanism
  const performScrollRef = useRef<((sectionId: string, retryCount?: number) => void) | null>(null);
  
  useEffect(() => {
    performScrollRef.current = (sectionId: string, retryCount = 0) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80; // Account for sticky header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else if (retryCount < 3) {
        // Retry if element not found (might still be rendering)
        setTimeout(() => {
          if (performScrollRef.current) {
            performScrollRef.current(sectionId, retryCount + 1);
          }
        }, 100);
      }
    };
  }, []);

  // Desktop navigation handler with page detection
  const handleDesktopNavClick = useCallback((sectionId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Check if we're on landing page
    if (pathname === '/') {
      // Di landing page, scroll langsung
      if (performScrollRef.current) {
        performScrollRef.current(sectionId);
      }
    } else {
      // Di halaman lain, redirect ke landing page dengan hash
      router.push(`/#${sectionId}`);
    }
  }, [pathname, router]);

  // Mobile navigation handler with page detection
  const handleMobileNavClick = useCallback((sectionId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close mobile menu first
    setIsMobileMenuOpen(false);
    
    // Check if we're on landing page
    if (pathname === '/') {
      // Di landing page, wait for Sheet to close then scroll
      setTimeout(() => {
        if (performScrollRef.current) {
          performScrollRef.current(sectionId);
        }
      }, 400); // Slightly longer than Sheet close animation to ensure it's fully closed
    } else {
      // Di halaman lain, redirect ke landing page dengan hash
      setTimeout(() => {
        router.push(`/#${sectionId}`);
      }, 350); // Wait for Sheet to close first
    }
  }, [pathname, router]);

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

        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={(e) => handleDesktopNavClick('simulator', e)}
            className="text-sm font-medium text-zinc-600 hover:text-brand-500 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-brand-50"
          >
            Simulator
          </button>
          <button
            onClick={(e) => handleDesktopNavClick('products', e)}
            className="text-sm font-medium text-zinc-600 hover:text-brand-500 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-brand-50"
          >
            Produk
          </button>
          <button
            onClick={(e) => handleDesktopNavClick('benefits', e)}
            className="text-sm font-medium text-zinc-600 hover:text-brand-500 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-brand-50"
          >
            Keuntungan
          </button>
          <button
            onClick={(e) => handleDesktopNavClick('cara-kerja', e)}
            className="text-sm font-medium text-zinc-600 hover:text-brand-500 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-brand-50"
          >
            Cara Kerja
          </button>
          <Link
            href="/tracking"
            className="text-sm font-medium text-zinc-600 hover:text-brand-500 transition-colors px-2 py-1 rounded-md hover:bg-brand-50"
          >
            Cek Status
          </Link>
          <a
            href="https://www.bankdki.co.id/home"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-600 hover:text-brand-500 transition-colors px-2 py-1 rounded-md hover:bg-brand-50"
          >
            Tentang Kami
          </a>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-2">
              <button
                onClick={(e) => handleMobileNavClick('simulator', e)}
                type="button"
                className="text-left text-base font-medium text-zinc-700 hover:text-brand-500 transition-colors cursor-pointer px-4 py-3 rounded-md hover:bg-brand-50"
              >
                Simulator
              </button>
              <button
                onClick={(e) => handleMobileNavClick('products', e)}
                type="button"
                className="text-left text-base font-medium text-zinc-700 hover:text-brand-500 transition-colors cursor-pointer px-4 py-3 rounded-md hover:bg-brand-50"
              >
                Produk
              </button>
              <button
                onClick={(e) => handleMobileNavClick('benefits', e)}
                type="button"
                className="text-left text-base font-medium text-zinc-700 hover:text-brand-500 transition-colors cursor-pointer px-4 py-3 rounded-md hover:bg-brand-50"
              >
                Keuntungan
              </button>
              <button
                onClick={(e) => handleMobileNavClick('cara-kerja', e)}
                type="button"
                className="text-left text-base font-medium text-zinc-700 hover:text-brand-500 transition-colors cursor-pointer px-4 py-3 rounded-md hover:bg-brand-50"
              >
                Cara Kerja
              </button>
              <Link
                href="/tracking"
                className="text-left text-base font-medium text-zinc-700 hover:text-brand-500 transition-colors px-4 py-3 rounded-md hover:bg-brand-50"
              >
                Cek Status
              </Link>
              <a
                href="https://www.bankdki.co.id/home"
                target="_blank"
                rel="noopener noreferrer"
                className="text-left text-base font-medium text-zinc-700 hover:text-brand-500 transition-colors px-4 py-3 rounded-md hover:bg-brand-50"
              >
                Tentang Kami
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

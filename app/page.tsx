"use client";

import { useEffect } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProductGrid } from "@/components/landing/ProductGrid";
import { BenefitSection } from "@/components/landing/BenefitSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { SimulatorSection } from "@/components/features/simulator/SimulatorSection";

export default function Home() {
  // Handle hash navigation from other pages
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        // Wait for page to fully render
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            const headerOffset = 80; // Account for sticky header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 300); // Wait for sections to render
      }
    };

    // Handle initial hash
    handleHashScroll();

    // Handle hash change (if user clicks anchor link)
    window.addEventListener('hashchange', handleHashScroll);

    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <SimulatorSection />
      <ProductGrid />
      <BenefitSection />
      <HowItWorksSection />
    </div>
  );
}

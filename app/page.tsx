import { HeroSection } from "@/components/landing/HeroSection";
import { ProductGrid } from "@/components/landing/ProductGrid";
import { BenefitSection } from "@/components/landing/BenefitSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <BenefitSection />
      <ProductGrid />
      <HowItWorksSection />
    </div>
  );
}

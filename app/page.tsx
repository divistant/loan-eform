import { HeroSection } from "@/components/landing/HeroSection";
import { ProductGrid } from "@/components/landing/ProductGrid";
import { BenefitSection } from "@/components/landing/BenefitSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { SimulatorSection } from "@/components/features/simulator/SimulatorSection";

export default function Home() {
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

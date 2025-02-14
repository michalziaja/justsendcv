import { SiteHeader } from "@/components/main/site-header"
import { HeroSection } from '@/components/main/hero-section'
import { FeaturesSection } from "@/components/main/features-section"
import { AppShowcase } from "@/components/main/app-showcase"
import { PricingSection } from "@/components/main/pricing-section"
import { SiteFooter } from "@/components/main/site-footer"
import { FaqSection } from "@/components/main/faq-section"

export default function Page() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow">
        <HeroSection />
        <AppShowcase />
        <FeaturesSection />
        <PricingSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  )
}


import HeroSection from "@/components/marketing/hero-section";
import SocialProofStrip from "@/components/marketing/social-proof-strip";
import PillarsSection from "@/components/marketing/pillars-section";
import JurisdictionsStrip from "@/components/marketing/jurisdictions-strip";
import HowItWorksSection from "@/components/marketing/how-it-works-section";
import WhyOrionSection from "@/components/marketing/why-orion-section";
import PackagesTeaser from "@/components/marketing/packages-teaser";
import CtaSection from "@/components/marketing/cta-section";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <SocialProofStrip />
      <PillarsSection />
      <JurisdictionsStrip />
      <HowItWorksSection />
      <WhyOrionSection />
      <PackagesTeaser />
      <CtaSection />
    </div>
  );
}

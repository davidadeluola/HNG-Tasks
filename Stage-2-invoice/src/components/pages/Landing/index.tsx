import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
// import { StatsAndBrandsSection } from "./StatsAndBrandsSection";
// import { Footer } from "./Footer";

export default function Landing() {
  return (
    <div className="bg-(--ui-bg) min-h-screen">
      <HeroSection />
      <FeaturesSection />
      {/* <StatsAndBrandsSection /> */}
      {/* <Footer /> */}
    </div>
  );
}

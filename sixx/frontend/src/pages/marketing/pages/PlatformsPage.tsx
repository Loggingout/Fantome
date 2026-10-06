
import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";
import SEOHead from "../../../components/SEOHead";

import PlatformsHero from "../components/platforms/PlatformsHero";
import PlatformsIntro from "../components/platforms/PlatformsIntro";
import PlatformsGrid from "../components/platforms/PlatformsGrid";
import PlatformsVision from "../components/platforms/PlatformsVision";

export default function PlatformsPage() {
  return (
    <>
      <SEOHead title="Platforms" description="Discover the digital platforms built and operated by Fantome Technologies." path="/platforms" />

      <Navbar />

      <main>
        <PlatformsHero />
        <PlatformsIntro />
        <PlatformsGrid />
        <PlatformsVision />
      </main>

      <Footer />
    </>
  );
}


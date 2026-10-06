
import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";
import SEOHead from "../../../components/SEOHead";

import EcosystemHero from "../components/ecosystem/EcosystemHero";
import EcosystemIntro from "../components/ecosystem/EcosystemIntro";
import EcosystemGrid from "../components/ecosystem/EcosystemGrid";
import EcosystemPlatformPreview from "../components/ecosystem/EcosystemPlatformPreview";
import EcosystemVision from "../components/ecosystem/EcosystemVision";

export default function EcosystemPage() {
  return (
    <>
      <SEOHead title="Ecosystem" description="Explore the companies, products, and platforms connected through the Fantome Technologies ecosystem." path="/ecosystem" />

      <Navbar />

      <main>
        <EcosystemHero />
        <EcosystemIntro />
        <EcosystemGrid />
        <EcosystemPlatformPreview />
        <EcosystemVision />
      </main>

      <Footer />
    </>
  );
}



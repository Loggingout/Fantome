
import { Helmet } from "react-helmet-async";

import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";

import EcosystemHero from "../components/ecosystem/EcosystemHero";
import EcosystemIntro from "../components/ecosystem/EcosystemIntro";
import EcosystemGrid from "../components/ecosystem/EcosystemGrid";
import EcosystemPlatformPreview from "../components/ecosystem/EcosystemPlatformPreview";
import EcosystemVision from "../components/ecosystem/EcosystemVision";

export default function EcosystemPage() {
  return (
    <>
      <Helmet>
        <title>Ecosystem | Fantome Technologies</title>
        <meta
          name="description"
          content="Explore the industries, technologies, and platforms that make up the Fantome Technologies ecosystem."
        />
      </Helmet>

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



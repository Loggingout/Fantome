
import { Helmet } from "react-helmet-async";

import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";

import PlatformsHero from "../components/platforms/PlatformsHero";
import PlatformsIntro from "../components/platforms/PlatformsIntro";
import PlatformsGrid from "../components/platforms/PlatformsGrid";
import PlatformsVision from "../components/platforms/PlatformsVision";

export default function PlatformsPage() {
  return (
    <>
      <Helmet>
        <title>Platforms | Fantome Technologies</title>

        <meta
          name="description"
          content="Explore the platforms built and operated within the Fantome Technologies ecosystem."
        />
      </Helmet>

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


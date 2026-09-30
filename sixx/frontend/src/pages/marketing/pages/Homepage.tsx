import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

import Footer from "../../../components/footer/Footer";

import HomeHero from "../components/home/HomeHero";
import HomeIntro from "../components/home/HomeIntro";
import HomeBuildAreas from "../components/home/HomeBuildAreas";
import HomePlatforms from "../components/home/HomePlatforms";
import HomeEcosystem from "../components/home/HomeEcosystem";
import HomeMission from "../components/home/HomeMission";

export default function Homepage() {
  return (
    <motion.div
      className="min-h-screen bg-neutral-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Helmet>
        <title>Fantome Technologies | Building Technology for the Consumer</title>

        <meta
          name="description"
          content="Fantome Technologies builds, operates, and scales technology products within its own ecosystem — building for the consumer, scaling for the consumer, and listening to the consumer."
        />

        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Fantome Technologies | Building Technology for the Consumer"
        />

        <meta
          property="og:description"
          content="Fantome Technologies builds, operates, and scales technology products within its own ecosystem."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://fantometechnologies.com"
        />

        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Fantome Technologies | Building Technology for the Consumer"
        />

        <meta
          name="twitter:description"
          content="Fantome Technologies builds, operates, and scales technology products within its own ecosystem."
        />

        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <link
          rel="canonical"
          href="https://fantometechnologies.com/"
        />
      </Helmet>

      <main>
        <HomeHero />

        <HomeIntro />

        <HomeBuildAreas />

        <HomePlatforms />

        <HomeEcosystem />

        <HomeMission />
      </main>

      <Footer />
    </motion.div>
  );
}
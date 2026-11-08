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
        <title>Fantome Technologies | Digital Platforms and Products</title>

        <meta
          name="description"
          content="Fantome Technologies builds and operates digital platforms and products, connecting independent ventures within one evolving technology ecosystem."
        />

        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Fantome Technologies | Digital Platforms and Products"
        />

        <meta
          property="og:description"
          content="Fantome Technologies builds and operates digital platforms and products within an evolving technology ecosystem."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://fantometechnologies.com"
        />

        <meta
          property="og:image"
          content="https://fantometechnologies.com/new-logo.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Fantome Technologies | Digital Platforms and Products"
        />

        <meta
          name="twitter:description"
          content="Fantome Technologies builds and operates digital platforms and products within an evolving technology ecosystem."
        />

        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/new-logo.png"
        />

        <link
          rel="canonical"
          href="https://fantometechnologies.com/"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Fantome Technologies",
            url: "https://fantometechnologies.com/",
            logo: "https://fantometechnologies.com/new-logo.png",
            description: "Fantome Technologies builds and operates digital platforms and products, connecting independent ventures within one evolving technology ecosystem.",
          })}
        </script>
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
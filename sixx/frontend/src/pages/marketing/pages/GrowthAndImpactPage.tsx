import { Helmet } from "react-helmet-async";

import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";

import GrowthAndImpactHero from "../components/company/growth-and-impact/GrowthAndImpactHero";
import GrowthAndImpactIntro from "../components/company/growth-and-impact/GrowthAndImpactIntro";
import GrowthAreas from "../components/company/growth-and-impact/GrowthAreas";
import GrowthMetrics from "../components/company/growth-and-impact/GrowthMetrics";
import GrowthImpactInPractice from "../components/company/growth-and-impact/GrowthImpactInPractice";
import GrowthAndImpactCTA from "../components/company/growth-and-impact/GrowthAndImpactCTA";

export default function GrowthAndImpactPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>Growth & Impact | Fantome Technologies</title>

        <meta
          name="description"
          content="Explore how Fantome Technologies approaches growth through products, people, technology, infrastructure, and the broader ecosystem."
        />

        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Growth & Impact | Fantome Technologies"
        />

        <meta
          property="og:description"
          content="Explore how Fantome Technologies approaches growth through products, people, technology, infrastructure, and the broader ecosystem."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://fantometechnologies.com/growth-and-impact"
        />

        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Growth & Impact | Fantome Technologies"
        />

        <meta
          name="twitter:description"
          content="Explore how Fantome Technologies approaches growth through products, people, technology, infrastructure, and the broader ecosystem."
        />

        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <link
          rel="canonical"
          href="https://fantometechnologies.com/growth-and-impact"
        />
      </Helmet>

      <Navbar />

      <main>
        <GrowthAndImpactHero />
        <GrowthAndImpactIntro />
        <GrowthAreas />
        <GrowthMetrics />
        <GrowthImpactInPractice />
        <GrowthAndImpactCTA />
      </main>

      <Footer />
    </div>
  );
}
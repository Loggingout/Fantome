import { Helmet } from "react-helmet-async";

import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";

import MissionHero from "../components/company/the-mission/MissionHero";
import MissionStatement from "../components/company/the-mission/MissionStatement";
import MissionPrinciples from "../components/company/the-mission/MissionPrinciples";
import MissionEcosystem from "../components/company/the-mission/MissionEcosystem";
import MissionPeople from "../components/company/the-mission/MissionPeople";
import MissionClosing from "../components/company/the-mission/MissionClosing";

export default function TheMissionPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>The Mission | Fantome Technologies</title>

        <meta
          name="description"
          content="Learn about the mission behind Fantome Technologies: build for the consumer, scale for the consumer, and listen to the consumer."
        />

        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="The Mission | Fantome Technologies"
        />

        <meta
          property="og:description"
          content="Learn about the mission behind Fantome Technologies: build for the consumer, scale for the consumer, and listen to the consumer."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://fantometechnologies.com/the-mission"
        />

        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="The Mission | Fantome Technologies"
        />

        <meta
          name="twitter:description"
          content="Learn about the mission behind Fantome Technologies: build for the consumer, scale for the consumer, and listen to the consumer."
        />

        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <link
          rel="canonical"
          href="https://fantometechnologies.com/the-mission"
        />
      </Helmet>

      <Navbar />

      <main>
        <MissionHero />
        <MissionStatement />
        <MissionPrinciples />
        <MissionEcosystem />
        <MissionPeople />
        <MissionClosing />
      </main>

      <Footer />
    </div>
  );
}
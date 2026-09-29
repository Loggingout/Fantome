import { Helmet } from "react-helmet-async";

import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";

import AboutHero from "../components/company/about/AboutHero";
import AboutInfoGrid from "../components/company/about/AboutInfoGrid";
import AboutCompanySection from "../components/company/about/AboutCompanySection";
import AboutValues from "../components/company/about/AboutValues";
import AboutTrustSection from "../components/company/about/AboutTrustSection";
import AboutTeamSection from "../components/company/about/AboutTeamSection";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>About Us | Fantome Technologies</title>

        <meta
          name="description"
          content="Learn about Fantome Technologies, a technology company building, operating, and scaling products within its own ecosystem."
        />

        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="About Us | Fantome Technologies"
        />

        <meta
          property="og:description"
          content="Learn about Fantome Technologies, a technology company building, operating, and scaling products within its own ecosystem."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://fantometechnologies.com/about"
        />

        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="About Us | Fantome Technologies"
        />

        <meta
          name="twitter:description"
          content="Learn about Fantome Technologies, a technology company building, operating, and scaling products within its own ecosystem."
        />

        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <link
          rel="canonical"
          href="https://fantometechnologies.com/about"
        />
      </Helmet>

      <Navbar />

      <main>
        <AboutHero />

        <AboutInfoGrid />

        <AboutCompanySection />

        <AboutValues />

        <AboutTrustSection />

        <AboutTeamSection />
      </main>

      <Footer />
    </div>
  );
}
import { Helmet } from "react-helmet-async";

import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";

import DonationsHero from "../components/company/donations/DonationsHero";
import DonationsIntro from "../components/company/donations/DonationsIntro";
import DonationsImpact from "../components/company/donations/DonationsImpact";
import DonationsPlatformSupport from "../components/company/donations/DonationsSupport";
import DonationsFAQ from "../components/company/donations/DonationsFAQ";
import DonationsCTA from "../components/company/donations/DonationsCTA";

export default function DonationsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>Donations | Fantome Technologies</title>

        <meta
          name="description"
          content="Support Fantome Technologies and help contribute to the people, technology, platforms, and operations behind our growing ecosystem."
        />

        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Donations | Fantome Technologies"
        />

        <meta
          property="og:description"
          content="Support Fantome Technologies and help contribute to the people, technology, platforms, and operations behind our growing ecosystem."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://fantometechnologies.com/donations"
        />

        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Donations | Fantome Technologies"
        />

        <meta
          name="twitter:description"
          content="Support Fantome Technologies and help contribute to the people, technology, platforms, and operations behind our growing ecosystem."
        />

        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <link
          rel="canonical"
          href="https://fantometechnologies.com/donations"
        />
      </Helmet>

      <Navbar />

      <main>
        <DonationsHero />
        <DonationsIntro />
        <DonationsImpact />
        <DonationsPlatformSupport />
        <DonationsFAQ />
        <DonationsCTA />
      </main>

      <Footer />
    </div>
  );
}
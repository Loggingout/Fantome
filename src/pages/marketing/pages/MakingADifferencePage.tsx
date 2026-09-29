import { Helmet } from "react-helmet-async";

import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";

import MakingADifferenceHero from "../components/company/making-a-difference/MakingADifferenceHero";
import MakingADifferenceIntro from "../components/company/making-a-difference/MakingADifferenceIntro";
import MakingADifferenceImpact from "../components/company/making-a-difference/MakingADifferenceImpact";
import MakingADifferencePrinciples from "../components/company/making-a-difference/MakingADifferencePrinciples";
import MakingADifferenceCTA from "../components/company/making-a-difference/MakingADifferenceCTA";

export default function MakingADifferencePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>
          Making a Difference | Fantome Technologies
        </title>

        <meta
          name="description"
          content="Learn how Fantome Technologies approaches making a difference through technology, people, consumers, and the ecosystem we are building."
        />

        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Making a Difference | Fantome Technologies"
        />

        <meta
          property="og:description"
          content="Learn how Fantome Technologies approaches making a difference through technology, people, consumers, and the ecosystem we are building."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://fantometechnologies.com/making-a-difference"
        />

        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Making a Difference | Fantome Technologies"
        />

        <meta
          name="twitter:description"
          content="Learn how Fantome Technologies approaches making a difference through technology, people, consumers, and the ecosystem we are building."
        />

        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <link
          rel="canonical"
          href="https://fantometechnologies.com/making-a-difference"
        />
      </Helmet>

      <Navbar />

      <main>
        <MakingADifferenceHero />
        <MakingADifferenceIntro />
        <MakingADifferenceImpact />
        <MakingADifferencePrinciples />
        <MakingADifferenceCTA />
      </main>

      <Footer />
    </div>
  );
}
import { Helmet } from "react-helmet-async";

import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";

import JoinTheTeamHero from "../components/company/join-the-team/JoinTheTeamHero";
import JoinTheTeamIntro from "../components/company/join-the-team/JoinTheTeamIntro";
import JoinTheTeamOpportunities from "../components/company/join-the-team/JoinTheTeamOpportunities";
import JoinTheTeamValues from "../components/company/join-the-team/JoinTheTeamValues";
import JoinTheTeamContribution from "../components/company/join-the-team/JoinTheTeamContribution";
import JoinTheTeamCTA from "../components/company/join-the-team/JoinTheTeamCTA";

export default function JoinTheTeamPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>Join the Team | Fantome Technologies</title>

        <meta
          name="description"
          content="Explore opportunities to contribute to the people, products, platforms, infrastructure, and technology ecosystem behind Fantome Technologies."
        />

        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Join the Team | Fantome Technologies"
        />

        <meta
          property="og:description"
          content="Explore opportunities to contribute to the people, products, platforms, infrastructure, and technology ecosystem behind Fantome Technologies."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://fantometechnologies.com/join-the-team"
        />

        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Join the Team | Fantome Technologies"
        />

        <meta
          name="twitter:description"
          content="Explore opportunities to contribute to the people, products, platforms, infrastructure, and technology ecosystem behind Fantome Technologies."
        />

        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <link
          rel="canonical"
          href="https://fantometechnologies.com/join-the-team"
        />
      </Helmet>

      <Navbar />

      <main>
        <JoinTheTeamHero />
        <JoinTheTeamIntro />
        <JoinTheTeamOpportunities />
        <JoinTheTeamValues />
        <JoinTheTeamContribution />
        <JoinTheTeamCTA />
      </main>

      <Footer />
    </div>
  );
}
import { Helmet } from "react-helmet-async";

import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";

import NewsletterHero from "../components/company/newsletter/NewsletterHero";
import NewsletterIntro from "../components/company/newsletter/NewsletterIntro";
import NewsletterSignup from "../components/company/newsletter/NewsletterSignup";
import NewsletterHighlights from "../components/company/newsletter/NewsletterHighlights";
import NewsletterFAQ from "../components/company/newsletter/NewsletterFAQ";

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>Newsletter | Fantome Technologies</title>

        <meta
          name="description"
          content="Subscribe to the Fantome Technologies newsletter for company updates, ecosystem developments, platform news, and announcements."
        />

        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Newsletter | Fantome Technologies"
        />

        <meta
          property="og:description"
          content="Subscribe to the Fantome Technologies newsletter for company updates, ecosystem developments, platform news, and announcements."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://fantometechnologies.com/newsletter"
        />

        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Newsletter | Fantome Technologies"
        />

        <meta
          name="twitter:description"
          content="Subscribe to the Fantome Technologies newsletter for company updates, ecosystem developments, platform news, and announcements."
        />

        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <link
          rel="canonical"
          href="https://fantometechnologies.com/newsletter"
        />
      </Helmet>

      <Navbar />

      <main>
        <NewsletterHero />
        <NewsletterIntro />
        <NewsletterHighlights />
        <NewsletterSignup />
        <NewsletterFAQ />
      </main>

      <Footer />
    </div>
  );
}
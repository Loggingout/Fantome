import { Helmet } from "react-helmet-async";

import Navbar from "../../../components/header/Navbar";
import Footer from "../../../components/footer/Footer";

import ContactHero from "../components/company/contact/ContactHero";
import ContactIntro from "../components/company/contact/ContactIntro";
import ContactInquiryGrid from "../components/company/contact/ContactInquiryGrid";
import ContactForm from "../components/company/contact/ContactForm";
import ContactFAQ from "../components/company/contact/ContactFAQ";
import ContactCTA from "../components/company/contact/ContactCTA";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Helmet>
        <title>Contact | Fantome Technologies</title>

        <meta
          name="description"
          content="Contact Fantome Technologies about our company, ecosystem, platforms, partnerships, opportunities, and other company-level inquiries."
        />

        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Contact | Fantome Technologies"
        />

        <meta
          property="og:description"
          content="Contact Fantome Technologies about our company, ecosystem, platforms, partnerships, opportunities, and other company-level inquiries."
        />

        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content="https://fantometechnologies.com/contact"
        />

        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Contact | Fantome Technologies"
        />

        <meta
          name="twitter:description"
          content="Contact Fantome Technologies about our company, ecosystem, platforms, partnerships, opportunities, and other company-level inquiries."
        />

        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <link
          rel="canonical"
          href="https://fantometechnologies.com/contact"
        />
      </Helmet>

      <Navbar />

      <main>
        <ContactHero />
        <ContactIntro />
        <ContactInquiryGrid />
        <ContactForm />
        <ContactFAQ />
        <ContactCTA />
      </main>

      <Footer />
    </div>
  );
}
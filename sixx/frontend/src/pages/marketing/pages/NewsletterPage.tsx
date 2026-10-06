import SEOHead from "../../../components/SEOHead";

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
      <SEOHead
        title="New Blog Post Emails"
        description="Subscribe to get an email when Fantome Technologies publishes a new blog article."
        path="/newsletter"
      />

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
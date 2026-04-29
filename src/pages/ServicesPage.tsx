import Navbar from "../components/header/Navbar";
import RequestQuoteButton from "../components/buttons/RequestQuoteButton";
import BookingForm from "../components/forms/BookingForm";
import DiscoveryDropdown from "../components/dropdowns/DiscoveryDropdown";
import FAQDropdown from "../components/dropdowns/FAQDropdown";
import Footer from "../components/footer/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Code, Palette, TrendingUp, Shield, Award, Zap } from "lucide-react";

export default function ServicesPage() {
  const navigate = useNavigate();
  const [showRequestQuote, setShowRequestQuote] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowRequestQuote(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Web Design & Development Services | Fantome Technologies</title>
        <meta
          name="description"
          content="Explore Fantome Technologies' web development, landing page design, SEO optimization, and website management services built to convert visitors into customers."
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Web Design & Development Services | Fantome Technologies"
        />
        <meta
          property="og:description"
          content="Explore Fantome Technologies' web development, landing page design, SEO optimization, and website management services built to convert visitors into customers."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://fantometechnologies.com/services"
        />
        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Web Design & Development Services | Fantome Technologies"
        />
        <meta
          name="twitter:description"
          content="Explore Fantome Technologies' web development, landing page design, SEO optimization, and website management services built to convert visitors into customers."
        />
        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />
        <link rel="canonical" href="https://fantometechnologies.com/services" />
      </Helmet>

      <Navbar
        onBookNow={() => setShowForm(true)}
        onAboutUs={() => navigate("/about")}
        onRequestQuote={() => navigate("/request-quote")}
        onTestimonial={() => navigate("/testimonials")}
      />

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-8 py-24">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Our Services
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <Code className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Modern Website Development
            </h3>
            <p className="text-gray-600">
              We build fast, modern web apps using proven technologies that
              actually work for your users—not just whatever's trendy.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-200 hover:border-pink-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20">
            <Zap className="w-12 h-12 text-pink-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Sleek Landing Pages
            </h3>
            <p className="text-gray-600">
              Landing pages that get people to stop scrolling and take action.
              Clean design, clear message, real results
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <Palette className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Website Design Overhauls
            </h3>
            <p className="text-gray-600">
              Your website deserves better. We'll redesign it from the ground up
              to match where your brand is today—and where it's going.
            </p>
          </div>
        </div>

        {/**Discovery Dropdown */}
        <div className="max-w-4xl mx-auto mb-24">
          <DiscoveryDropdown />
        </div>

        {/* Management Tiers */}
        <h3 className="text-4xl font-bold text-center mb-12 mt-24 text-gray-900">
          Website Management
        </h3>
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-300 hover:border-gray-400 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <Shield className="w-10 h-10 text-gray-600 mb-4" />
            <h4 className="text-2xl font-bold mb-2 text-gray-900">Silver</h4>
            <p className="text-4xl font-bold mb-4 text-gray-900">
              $80<span className="text-lg text-gray-500">/month</span>
            </p>
            <p className="text-black mb-4 font-semibold">
              No long-term contracts. Cancel anytime.
            </p>
            <ul className="mt-4 space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li>Hosting & uptime monitoring</li>
              <li>Security updates</li>
              <li>Minor content changes</li>
              <li>Email support</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl border border-yellow-300 hover:border-yellow-400 transition-all duration-300 hover:scale-105 shadow-xl shadow-yellow-500/10 relative">
            <div className="absolute -top-4 right-8 bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-1 rounded-full text-sm font-bold text-white">
              POPULAR
            </div>
            <Award className="w-10 h-10 text-yellow-600 mb-4" />
            <h4 className="text-2xl font-bold mb-2 text-gray-900">Gold</h4>
            <p className="text-4xl font-bold mb-4 text-gray-900">
              $100<span className="text-lg text-gray-500">/month</span>
            </p>
            <p className="text-black mb-4 font-semibold">
              No long-term contracts. Cancel anytime.
            </p>
            <ul className="mt-4 space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li>Everything in Silver</li>
              <li>Priority updates</li>
              <li>Performance monitoring</li>
              <li>Monthly check-ins</li>
            </ul>
          </div>
        </div>

        {/* Traffic Enhancement */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-12 rounded-2xl border border-pink-300 hover:border-pink-400 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <TrendingUp className="w-12 h-12 text-pink-600 mb-4" />
              <h3 className="text-3xl font-bold mb-3 text-gray-900">
                Website Traffic Enhancement
              </h3>
              <p className="text-black mb-4 font-semibold">
                No long-term contracts. Cancel anytime.
              </p>
              <ul className="mt-4 space-y-2 text-gray-600 text-sm/8 list-disc list-inside">
                <li>
                  Keyword optimization that targets the search terms your
                  customers are actually using to find businesses like yours
                </li>
                <li>
                  Technical SEO improvements to help search engines crawl and
                  rank your site more effectively
                </li>
                <li>
                  Content strategy and optimization that answers your audience's
                  questions and positions you as the go-to solutionContent
                  strategy and optimization that answers your audience's
                  questions and positions you as the go-to solution
                </li>
                <li>
                  Monthly performance reports showing traffic growth, keyword
                  rankings, and exactly what's driving results
                </li>
                <li>
                  Ongoing adjustments based on algorithm changes and competitor
                  activity—your SEO doesn't go stale
                </li>
              </ul>
            </div>
            <div className="text-center md:text-right">
              <p className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                $160
              </p>
              <p className="text-gray-500 text-lg">/month</p>
            </div>
          </div>
        </div>
      </div>

      {/*FQA Dropdown*/}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <FAQDropdown />
      </div>

      {/* Booking Form Modal */}
      {showForm && (
        <BookingForm isModal={true} onClose={() => setShowForm(false)} />
      )}

      {/* Return Home Button */}
      {showRequestQuote && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <RequestQuoteButton onClick={() => navigate("/request-quote")} />
        </motion.div>
      )}
      <Footer />
    </div>
  );
}

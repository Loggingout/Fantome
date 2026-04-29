import Navbar from "../components/header/Navbar";
import RequestQuoteButton from "../components/buttons/RequestQuoteButton";
import BookingForm from "../components/forms/BookingForm";
import Footer from "../components/footer/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import StudioImg from "../assets/ft-studio.png";
import CompanyTeam from "../assets/FTCompanyTeam.png";
import MeImg from "../assets/me.jpg";
import {
  Building2,
  Code2,
  Users,
  MapPin,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutUsPage() {
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
    <div className="min-h-screen bg-white text-gray-900">
      <Helmet>
        <title>About Us | Fantome Technologies</title>
        <meta
          name="description"
          content="Learn more about Fantome Technologies, a small web development studio focused on building high-quality, performance-driven digital experiences."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="About Us | Fantome Technologies" />
        <meta
          property="og:description"
          content="Learn more about Fantome Technologies, a small web development studio focused on building high-quality, performance-driven digital experiences."
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
        <meta name="twitter:title" content="About Us | Fantome Technologies" />
        <meta
          name="twitter:description"
          content="Learn more about Fantome Technologies, a small web development studio focused on building high-quality, performance-driven digital experiences."
        />
        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />
        <link rel="canonical" href="https://fantometechnologies.com/about" />
      </Helmet>

      {/* Navbar */}
      <Navbar
        onBookNow={() => setShowForm(true)}
        onAboutUs={() => navigate("/about")}
        onRequestQuote={() => navigate("/request-quote")}
        onTestimonial={() => navigate("/testimonials")}
      />

      {/* Hero Section */}
      <motion.section
        className="max-w-7xl mx-auto px-6 py-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          About <span className="text-purple-600">Fantome Technologies</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          A modern web development studio focused on building high-quality,
          performance-driven digital experiences.
        </p>
      </motion.section>

      {/* Company Info Grid */}
      <motion.section
        className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Building2 className="w-7 h-6 text-purple-600 mt-1 shrink-0" />
            <div>
              <h3 className="text-2xl font-semibold mb-2">What We Do</h3>
              <p className="text-gray-600">
                Fantome Technologies specializes in professional website
                development, sleek landing pages, and full website redesigns
                tailored to modern businesses.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Calendar className="w-6 h-6 text-purple-600 mt-1 shrink-0" />
            <div>
              <h3 className="text-2xl font-semibold mb-2">Founded</h3>
              <p className="text-gray-600">
                Opened in <strong>December 2024</strong> with a focus on clean
                design, strong branding, and scalable architecture.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Users className="w-6 h-6 text-purple-600 mt-1 shrink-0" />
            <div>
              <h3 className="text-2xl font-semibold mb-2">Team</h3>
              <p className="text-gray-600">
                A focused, one-developer studio - meaning your project gets
                direct attention, faster turnaround, and zero middleman.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-purple-600 mt-1 shrink-0" />
            <div>
              <h3 className="text-2xl font-semibold mb-2">Location</h3>
              <p className="text-gray-600">
                Based in <strong>Colorado</strong>, serving clients locally and
                nationwide.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 shrink-0 text-purple-600 mt-1" />
          <div>
            <h3 className="text-2xl font-semibold mb-2">Why Trust Us?</h3>
            <p className="text-gray-600">
              We don't cut corners. You'll get clean code that's built to last,
              straight communication throughout the process, and solutions that
              actually scale with your business. No unnecessary complexity, no
              hidden gotchas—just honest work that performs.
            </p>
          </div>
        </div>

        <motion.div
          className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img
            src={StudioImg}
            alt="Fantome Technologies Studio"
            className="w-full h-full object-cover rounded-2xl"
          />
        </motion.div>
      </motion.section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => {
            const cardData = [
              {
                icon: <Code2 className="w-10 h-10 text-purple-600 mb-4" />,
                title: "Clean Code",
                text: "Built to grow with your business, load fast for your customers, and save you money on future updates.",
              },
              {
                icon: <Users className="w-10 h-10 text-purple-600 mb-4" />,
                title: "Client-Focused",
                text: "You'll work directly with us—no middlemen, no surprises, just clear communication from start to finish.",
              },
              {
                icon: <Building2 className="w-10 h-10 text-purple-600 mb-4" />,
                title: "Built to Grow",
                text: "Built to grow with you. When your business changes, your website adapts—no expensive rebuilds needed.",
              },
            ][i - 1];

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
                className="relative p-8 rounded-2xl shadow-sm bg-gradient-to-br from-gray-900 via-gray-700 to-gray-400 
                           hover:ring-4 hover:ring-purple-600 transition-all duration-300"
              >
                <span className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {i}
                </span>
                {cardData.icon}
                <h4 className="text-xl font-semibold mb-2 text-white">
                  {cardData.title}
                </h4>
                <p className="text-gray-200">{cardData.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Extra Image Section */}
      <motion.section
        className="max-w-7xl mx-auto px-6 py-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative w-full h-80 md:h-[28rem] overflow-hidden rounded-2xl">
          <motion.img
            src={MeImg}
            alt="Fantome Technologies Team"
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105 focus:scale-105"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </motion.section>

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
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <RequestQuoteButton onClick={() => navigate("/request-quote")} />
        </motion.div>
      )}

      <Footer />
    </div>
  );
}

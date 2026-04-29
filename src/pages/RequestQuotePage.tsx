import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

import Navbar from "../components/header/Navbar";
import RequestQuoteForm from "../components/forms/RequestQuoteForm";
import ReturnHomeButton from "../components/buttons/ReturnHomeButton";
import BookingForm from "../components/forms/BookingForm";
import Footer from "../components/footer/Footer";

export default function RequestQuotePage() {
  const navigate = useNavigate();
  const [showReturnHome, setShowReturnHome] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled =
        window.scrollY + window.innerHeight >= document.body.scrollHeight - 120;

      setShowReturnHome(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Motion variants for page fade-in
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Motion variants for Return Home button fade-in
  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <Helmet>
        <title>Request a Quote | Fantome Technologies</title>
        <meta
          name="description"
          content="Request a personalized quote for our web design and development services. Fill out the form to get started on your custom website project with Fantome Technologies."
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Request a Quote | Fantome Technologies"
        />
        <meta
          property="og:description"
          content="Request a personalized quote for our web design and development services. Fill out the form to get started on your custom website project with Fantome Technologies."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://fantometechnologies.com/request-quote"
        />
        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Request a Quote | Fantome Technologies"
        />
        <meta
          name="twitter:description"
          content="Request a personalized quote for our web design and development services. Fill out the form to get started on your custom website project with Fantome Technologies."
        />
        <meta
          name="twitter:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />
        <link
          rel="canonical"
          href="https://fantometechnologies.com/request-quote"
        />
      </Helmet>

      <Navbar
        onBookNow={() => setShowForm(true)}
        onAboutUs={() => navigate("/about")}
        onRequestQuote={() => navigate("/request-quote")}
        onTestimonial={() => navigate("/testimonials")}
      />

      <div className="max-w-3xl md:h-screen mx-auto px-6 py-24 ">
        <RequestQuoteForm />
      </div>

      {/* Booking Form Modal */}
      {showForm && (
        <BookingForm isModal={true} onClose={() => setShowForm(false)} />
      )}

      {/* Return Home Button with fade-in animation */}
      {showReturnHome && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          initial="hidden"
          animate="visible"
          variants={buttonVariants}
        >
          <ReturnHomeButton onClick={() => navigate("/")} />
        </motion.div>
      )}

      <Footer />
    </motion.div>
  );
}

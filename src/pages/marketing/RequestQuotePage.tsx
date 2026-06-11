import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

import Navbar from "../../components/header/Navbar";
import RequestQuoteForm from "../../components/forms/RequestQuoteForm";
import ReturnHomeButton from "../../components/buttons/ReturnHomeButton";
import BookingForm from "../../components/forms/BookingForm";
import Footer from "../../components/footer/Footer";

export default function RequestQuotePage() {
  const navigate = useNavigate();
  const [showReturnHome, setShowReturnHome] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled =
        window.scrollY + window.innerHeight >=
        document.body.scrollHeight - 120;

      setShowReturnHome(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: "easeOut",
      },
    }),
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div
      className="min-h-screen bg-neutral-950 text-white"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
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
          content="Request a personalized quote for our web design and development services."
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
          content="Request a personalized quote for our web design and development services."
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar
          onBookNow={() => setShowForm(true)}
          onAboutUs={() => navigate("/about")}
          onRequestQuote={() => navigate("/request-quote")}
          onTestimonial={() => navigate("/testimonials")}
        />

        {/* Hero */}
        <motion.section
          className="pt-20 pb-14 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          {/* Label pill */}
          <span className="inline-block mb-5 px-4 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs tracking-widest uppercase">
            Start Your Project
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mb-5">
            Request a{" "}
            <span className="text-neutral-400 font-normal italic">
              Custom Quote
            </span>
          </h1>

          <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Tell us about your project, goals, and vision. We’ll provide a
            tailored quote designed specifically for your business needs.
          </p>

          {/* Divider */}
          <div className="mt-10 mx-auto w-16 h-px bg-neutral-700" />
        </motion.section>

        {/* Form Container */}
        <motion.section
          className="pb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
        >
          <div className="max-w-4xl mx-auto">
            <div
              className="
                rounded-3xl
                border border-neutral-800
                bg-neutral-900/70
                backdrop-blur-sm
                p-5 sm:p-8 md:p-10
                shadow-[0_8px_40px_rgba(0,0,0,0.35)]
              "
            >
              <RequestQuoteForm />
            </div>
          </div>
        </motion.section>
      </div>

      {/* Booking Form Modal */}
      {showForm && (
        <BookingForm
          isModal={true}
          onClose={() => setShowForm(false)}
        />
      )}

      <Footer />
    </div>
  );
}
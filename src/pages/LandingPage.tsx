/**Landing Page */
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BookingForm from '../components/forms/BookingForm';
import Navbar from '../components/header/Navbar';
import HeroImage from '../assets/Dashboard display (3).png'
import ServiceButton from '../components/buttons/ServicesButton';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const LandingPage = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // Animation variants for hero content
  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.8, ease: 'easeOut' },
    }),
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Helmet>
        <title>Fantome Technologies | Web Development & Design Studio</title>
        <meta
          name="description"
          content="Fast, conversion-focused websites built for local businesses. Get more calls, leads, and customers with Fantome Technologies."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Fantome Technologies | Web Development & Design Studio" />
        <meta property="og:description" content="Fast, conversion-focused websites built for local businesses. Get more calls, leads, and customers with Fantome Technologies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fantometechnologies.com" />
        <meta property="og:image" content="https://fantometechnologies.com/New%20Logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fantome Technologies | Web Development & Design Studio" />
        <meta name="twitter:description" content="Fast, conversion-focused websites built for local businesses. Get more calls, leads, and customers with Fantome Technologies." />
        <meta name="twitter:image" content="https://fantometechnologies.com/New%20Logo.png" />
        <link rel="canonical" href="https://fantometechnologies.com" />
      </Helmet>

      {/* Full-Page Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 blur">
          <img
            src={HeroImage}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Navbar */}
        <div className="relative z-20">
          <Navbar 
            onBookNow={() => setShowForm(true)} 
            onAboutUs={() => navigate('/about')}
            onRequestQuote={() => navigate('/request-quote')}
            onTestimonial={() => navigate('/testimonials')}
          />
        </div>

        {/* Centered Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-8">
          <div className="text-center max-w-5xl">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent"
              variants={heroVariants}
              custom={0} // first element
              initial="hidden"
              animate="visible"
            >
              We build fast, conversion-focused websites that help local businesses get more calls, leads, and customers.
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto"
              variants={heroVariants}
              custom={1} // second element
              initial="hidden"
              animate="visible"
            >
              Transform your vision into stunning web experiences that captivate and convert
            </motion.p>
            <motion.div
              variants={heroVariants}
              custom={2} // third element
              initial="hidden"
              animate="visible"
            >
              <ServiceButton onClick={() => navigate('/services')} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showForm && (
        <BookingForm 
          isModal={true}
          onClose={() => setShowForm(false)} 
        />
      )}
    </motion.div>
  );
};

export default LandingPage;

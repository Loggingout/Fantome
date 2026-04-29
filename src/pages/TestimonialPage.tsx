import Navbar from "../components/header/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BookingForm from "../components/forms/BookingForm";
import GalleryTestimonial from "../components/testimonials/galleryTestimonial";
import ClientTestimonial from "../components/testimonials/clientTestimonial";
import Footer from "../components/footer/Footer";
import ReturnHomeButton from "../components/buttons/ReturnHomeButton";
import { motion } from "framer-motion"

export default function TestimonialPage() {
  const [showForm, setShowForm] = useState(false);
  const [showReturnHome, setShowReturnHome] = useState(true);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navbar */}
        <Navbar
          onBookNow={() => setShowForm(true)}
          onAboutUs={() => navigate("/about")}
          onRequestQuote={() => navigate("/request-quote")}
          onTestimonial={() => navigate("/testimonials")}
        />
        {/* Page Title */}
        <div className="mt-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6 text-shadow-lg">
            Real Client Testimonials
          </h1>
          <p className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center text-xl font-semibold">
            Hear what our Client's have to say about our work!
          </p>
        </div>

        {/* Gallery Section */}
        <section className="flex flex-col items-center gap-10">
          <GalleryTestimonial
            beforeImages={[
              "/old.png",
              "/old-1.png",
              "/old-2.png",
              "/old-3.png",
            ]}
            afterImages={[
              "/new.png",
              "/new-1.png",
              "/new-2.png",
              "/new-3.png",
              "/new-4.png",
              "/new-5.png",
              "/new-6.png",
            ]}
          />
        </section>

        {/* Optional Future Testimonial Cards */}
        <section className="mt-10 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-12 max-w-5xl w-full">
            {/* Enlarged testimonial cards */}
            <ClientTestimonial
              testimonials={[
                {
                  logo: "/cheerful-cup.png",
                  name: "A Cheerful Cup",
                  comment:
                    "Fantome Technologies built our website beautifully and on time! I recently subscribed to their gold tier in website management services. I love the monthly check-in's. Our website use to have troubles loading our images and it didn't have the personaility we wanted. We don't have that problem anymore. ",
                },
              ]}
            />
          </div>
        </section>
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
    </div>
  );
}

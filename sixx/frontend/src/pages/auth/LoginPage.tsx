import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import BookingForm from "../../components/forms/BookingForm";
import LoginForm from "../../components/auth/LoginForm";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.6 },
  }),
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Wire your auth logic here
    console.log("Login attempt:", email, password);
  };

  return (
    <div
      className="min-h-screen bg-neutral-950 text-white flex flex-col"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Navbar */}
        <Navbar
          onBookNow={() => setShowForm(true)}
          onAboutUs={() => navigate("/about")}
          onRequestQuote={() => navigate("/request-quote")}
          onTestimonial={() => navigate("/testimonials")}
        />
      </div>

      {/* Page body — grows to fill height and centers the form */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-full max-w-md">

          {/* Hero text above the form */}
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs tracking-widest uppercase">
              Staff Access
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-white mb-3">
              Employee{" "}
              <span className="text-neutral-400 font-normal italic">
                Login
              </span>
            </h1>

            <p className="text-neutral-500 text-sm leading-relaxed">
              Restricted to Fantome Technologies team members only.
            </p>

            <div className="mt-6 mx-auto w-16 h-px bg-neutral-700" />
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            <LoginForm onSubmit={handleLogin} />
          </motion.div>

          {/* Back link */}
          <motion.div
            className="text-center mt-6"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            <button
              onClick={() => navigate("/")}
              className="text-neutral-600 text-xs tracking-widest uppercase hover:text-neutral-400 transition-colors duration-200"
            >
              ← Return Home
            </button>
          </motion.div>

        </div>
      </main>

      {/* Booking Form Modal */}
      {showForm && (
        <BookingForm isModal={true} onClose={() => setShowForm(false)} />
      )}

      <Footer />
    </div>
  );
}
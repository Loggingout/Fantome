
import { motion } from "framer-motion";
import Logo from '/new-logo.png';
import { useNavigate } from "react-router-dom";

export default function FourOFourPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Logo */}
      <img src={Logo} alt="Fantome Technologies Logo" className="h-32 w-auto mb-6 animate-[fadeIn_1s_ease-out]" />

      {/* 404 Message */}
      <h1 className="text-6xl md:text-8xl font-bold text-purple-600 mb-4">404</h1>
      <h3 className="text-lg md:text-xl text-gray-600 mb-8 text-center">
        Oops! The page you’re looking for doesn’t exist.
      </h3>
      <p className="text-sm sm:text-sm text-gray-600 mb-8 text-center">
        Our dev team will have this page ready soon — in the meantime, feel free to explore our homepage and discover how Fantome Technologies can help elevate your online presence 💻.
      </p>
      
      {/* Back Home Button */}
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-300"
      >
        Go Back Home
      </button>
    </motion.div>
  );
}

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import BookingForm from "../../components/forms/BookingForm";
import BlogHero from "../../components/blog/BlogHero";

export default function BlogPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  return (
    <div
      className="min-h-screen bg-neutral-950 text-white"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navbar */}
        <Navbar
          onBookNow={() => setShowForm(true)}
          onAboutUs={() => navigate("/about")}
          onRequestQuote={() => navigate("/request-quote")}
          onTestimonial={() => navigate("/testimonials")}
        />

        {/* Hero */}
        <BlogHero />
      </div>

      {/* Booking Form Modal */}
      {showForm && (
        <BookingForm isModal={true} onClose={() => setShowForm(false)} />
      )}

      <Footer />
    </div>
  );
}
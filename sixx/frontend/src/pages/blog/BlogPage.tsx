// src/pages/blog/BlogPage.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import BookingForm from "../../components/forms/BookingForm";

import BlogHero from "../../components/blog/BlogHero";
import BlogSearch from "../../components/blog/BlogSearch";
import BlogCategoryFilter from "../../components/blog/BlogCategoryFilter";
import FeaturedPost from "../../components/blog/FeaturedPost";
import BlogGrid from "../../components/blog/BlogGrid";
import BlogSidebar from "../../components/blog/BlogSidebar";

export default function BlogPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  return (
    <div
      className="min-h-screen bg-neutral-950 text-white"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Main Container */}
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

        {/* Search + Categories */}
        <div className="mt-10 flex flex-col gap-6">
          <BlogSearch />
          <BlogCategoryFilter />
        </div>

        {/* Featured Post */}
        <div className="mt-12">
          <FeaturedPost />
        </div>

        {/* Blog Grid + Sidebar */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Blog Grid */}
          <div className="lg:col-span-8">
            <BlogGrid />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <BlogSidebar />
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showForm && (
        <BookingForm isModal={true} onClose={() => setShowForm(false)} />
      )}

      <Footer />
    </div>
  );
}

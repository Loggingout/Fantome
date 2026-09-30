
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Navbar from "../../../components/header/Navbar";
import BookingForm from "../../../components/forms/BookingForm";
import DiscoveryDropdown from "../../../components/dropdowns/DiscoveryDropdown";
import FAQDropdown from "../../../components/dropdowns/FAQDropdown";
import Footer from "../../../components/footer/Footer";

import ServicesHero from "../components/services/ServicesHero";
import ServicesStats from "../components/services/ServicesStats";
import ServiceGrid from "../components/services/ServiceGrid";
import MonthlyPlans from "../components/services/MonthlyPlans";

import type { Service } from "../data/services.data";

const API_BASE = "https://fantome.onrender.com/api";

export default function ServicesPage() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/services`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setServices(data.services);
        }
      })
      .catch(() => {});
  }, []);

  const managementPlans = services
    .filter(
      (service) =>
        service.category === "website-management" ||
        (service.category === "marketing" && service.price > 0)
    )
    .sort((a, b) => a.price - b.price);

  const serviceCards = services.filter(
    (service) =>
      service.category !== "website-management" &&
      !(
        service.category === "marketing" &&
        service.price > 0
      )
  );

  return (
    <div
      className="min-h-screen bg-neutral-950 text-white"
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <Helmet>
        <title>
          Web Design & Development Services | Fantome Technologies
        </title>

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

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:url"
          content="https://fantometechnologies.com/services"
        />

        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

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

        <link
          rel="canonical"
          href="https://fantometechnologies.com/services"
        />
      </Helmet>

      <Navbar
        onBookNow={() => setShowForm(true)}
        onAboutUs={() => navigate("/about")}
        onRequestQuote={() => navigate("/request-quote")}
        onTestimonial={() => navigate("/testimonials")}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServicesHero />

        <ServicesStats />

        <ServiceGrid services={serviceCards} />

        <div className="mx-auto mb-24 max-w-4xl">
          <DiscoveryDropdown />
        </div>

        <MonthlyPlans plans={managementPlans} />
      </main>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <FAQDropdown />
      </section>

      {showForm && (
        <BookingForm
          isModal
          onClose={() => setShowForm(false)}
        />
      )}

      <Footer />
    </div>
  );
}


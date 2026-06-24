import Navbar from "../../components/header/Navbar";
import RequestQuoteButton from "../../components/buttons/RequestQuoteButton";
import BookingForm from "../../components/forms/BookingForm";
import DiscoveryDropdown from "../../components/dropdowns/DiscoveryDropdown";
import FAQDropdown from "../../components/dropdowns/FAQDropdown";
import Footer from "../../components/footer/Footer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Code, Palette, TrendingUp, Shield, Award, Zap, BarChart3, Star, Globe, Settings, Megaphone } from "lucide-react";

// ── Icon map: maps the icon string stored in the DB to a lucide component ────
const ICON_MAP: Record<string, React.ElementType> = {
  Code, Palette, TrendingUp, Shield, Award, Zap, BarChart3, Star, Globe, Settings, Megaphone,
};
function SvcIcon({ name, className }: { name: string; className: string }) {
  const Icon = ICON_MAP[name] ?? Star;
  return <Icon className={className} />;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceUnit: string;
  priceLabel: string;
  features: string[];
  icon: string;
  colorClass: string;
  badge: string;
  isFeatured: boolean;
}

const ICON_COLORS: Record<string, string> = {
  "web-development": "text-cyan-300",
  "web-design": "text-violet-300",
  "website-management": "text-cyan-300",
  "marketing": "text-amber-300",
};

const API_BASE = "https://fantome.onrender.com/api";

export default function ServicesPage() {
  const navigate = useNavigate();
  const [showRequestQuote, setShowRequestQuote] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setShowRequestQuote(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch live services from the API (no auth required — public endpoint)
  useEffect(() => {
    fetch(`${API_BASE}/services`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setServices(data.services); })
      .catch(() => {}); // silently fall back to static content on error
  }, []);

  // Derive data from API (fall back to empty = static content renders instead)
  const managementPlans = services.filter(
    (s) => s.category === "website-management" || (s.category === "marketing" && s.price > 0)
  );
  const serviceCards = services.filter(
    (s) => s.category !== "website-management" && !(s.category === "marketing" && s.price > 0)
  );

  return (
    <div
      className="min-h-screen bg-neutral-950 text-white"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <Helmet>
        <title>Web Design & Development Services | Fantome Technologies</title>
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
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://fantometechnologies.com/services"
        />
        <meta
          property="og:image"
          content="https://fantometechnologies.com/New%20Logo.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
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
        <link rel="canonical" href="https://fantometechnologies.com/services" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar
          onBookNow={() => setShowForm(true)}
          onAboutUs={() => navigate("/about")}
          onRequestQuote={() => navigate("/request-quote")}
          onTestimonial={() => navigate("/testimonials")}
        />

        <motion.div
          className="pt-24 pb-12 text-center"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-block mb-5 px-4 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs tracking-widest uppercase">
            Services
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mb-5">
            Premium Web Services Built to
            <span className="text-neutral-400 font-normal italic"> Elevate Your Brand</span>
          </h1>

          <p className="text-neutral-400 text-lg max-w-3xl mx-auto leading-relaxed">
            From beautiful website design to reliable site management, our services help you attract attention, build trust, and convert more visitors.
          </p>

          <div className="mt-10 mx-auto w-16 h-px bg-neutral-700" />
        </motion.div>

        <motion.div
          className="mb-16 flex flex-wrap justify-center gap-10 sm:gap-16"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          {[
            ["100%", "Service Focus"],
            ["Fast", "Delivery"],
            ["Secure", "Site Care"],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="text-white text-2xl font-bold">{val}</p>
              <p className="text-neutral-500 text-xs mt-1 tracking-wide uppercase">{label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid gap-8 mb-20 md:grid-cols-3">
          {(serviceCards.length > 0 ? serviceCards : [
            { _id: "s1", name: "Modern Website Development", description: "We build fast, modern web apps with clean UX, strong performance, and the right tools for your growth.", icon: "Code", colorClass: "bg-slate-800/80 border-slate-700", category: "web-development", price: 0, priceUnit: "", priceLabel: "", features: [], badge: "", isFeatured: false },
            { _id: "s2", name: "Sleek Landing Pages", description: "Landing experiences designed to stop scrolling, convert visitors, and bring clarity to your offer.", icon: "Zap", colorClass: "bg-slate-800/80 border-slate-700", category: "web-design", price: 0, priceUnit: "", priceLabel: "", features: [], badge: "", isFeatured: false },
            { _id: "s3", name: "Website Design Overhauls", description: "Refresh your website with a polished visual system that reflects your brand and makes every page feel premium.", icon: "Palette", colorClass: "bg-slate-800/80 border-slate-700", category: "web-design", price: 0, priceUnit: "", priceLabel: "", features: [], badge: "", isFeatured: false },
            { _id: "s4", name: "Marketing Campaign Management", description: "Strategic campaign planning, execution, and optimization to reach your target audience and drive measurable results.", icon: "BarChart3", colorClass: "bg-slate-800/80 border-slate-700", category: "marketing", price: 220, priceUnit: "/month", priceLabel: "", features: [], badge: "", isFeatured: false },
          ]).map((s, i) => (
            <motion.div
              key={s._id}
              className={`rounded-4xl border ${s.colorClass} p-8 shadow-[0_16px_65px_rgba(15,23,42,0.35)] transition-transform duration-300 hover:-translate-y-1`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <SvcIcon name={s.icon} className={`w-12 h-12 mb-4 ${ICON_COLORS[s.category] ?? "text-white"}`} />
              <h3 className="text-2xl font-semibold mb-3 text-white">{s.name}</h3>
              <p className="text-neutral-300 leading-relaxed">{s.description}</p>
              {s.features.length > 0 && (
                <ul className="mt-4 space-y-2 text-neutral-400 text-sm list-disc list-inside">
                  {s.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mb-24">
          <DiscoveryDropdown />
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white">Website Management</h2>
          <p className="text-neutral-400 mt-3 max-w-2xl mx-auto">
            Flexible management plans that keep your website secure, up to date, and performing at its best.
          </p>
        </div>

        <div className="grid gap-8 mb-16 md:grid-cols-3">
          {(managementPlans.length > 0 ? managementPlans : [
            { _id: "m1", name: "Silver", price: 80, priceUnit: "/month", priceLabel: "", icon: "Shield", colorClass: "bg-neutral-900/80 border-neutral-800", badge: "", features: ["Hosting & uptime monitoring", "Security updates", "Minor content changes", "Email support"], category: "website-management", description: "", isFeatured: false },
            { _id: "m2", name: "Gold", price: 100, priceUnit: "/month", priceLabel: "", icon: "Award", colorClass: "bg-neutral-900/80 border-neutral-800", badge: "Most Popular", features: ["Everything in Silver", "Priority updates", "Performance monitoring", "Monthly check-ins"], category: "website-management", description: "", isFeatured: true },
            { _id: "m3", name: "Marketing Campaign", price: 220, priceUnit: "/month", priceLabel: "", icon: "BarChart3", colorClass: "bg-neutral-900/80 border-neutral-800", badge: "", features: ["Campaign strategy & planning", "Multi-channel execution", "Performance analytics & reporting", "Creative copywriting & assets", "Monthly optimization & adjustments"], category: "marketing", description: "", isFeatured: false },
          ]).map((plan, i) => {
            const isFeatured = plan.badge === "Most Popular" || plan.isFeatured;
            return (
              <motion.div
                key={plan._id}
                className={`relative rounded-3xl border ${isFeatured ? "border-neutral-800 bg-linear-to-br from-violet-950/90 to-fuchsia-950/90 shadow-[0_18px_70px_rgba(124,58,237,0.2)]" : "border-neutral-800 bg-neutral-900/80 shadow-[0_18px_70px_rgba(15,23,42,0.45)]"} p-8`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                {plan.badge && (
                  <div className="absolute -top-4 right-6 rounded-full bg-linear-to-r from-fuchsia-500 to-violet-500 px-4 py-1 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20">
                    {plan.badge}
                  </div>
                )}
                <SvcIcon name={plan.icon} className={`w-10 h-10 mb-4 ${isFeatured ? "text-pink-300" : ICON_COLORS[plan.category] ?? "text-cyan-300"}`} />
                <h4 className="text-2xl font-semibold mb-2 text-white">{plan.name}</h4>
                <p className={`text-5xl font-bold mb-4 ${isFeatured ? "text-white" : "text-white"}`}>
                  {plan.priceLabel ? (
                    <span className="text-3xl">{plan.priceLabel}</span>
                  ) : (
                    <>${plan.price}<span className={`text-lg ${isFeatured ? "text-neutral-300" : "text-neutral-500"}`}>{plan.priceUnit}</span></>
                  )}
                </p>
                {plan.description && <p className={`mb-5 font-medium ${isFeatured ? "text-neutral-300" : "text-neutral-300"}`}>{plan.description}</p>}
                {plan.features.length > 0 && (
                  <ul className={`space-y-3 text-sm list-disc list-inside ${isFeatured ? "text-neutral-300" : "text-neutral-400"}`}>
                    {plan.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.section
          className="rounded-4xl border border-neutral-800 bg-neutral-900/70 p-12 shadow-[0_20px_90px_rgba(15,23,42,0.45)]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <TrendingUp className="w-12 h-12 text-pink-300 mb-4" />
              <h3 className="text-3xl font-semibold text-white mb-3">Website Traffic Enhancement</h3>
              <p className="text-neutral-300 mb-6 max-w-2xl leading-relaxed">
                Keyword optimization, technical SEO, and content strategy work together to help your business show up where customers are already searching.
              </p>
              <ul className="space-y-3 text-neutral-400 text-sm list-disc list-inside">
                <li>Keyword targeting that matches real customer search behavior</li>
                <li>Technical SEO that helps search engines crawl and rank your site</li>
                <li>Content strategy that positions your brand as the best solution</li>
                <li>Monthly reporting on growth, rankings, and results</li>
                <li>Ongoing adjustments for algorithm changes and competitor activity</li>
              </ul>
            </div>
            <div className="text-center lg:text-right">
              <p className="text-5xl font-bold bg-linear-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
                $160
              </p>
              <p className="text-neutral-500 text-lg">/month</p>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <FAQDropdown />
      </div>

      {showForm && <BookingForm isModal={true} onClose={() => setShowForm(false)} />}

      <Footer />
    </div>
  );
}

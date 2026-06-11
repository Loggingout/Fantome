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
import { Code, Palette, TrendingUp, Shield, Award, Zap, BarChart3 } from "lucide-react";

export default function ServicesPage() {
  const navigate = useNavigate();
  const [showRequestQuote, setShowRequestQuote] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowRequestQuote(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textCards = [
    {
      icon: <Code className="w-12 h-12 text-cyan-300 mb-4" />,
      title: "Modern Website Development",
      description:
        "We build fast, modern web apps with clean UX, strong performance, and the right tools for your growth.",
      colorClass: "bg-slate-800/80 border-slate-700",
    },
    {
      icon: <Zap className="w-12 h-12 text-fuchsia-300 mb-4" />,
      title: "Sleek Landing Pages",
      description:
        "Landing experiences designed to stop scrolling, convert visitors, and bring clarity to your offer.",
      colorClass: "bg-slate-800/80 border-slate-700",
    },
    {
      icon: <Palette className="w-12 h-12 text-violet-300 mb-4" />,
      title: "Website Design Overhauls",
      description:
        "Refresh your website with a polished visual system that reflects your brand and makes every page feel premium.",
      colorClass: "bg-slate-800/80 border-slate-700",
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-amber-300 mb-4" />,
      title: "Marketing Campaign Management",
      description:
        "Strategic campaign planning, execution, and optimization to reach your target audience and drive measurable results.",
      colorClass: "bg-slate-800/80 border-slate-700",
    },
  ];

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
          {textCards.map((card) => (
            <motion.div
              key={card.title}
              className={`rounded-4xl border ${card.colorClass} p-8 shadow-[0_16px_65px_rgba(15,23,42,0.35)] transition-transform duration-300 hover:-translate-y-1`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {card.icon}
              <h3 className="text-2xl font-semibold mb-3 text-white">{card.title}</h3>
              <p className="text-neutral-300 leading-relaxed">{card.description}</p>
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
          <motion.div
            className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-8 shadow-[0_18px_70px_rgba(15,23,42,0.45)]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Shield className="w-10 h-10 text-cyan-300 mb-4" />
            <h4 className="text-2xl font-semibold mb-2 text-white">Silver</h4>
            <p className="text-5xl font-bold mb-4 text-white">
              $80 <span className="text-neutral-500 text-lg">/month</span>
            </p>
            <p className="text-neutral-300 mb-5 font-medium">No long-term contracts. Cancel anytime.</p>
            <ul className="space-y-3 text-neutral-400 text-sm list-disc list-inside">
              <li>Hosting & uptime monitoring</li>
              <li>Security updates</li>
              <li>Minor content changes</li>
              <li>Email support</li>
            </ul>
          </motion.div>

          <motion.div
            className="relative rounded-3xl border border-neutral-800 bg-linear-to-br from-violet-950/90 to-fuchsia-950/90 p-8 shadow-[0_18px_70px_rgba(124,58,237,0.2)]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <div className="absolute -top-4 right-6 rounded-full bg-linear-to-r from-fuchsia-500 to-violet-500 px-4 py-1 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20">
              Most Popular
            </div>
            <Award className="w-10 h-10 text-pink-300 mb-4" />
            <h4 className="text-2xl font-semibold mb-2 text-white">Gold</h4>
            <p className="text-5xl font-bold mb-4 text-white">
              $100 <span className="text-neutral-300 text-lg">/month</span>
            </p>
            <p className="text-neutral-300 mb-5 font-medium">No long-term contracts. Cancel anytime.</p>
            <ul className="space-y-3 text-neutral-300 text-sm list-disc list-inside">
              <li>Everything in Silver</li>
              <li>Priority updates</li>
              <li>Performance monitoring</li>
              <li>Monthly check-ins</li>
            </ul>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-8 shadow-[0_18px_70px_rgba(15,23,42,0.45)]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <BarChart3 className="w-10 h-10 text-amber-300 mb-4" />
            <h4 className="text-2xl font-semibold mb-2 text-white">Marketing Campaign</h4>
            <p className="text-5xl font-bold mb-4 text-white">
              $220 <span className="text-neutral-500 text-lg">/month</span>
            </p>
            <p className="text-neutral-300 mb-5 font-medium">No long-term contracts. Cancel anytime.</p>
            <ul className="space-y-3 text-neutral-400 text-sm list-disc list-inside">
              <li>Campaign strategy & planning</li>
              <li>Multi-channel execution</li>
              <li>Performance analytics & reporting</li>
              <li>Creative copywriting & assets</li>
              <li>Monthly optimization & adjustments</li>
            </ul>
            <p className="text-neutral-300 italic text-xs mt-6 pt-6 border-t border-neutral-700">
              <span className="font-semibold text-amber-300">Corporate packages available:</span> For enterprise solutions, reach out via email. Highly recommended.
            </p>
          </motion.div>
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

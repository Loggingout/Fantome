import Navbar from "../../components/header/Navbar";
import RequestQuoteButton from "../../components/buttons/RequestQuoteButton";
import BookingForm from "../../components/forms/BookingForm";
import Footer from "../../components/footer/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import StudioImg from "../../assets/ft-studio.png";
import MeImg from "../../assets/me.jpg";
import {
  Building2,
  Code2,
  Users,
  MapPin,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

// Subtle muted tones for info cards — dark-friendly, not pastel
const CARD_ACCENTS = [
  "bg-neutral-800 border border-neutral-700",
  "bg-zinc-800 border border-zinc-700",
  "bg-stone-800 border border-stone-700",
  "bg-neutral-900 border border-neutral-600",
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.42, 0, 0.58, 1] // cubic-bezier equivalent of easeOut
    },
  }),
};


const infoItems = [
  {
    icon: Building2,
    title: "What We Do",
    text: "Fantome Technologies specializes in professional website development, sleek landing pages, and full website redesigns tailored to modern businesses.",
  },
  {
    icon: Calendar,
    title: "Founded",
    text: "Opened in December 2024 with a focus on clean design, strong branding, and scalable architecture.",
  },
  {
    icon: Users,
    title: "Team",
    text: "A focused, one-developer studio — meaning your project gets direct attention, faster turnaround, and zero middleman.",
  },
  {
    icon: MapPin,
    title: "Location",
    text: "Based in Colorado, serving clients locally and nationwide.",
  },
];

const valueCards = [
  {
    icon: Code2,
    title: "Clean Code",
    text: "Built to grow with your business, load fast for your customers, and save you money on future updates.",
    tag: "01",
  },
  {
    icon: Users,
    title: "Client-Focused",
    text: "You'll work directly with us — no middlemen, no surprises, just clear communication from start to finish.",
    tag: "02",
  },
  {
    icon: Building2,
    title: "Built to Grow",
    text: "When your business changes, your website adapts — no expensive rebuilds needed.",
    tag: "03",
  },
];

export default function AboutUsPage() {
  const navigate = useNavigate();
  const [showRequestQuote, setShowRequestQuote] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowRequestQuote(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen bg-neutral-950 text-white"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <Helmet>
        <title>About Us | Fantome Technologies</title>
        <meta
          name="description"
          content="Learn more about Fantome Technologies, a small web development studio focused on building high-quality, performance-driven digital experiences."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="About Us | Fantome Technologies" />
        <meta
          property="og:description"
          content="Learn more about Fantome Technologies, a small web development studio focused on building high-quality, performance-driven digital experiences."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fantometechnologies.com/about" />
        <meta property="og:image" content="https://fantometechnologies.com/New%20Logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Fantome Technologies" />
        <meta name="twitter:description" content="Learn more about Fantome Technologies, a small web development studio focused on building high-quality, performance-driven digital experiences." />
        <meta name="twitter:image" content="https://fantometechnologies.com/New%20Logo.png" />
        <link rel="canonical" href="https://fantometechnologies.com/about" />
      </Helmet>

      {/* Navbar */}
      <Navbar
        onBookNow={() => setShowForm(true)}
        onAboutUs={() => navigate("/about")}
        onRequestQuote={() => navigate("/request-quote")}
        onTestimonial={() => navigate("/testimonials")}
      />

      {/* ── Hero ── */}
      <motion.section
        className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        {/* Subtle label pill */}
        <span className="inline-block mb-5 px-4 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs tracking-widest uppercase">
          Who We Are
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-6">
          Fantome{" "}
          <span className="text-neutral-400 font-normal italic">
            Technologies
          </span>
        </h1>

        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          A modern web development studio focused on building high-quality,
          performance-driven digital experiences.
        </p>

        {/* Divider line */}
        <div className="mt-12 mx-auto w-16 h-px bg-neutral-700" />
      </motion.section>

      {/* ── Info Cards Grid ── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {infoItems.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              className={`${CARD_ACCENTS[i % CARD_ACCENTS.length]} rounded-2xl p-6 flex flex-col gap-3`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i * 0.5}
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-neutral-700/50">
                  <Icon className="w-5 h-5 text-neutral-300" />
                </span>
                <h3 className="text-base font-semibold text-white tracking-wide">
                  {title}
                </h3>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Trust / Studio Image split ── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Trust card */}
          <motion.div
            className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8 flex flex-col justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl bg-neutral-700/50">
                  <ShieldCheck className="w-5 h-5 text-neutral-300" />
                </span>
                <h3 className="text-base font-semibold text-white tracking-wide">
                  Why Trust Us?
                </h3>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                We don't cut corners. You'll get clean code that's built to
                last, straight communication throughout the process, and
                solutions that actually scale with your business. No unnecessary
                complexity, no hidden gotchas — just honest work that performs.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-neutral-700 flex gap-8">
              {[["2024", "Founded"], ["100%", "Direct Access"], ["CO", "Based"]].map(
                ([val, label]) => (
                  <div key={label}>
                    <p className="text-white text-xl font-bold">{val}</p>
                    <p className="text-neutral-500 text-xs mt-0.5">{label}</p>
                  </div>
                )
              )}
            </div>
          </motion.div>

          {/* Studio image */}
          <motion.div
            className="rounded-2xl overflow-hidden min-h-[260px]"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <img
              src={StudioImg}
              alt="Fantome Technologies Studio"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Values Cards ── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Our{" "}
          <span className="text-neutral-400 font-normal italic">
            Principles
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {valueCards.map(({ icon: Icon, title, text, tag }, i) => (
            <motion.div
              key={title}
              className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-7
                         hover:border-neutral-600 hover:bg-neutral-800 transition-all duration-300 group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i * 0.4}
              whileHover={{ y: -4 }}
            >
              <span className="absolute top-5 right-5 text-neutral-700 text-xs font-mono group-hover:text-neutral-500 transition-colors">
                {tag}
              </span>
              <span className="mb-5 inline-flex p-2.5 rounded-xl bg-neutral-800 group-hover:bg-neutral-700 transition-colors">
                <Icon className="w-6 h-6 text-neutral-300" />
              </span>
              <h4 className="text-white font-semibold text-base mb-2">{title}</h4>
              <p className="text-neutral-500 text-sm leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Team Photo ── */}
      <motion.section
        className="max-w-6xl mx-auto px-6 py-12 pb-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative w-full h-72 sm:h-80 md:h-[30rem] overflow-hidden rounded-2xl border border-neutral-800">
          <motion.img
            src={MeImg}
            alt="Fantome Technologies Team"
            className="w-full h-full object-cover brightness-90"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          {/* Subtle dark vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent pointer-events-none rounded-2xl" />
        </div>
      </motion.section>

      {/* Booking Form Modal */}
      {showForm && (
        <BookingForm isModal={true} onClose={() => setShowForm(false)} />
      )}

      <Footer />
    </div>
  );
}
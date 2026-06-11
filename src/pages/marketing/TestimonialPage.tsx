import Navbar from "../../components/header/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BookingForm from "../../components/forms/BookingForm";
import Footer from "../../components/footer/Footer";
import ReturnHomeButton from "../../components/buttons/ReturnHomeButton";
import { motion } from "framer-motion";

const PASTEL_COLORS = [
  "bg-rose-200",
  "bg-amber-200",
  "bg-yellow-200",
  "bg-green-200",
  "bg-sky-200",
  "bg-violet-200",
  "bg-pink-200",
  "bg-teal-200",
];

interface Testimonial {
  logo?: string;
  name: string;
  location?: string;
  comment: string;
}

function TestimonialCard({
  testimonial,
  colorClass,
  index,
}: {
  testimonial: Testimonial;
  colorClass: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className={`
        ${colorClass}
        rounded-3xl p-6 flex flex-col justify-between
        min-h-[220px] w-full
        transition-shadow duration-300
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)]
      `}
    >
      {/* Opening quote mark */}
      <span className="text-4xl leading-none text-black/20 font-serif mb-1 select-none">
        "
      </span>

      {/* Quote */}
      <p className="text-gray-800 text-base italic leading-relaxed font-['Georgia',serif] mb-6">
        {testimonial.comment}
      </p>

      {/* Divider */}
      <div className="w-10 h-px bg-black/20 mb-4" />

      {/* Author */}
      <div className="flex items-center gap-3 mt-auto">
        {testimonial.logo ? (
          <img
            src={testimonial.logo}
            alt={testimonial.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-white/60 shadow-sm"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-white/50 flex items-center justify-center text-lg font-bold text-gray-600">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-bold text-gray-900 text-sm font-['Georgia',serif]">
            {testimonial.name}
          </p>
          {testimonial.location && (
            <p className="text-gray-500 text-xs mt-0.5">{testimonial.location}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const testimonials: Testimonial[] = [
  {
    logo: "/cheerful-cup.png",
    name: "A Cheerful Cup",
    location: "Colorado",
    comment:
      "Fantome Technologies built our website beautifully and on time! I recently subscribed to their gold tier in website management services. I love the monthly check-in's. Our website used to have troubles loading our images and it didn't have the personality we wanted. We don't have that problem anymore.",
  },
  {
    logo: "/mm-logo.png",
    name: "Mystery Mansion",
    location: "Colorado",
    comment:
      "We needed a website built for the Adult Entertainment Industry & Fantome Technologies delivered! We had a recent issue with our server being down, emailed FT about it and they were able to get us back up and running in 7 minutes. I highly recommend them for your web development needs.",
  },
];


const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

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

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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

        {/* ── Hero ── */}
        <motion.div
          className="pt-20 pb-12 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          {/* Label pill */}
          <span className="inline-block mb-5 px-4 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs tracking-widest uppercase">
            Client Stories
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mb-5">
            What Our{" "}
            <span className="text-neutral-400 font-normal italic">
              Clients Say
            </span>
          </h1>

          <p className="text-neutral-400 text-lg max-w-xl mx-auto leading-relaxed">
            Don't just take our word for it — hear from the businesses we've
            helped grow.
          </p>

          {/* Divider */}
          <div className="mt-10 mx-auto w-16 h-px bg-neutral-700" />
        </motion.div>

        {/* ── Stats strip ── */}
        <motion.div
          className="mb-14 flex flex-wrap justify-center gap-10 sm:gap-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
        >
          {[
            ["100%", "Satisfaction"],
            ["5★", "Avg. Rating"],
            ["CO", "Locally Rooted"],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="text-white text-2xl font-bold">{val}</p>
              <p className="text-neutral-500 text-xs mt-1 tracking-wide uppercase">
                {label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ── Testimonial Cards Grid ── */}
        <section className="pb-32">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {testimonials.map((t, i) => (
              <div key={i} className="break-inside-avoid">
                <TestimonialCard
                  testimonial={t}
                  colorClass={PASTEL_COLORS[i % PASTEL_COLORS.length]}
                  index={i}
                />
              </div>
            ))}
          </div>

          {/* Empty state — shown when no testimonials yet */}
          {testimonials.length === 0 && (
            <div className="text-center py-24 text-neutral-600 text-sm">
              More reviews coming soon.
            </div>
          )}
        </section>
      </div>

      {/* Booking Form Modal */}
      {showForm && (
        <BookingForm isModal={true} onClose={() => setShowForm(false)} />
      )}

      <Footer />
    </div>
  );
}
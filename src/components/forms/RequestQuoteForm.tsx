import { useState } from "react";
import RequestQuoteModal from "../modal/requestQuoteModal";
import FormLoader from "../loaders/formLoader";

export default function RequestQuoteForm() {
  const [websiteType, setWebsiteType] = useState("");
  const [pages, setPages] = useState<number | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const basePrices: Record<string, number> = {
    "Landing Page": 250,
    "Business Website": 670,
    "Website Redesign": 300,
  };

  const pricePerPage = 75;

  const estimatedPrice =
    websiteType && pages
      ? (() => {
          const base =
            basePrices[websiteType] + Number(pages) * pricePerPage;

          const variability = base * 0.05;
          const randomAdjustment =
            Math.random() * (variability * 2) - variability;

          return Math.round(base + randomAdjustment);
        })()
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !websiteType || !pages) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://fantome-technologies.onrender.com/api/request-quote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            websiteType,
            pages,
            estimatedPrice,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setModalOpen(true);

        setName("");
        setEmail("");
        setWebsiteType("");
        setPages("");
      } else {
        alert("Error submitting request: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="
        w-full
        rounded-[2rem]
        border border-neutral-800
        bg-neutral-900
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        p-6 sm:p-8 md:p-10
      "
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-block mb-5 px-4 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs tracking-widest uppercase">
          Website Estimate
        </span>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Get Your{" "}
          <span className="italic font-normal text-neutral-400">
            Custom Quote
          </span>
        </h2>

        <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Stop thinking about it. Start building it. Let’s turn your
          idea into a website that actually helps grow your business.
        </p>

        <div className="mt-8 mx-auto w-16 h-px bg-neutral-700" />
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <fieldset disabled={isSubmitting} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm text-neutral-300 mb-2">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="
                w-full rounded-2xl
                border border-neutral-700
                bg-neutral-950
                text-white
                px-5 py-3
                placeholder:text-neutral-500
                focus:outline-none
                focus:border-neutral-500
                transition-colors
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-neutral-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="
                w-full rounded-2xl
                border border-neutral-700
                bg-neutral-950
                text-white
                px-5 py-3
                placeholder:text-neutral-500
                focus:outline-none
                focus:border-neutral-500
                transition-colors
              "
            />
          </div>

          {/* Website Type */}
          <div>
            <label className="block text-sm text-neutral-300 mb-2">
              Website Type
            </label>

            <select
              value={websiteType}
              onChange={(e) => setWebsiteType(e.target.value)}
              className="
                w-full rounded-2xl
                border border-neutral-700
                bg-neutral-950
                text-white
                px-5 py-3
                focus:outline-none
                focus:border-neutral-500
                transition-colors
              "
            >
              <option value="">Select a website type</option>
              <option value="Landing Page">Landing Page</option>
              <option value="Business Website">
                Business Website
              </option>
              <option value="Website Redesign">
                Website Redesign
              </option>
            </select>
          </div>

          {/* Pages */}
          <div>
            <label className="block text-sm text-neutral-300 mb-2">
              Number of Pages
            </label>

            <select
              value={pages}
              onChange={(e) =>
                setPages(Number(e.target.value))
              }
              className="
                w-full rounded-2xl
                border border-neutral-700
                bg-neutral-950
                text-white
                px-5 py-3
                focus:outline-none
                focus:border-neutral-500
                transition-colors
              "
            >
              <option value="">Select pages</option>

              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 9 ? "+" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Estimated Price */}
          {estimatedPrice && (
            <div
              className="
                rounded-3xl
                bg-neutral-950
                border border-neutral-800
                p-6
                text-center
                animate-[slideUpFade_0.4s_ease-out]
              "
            >
              <p className="text-neutral-400 text-sm uppercase tracking-wide">
                Estimated Project Cost
              </p>

              <p className="text-4xl font-bold text-white mt-2">
                ${estimatedPrice.toLocaleString()}
              </p>

              <p className="text-xs text-neutral-500 mt-3">
                Final pricing may vary based on features,
                integrations, and project scope.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full
              rounded-2xl
              border border-neutral-700
              bg-white
              text-black
              font-semibold
              py-4
              transition-all duration-300
              hover:bg-neutral-200
              hover:shadow-md
              active:scale-[0.99]
              disabled:opacity-70
              disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? (
              <FormLoader text="Sending request..." />
            ) : (
              "Get My Estimate"
            )}
          </button>

          <p className="text-xs text-neutral-500 text-center leading-relaxed">
            You’ll receive a personalized quote within 24 hours.
            No spam, no pressure.
          </p>
        </fieldset>
      </form>

      <RequestQuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
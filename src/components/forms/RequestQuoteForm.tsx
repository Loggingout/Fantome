import { useState } from "react";
import RequestQuoteModal from "../modal/requestQuoteModal";
import FormLoader from "../loaders/formLoader"; // Import the loader component

export default function RequestQuoteForm() {
  const [websiteType, setWebsiteType] = useState("");
  const [pages, setPages] = useState<number | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // modal state
  const [isSubmitting, setIsSubmitting] = useState(false); // submission state

  const basePrices: Record<string, number> = {
    "Landing Page": 250,
    "Business Website": 670,
    "Website Redesign": 300,
  };

  const pricePerPage = 75;

  const estimatedPrice =
    websiteType && pages
      ? (() => {
          const base = basePrices[websiteType] + Number(pages) * pricePerPage;
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
        },
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
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Get a Quote!
      </h2>

      <p className="text-sm text-gray-600 text-center mb-6">
        Stop thinking about it. Start building it.{" "}
        <span className="font-semibold">
          -Let's turn your idea into a website that actually brings in the
          customers.
        </span>
        .
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <fieldset disabled={isSubmitting} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Website Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website Type
            </label>
            <select
              value={websiteType}
              onChange={(e) => setWebsiteType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a website type</option>
              <option value="Landing Page">Landing Page</option>
              <option value="Business Website">Business Website</option>
              <option value="Website Redesign">Website Redesign</option>
            </select>
          </div>

          {/* Number of Pages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Pages
            </label>
            <select
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl text-center
               animate-[slideUpFade_0.4s_ease-out]"
            >
              <p className="text-gray-700 text-sm">Estimated Project Cost</p>
              <p className="text-3xl font-bold text-purple-700">
                ${estimatedPrice.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Final pricing may vary based on features & scope
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-semibold text-white
    bg-gradient-to-r from-purple-600 to-pink-600
    hover:shadow-lg hover:shadow-purple-500/40
    transition-all duration-300 hover:scale-[1.02]
    disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <FormLoader text="Sending request..." />
            ) : (
              "Get My Estimate"
            )}
          </button>

          <p className="text-xs text-gray-500 mt-2 text-center font-bold">
            You'll receive a personalized quote within 24 hours of providing
            your email. No spam, no pressure🎁
          </p>
        </fieldset>
      </form>

      {/* Request Quote Modal */}
      <RequestQuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

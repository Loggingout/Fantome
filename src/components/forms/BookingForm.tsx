import Logo from "/new-logo.png";
import FormLoader from "../../components/loaders/formLoader";
import { useBookingForm } from "../hooks/useBookingForm";

interface BookingFormProps {
  onClose?: () => void;
  isModal?: boolean;
}

const BookingForm = ({ onClose, isModal = false }: BookingFormProps) => {
  const {
    formData,
    isSubmitting,
    error,
    success,
    handleChange,
    handleSubmit,
  } = useBookingForm(onClose);

  const formContent = (
    <div
      className={`
        rounded-[2rem]
        border border-neutral-800
        bg-neutral-900
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        p-6 sm:p-8
        ${isModal ? "backdrop-blur-sm" : ""}
      `}
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <img
            src={Logo}
            alt="Company Logo"
            className="h-12 w-12 rounded-2xl"
          />

          <div>
            <span className="inline-block mb-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-400 text-[10px] tracking-widest uppercase">
              Discovery Call
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Let's{" "}
              <span className="italic font-normal text-neutral-400">
                Build Together
              </span>
            </h3>
          </div>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="
              text-neutral-500
              hover:text-white
              transition-colors
              text-2xl
            "
            aria-label="Close form"
          >
            ×
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="w-16 h-px bg-neutral-700 mb-8" />

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-5 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-green-200 text-sm">
          ✓ Booking submitted successfully!
        </div>
      )}

      <div className="space-y-6">
        <fieldset disabled={isSubmitting} className="space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm text-neutral-300 mb-2">
              Business Name *
            </label>

            <input
              name="businessName"
              type="text"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Your business name"
              required
              className="
                w-full
                rounded-2xl
                border border-neutral-700
                bg-neutral-950
                px-5 py-3
                text-white
                placeholder:text-neutral-500
                focus:outline-none
                focus:border-neutral-500
                transition-colors
                disabled:opacity-50
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-neutral-300 mb-2">
              Email *
            </label>

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="
                w-full
                rounded-2xl
                border border-neutral-700
                bg-neutral-950
                px-5 py-3
                text-white
                placeholder:text-neutral-500
                focus:outline-none
                focus:border-neutral-500
                transition-colors
                disabled:opacity-50
              "
            />
          </div>

          {/* Product Idea */}
          <div>
            <label className="block text-sm text-neutral-300 mb-2">
              Product Idea *
            </label>

            <textarea
              name="productIdea"
              value={formData.productIdea}
              onChange={handleChange}
              placeholder="Tell us about your project vision"
              required
              className="
                w-full
                rounded-2xl
                border border-neutral-700
                bg-neutral-950
                px-5 py-3
                h-36
                resize-none
                text-white
                placeholder:text-neutral-500
                focus:outline-none
                focus:border-neutral-500
                transition-colors
                disabled:opacity-50
              "
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm text-neutral-300 mb-2">
              Estimated Budget *
            </label>

            <input
              name="estimatedBudget"
              type="text"
              value={formData.estimatedBudget}
              onChange={handleChange}
              placeholder="$5,000 - $10,000"
              required
              className="
                w-full
                rounded-2xl
                border border-neutral-700
                bg-neutral-950
                px-5 py-3
                text-white
                placeholder:text-neutral-500
                focus:outline-none
                focus:border-neutral-500
                transition-colors
                disabled:opacity-50
              "
            />
          </div>
        </fieldset>

        <p className="text-sm text-neutral-500 text-center leading-relaxed">
          You’ll receive an email within 24 hours after submission.
        </p>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="
            w-full
            rounded-2xl
            border border-neutral-700
            bg-white
            text-black
            py-4
            font-semibold
            transition-all duration-300
            hover:bg-neutral-200
            hover:shadow-md
            active:scale-[0.99]
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? (
            <FormLoader text="Submitting booking..." />
          ) : (
            "Submit Request"
          )}
        </button>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
          {formContent}
        </div>
      </div>
    );
  }

  return formContent;
};

export default BookingForm;

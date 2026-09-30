import { useState } from "react";
import { submitBooking } from "../services/bookingService";

export function useBookingForm(onClose?: () => void) {
  const [formData, setFormData] = useState({
    businessName: "",
    productIdea: "",
    estimatedBudget: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError(null);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (
      !formData.businessName ||
      !formData.productIdea ||
      !formData.estimatedBudget ||
      !formData.email
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitBooking(formData);

      console.log("Booking submitted successfully:", result.data);

      setSuccess(true);

      setTimeout(() => {
        setFormData({
          businessName: "",
          productIdea: "",
          estimatedBudget: "",
          email: "",
        });

        setSuccess(false);

        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      console.error("Error submitting booking:", err);
      setError("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    error,
    success,
    handleChange,
    handleSubmit,
  };
}

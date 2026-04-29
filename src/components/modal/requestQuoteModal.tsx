import { FC } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestQuoteModal: FC<RequestQuoteModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-md bg-gradient-to-br from-purple-900 to-pink-700 rounded-2xl shadow-2xl p-8 text-white"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Close Modal"
        >
          <X size={24} />
        </button>

        {/* Modal Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">
            🎉 Request Submitted!
          </h2>
          <p className="text-white/80 text-sm">
            Thank you for submitting your quote request. Our team will review your information and get back to you within 24 hours.
          </p>

          <div className="mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 transition-transform duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RequestQuoteModal;

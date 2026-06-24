import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["web-development", "web-design", "website-management", "marketing"],
      required: true,
    },
    // price of 0 means "contact for quote"
    price: { type: Number, default: 0, min: 0 },
    // e.g. "/month", "/project", "" — displayed after the price
    priceUnit: { type: String, default: "" },
    // Optional override label (e.g. "Custom", "Starting at $500")
    // If set, renders instead of the numeric price
    priceLabel: { type: String, default: "" },
    features: [{ type: String }],
    // Lucide icon identifier string, e.g. "Code", "Shield"
    icon: { type: String, default: "Star" },
    // Tailwind classes for the card background/border
    colorClass: { type: String, default: "bg-neutral-900/80 border-neutral-800" },
    // Optional badge, e.g. "Most Popular"
    badge: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);

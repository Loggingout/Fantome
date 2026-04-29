const mongoose = require("mongoose");

const requestQuoteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    websiteType: {
      type: String,
      required: true,
      enum: ["Landing Page", "Business Website", "Website Redesign"],
    },
    pages: {
      type: Number,
      required: true,
      min: 1,
    },
    estimatedPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RequestQuote", requestQuoteSchema);

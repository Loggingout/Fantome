import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    inquiryType: {
      type: String,
      required: true,
      enum: ["general", "business", "platform", "careers"],
    },
    subject: { type: String, required: true, trim: true, maxlength: 180 },
    message: { type: String, required: true, trim: true, maxlength: 10000 },
    status: { type: String, enum: ["new", "read", "closed"], default: "new" },
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

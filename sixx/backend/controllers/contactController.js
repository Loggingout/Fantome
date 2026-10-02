import { ContactMessage } from "../models/ContactMessage.js";
import emailService from "../services/emailService.js";

const INQUIRY_TYPES = new Set(["general", "business", "platform", "careers"]);

export async function submitContactMessage(req, res) {
  const values = {
    firstName: String(req.body?.firstName ?? "").trim(),
    lastName: String(req.body?.lastName ?? "").trim(),
    email: String(req.body?.email ?? "").trim().toLowerCase(),
    inquiryType: String(req.body?.inquiryType ?? ""),
    subject: String(req.body?.subject ?? "").trim(),
    message: String(req.body?.message ?? "").trim(),
  };

  if (
    !values.firstName || values.firstName.length > 80 ||
    !values.lastName || values.lastName.length > 80 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254 ||
    !INQUIRY_TYPES.has(values.inquiryType) ||
    !values.subject || values.subject.length > 180 ||
    !values.message || values.message.length > 10000
  ) {
    return res.status(400).json({ success: false, message: "Complete all contact fields with valid values." });
  }

  try {
    const contact = await ContactMessage.create(values);

    const emailResults = await Promise.allSettled([
      emailService.sendContactNotification(values),
      emailService.sendContactAcknowledgement(values),
    ]);
    for (const result of emailResults) {
      if (result.status === "rejected") {
        console.error("Contact email delivery failed:", result.reason?.message ?? result.reason);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Your message has been received. Thank you for contacting Fantome Technologies.",
      id: contact.id,
    });
  } catch (error) {
    console.error("submitContactMessage error:", error);
    return res.status(500).json({ success: false, message: "Unable to send your message right now. Please try again." });
  }
}

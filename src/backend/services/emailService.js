import { Resend } from "resend";

class EmailService {
  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || null;
    this.from = process.env.EMAIL_FROM || "onboarding@resend.dev";

    if (!this.apiKey) {
      console.warn(
        "⚠️ Resend API key is missing. Emails will not be sent!"
      );
      this.resend = null;
    } else {
      this.resend = new Resend(this.apiKey);
    }
  }

  async sendEmail({ to, subject, html }) {
    if (!this.resend) {
      console.warn(
        "⚠️ Attempted to send email but Resend is not configured. To:", to
      );
      return null;
    }

    try {
      const message = await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        html,
      });

      console.log("📨 Email sent via Resend:", message);
      return message;
    } catch (err) {
      console.error("❌ Resend email failed:", err);
      throw err;
    }
  }

  // =========================
  // Booking notification (admin)
  // =========================
  async sendBookingNotification(bookingData) {
    return this.sendEmail({
      to: process.env.EMAIL_TO,
      subject: `📅 New Booking from ${bookingData.name}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${bookingData.name}</p>
        <p><strong>Email:</strong> ${bookingData.email || "N/A"}</p>
        <p><strong>Service:</strong> ${bookingData.service}</p>
        <p><strong>Date:</strong> ${bookingData.date}</p>
      `,
    });
  }

  // =========================
  // Request quote notification (admin)
  // =========================
  async sendQuoteNotification(quoteData) {
    return this.sendEmail({
      to: process.env.EMAIL_TO,
      subject: "🚀 New Quote Request",
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${quoteData.name}</p>
        <p><strong>Email:</strong> ${quoteData.email}</p>
        <p><strong>Website Type:</strong> ${quoteData.websiteType}</p>
        <p><strong>Pages:</strong> ${quoteData.pages}</p>
        <p><strong>Estimated Price:</strong> $${quoteData.estimatedPrice}</p>
      `,
    });
  }

  // =========================
  // Request quote confirmation (client)
  // =========================
  async sendQuoteConfirmation(quoteData) {
    if (!quoteData.email) {
      console.warn("⚠️ Client email missing, skipping confirmation");
      return null;
    }

    return this.sendEmail({
      to: quoteData.email,
      subject: "We received your quote request 👋",
      html: `
        <h2>Thanks for reaching out, ${quoteData.name}!</h2>
        <p>We've received your request for a <strong>${quoteData.websiteType}</strong>.</p>
        <p><strong>Estimated Cost:</strong> $${quoteData.estimatedPrice}</p>
        <p>We'll review your project and get back to you within 24 hours.</p>
        <br/>
        <p>— Fantome Technologies</p>
      `,
    });
  }
}


export default new EmailService();

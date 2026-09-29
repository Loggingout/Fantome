import { Unosend } from "@unosend/node";

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

const createJobOpportunityTemplate = ({ firstName = "", isTest = false } = {}) => {
  const greeting = firstName.trim() ? escapeHtml(firstName.trim()) : "there";
  const testNotice = isTest
    ? "This is a test message previewing the Fantome Technologies job-opportunity email. It is not a formal offer or notice of a specific opening."
    : "We are reaching out to start a conversation about potential opportunities at Fantome Technologies.";
  const subject = `${isTest ? "[TEST] " : ""}An opportunity to build what’s next at Fantome Technologies`;
  const text = `${isTest ? `${testNotice}\n\n` : ""}Hello ${greeting},

We’re growing our in-house technology ecosystem and would welcome a conversation with people who are excited to build, improve, and support technology products.

If you’re open to discussing potential opportunities across product, engineering, security, or operations, reply to this email and tell us what kind of work interests you.

Explore Fantome Technologies: https://fantometechnologies.com

Regards,
Fantome Technologies`;
  const html = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(testNotice)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5;padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;">
          <tr><td style="height:5px;background:#dc2626;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr><td style="padding:28px 36px 20px;border-bottom:1px solid #e4e4e7;">
            <img src="https://fantometechnologies.com/new-logo.png" width="150" alt="Fantome Technologies" style="display:block;width:150px;max-width:100%;height:auto;border:0;">
          </td></tr>
          <tr><td style="padding:36px;">
            ${isTest ? `<p style="display:inline-block;margin:0 0 20px;padding:7px 10px;border-radius:4px;background:#fef2f2;color:#b91c1c;font-size:11px;font-weight:700;letter-spacing:1px;">TEST EMAIL</p>` : ""}
            <p style="margin:0 0 12px;color:#b91c1c;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Careers &amp; Opportunities</p>
            <h1 style="margin:0 0 22px;color:#18181b;font-size:30px;line-height:1.2;font-weight:700;">An opportunity to build what’s next.</h1>
            <p style="margin:0 0 16px;color:#3f3f46;font-size:16px;line-height:1.65;">Hello ${greeting},</p>
            <p style="margin:0 0 16px;color:#3f3f46;font-size:16px;line-height:1.65;">We’re growing our in-house technology ecosystem and would welcome a conversation with people who are excited to build, improve, and support technology products.</p>
            <p style="margin:0 0 24px;color:#3f3f46;font-size:16px;line-height:1.65;">If you’re open to discussing potential opportunities across product, engineering, security, or operations, reply to this email and tell us what kind of work interests you.</p>
            <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="border-radius:6px;background:#b91c1c;">
              <a href="https://fantometechnologies.com" style="display:inline-block;padding:13px 20px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">Explore Fantome Technologies</a>
            </td></tr></table>
            <p style="margin:28px 0 0;color:#52525b;font-size:15px;line-height:1.6;">Regards,<br><strong style="color:#18181b;">Fantome Technologies</strong></p>
          </td></tr>
          <tr><td style="padding:18px 36px;background:#fafafa;border-top:1px solid #e4e4e7;color:#71717a;font-size:12px;line-height:1.6;">Fantome Technologies<br><a href="https://fantometechnologies.com" style="color:#b91c1c;text-decoration:none;">fantometechnologies.com</a></td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
};

class EmailService {
  constructor() {
    this.apiKey = process.env.UNO_API_KEY || null;
    this.from = process.env.EMAIL_FROM || null;

    this.unosend = this.apiKey ? new Unosend({ apiKey: this.apiKey }) : null;
  }

  async sendEmail({ to, subject, html, text }) {
    if (!this.unosend) {
      throw new Error("UNO_API_KEY is missing; configure UnoSend before sending email.");
    }
    if (!this.from) {
      throw new Error("EMAIL_FROM is missing; configure a verified sender address.");
    }

    try {
      const { data, error } = await this.unosend.emails.send({
        from: this.from,
        to,
        subject,
        html,
        text,
      });

      if (error) throw new Error(error.message);

      console.log("📨 Email sent via UnoSend:", data?.id ?? "accepted");
      return data;
    } catch (err) {
      console.error("❌ UnoSend email failed:", err.message);
      throw err;
    }
  }

  async sendJobOpportunityEmail({ to, firstName = "", isTest = false }) {
    const template = createJobOpportunityTemplate({ firstName, isTest });
    return this.sendEmail({ to, ...template });
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

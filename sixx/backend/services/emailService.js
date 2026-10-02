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

  async sendEmail({ to, subject, html, text, replyTo }) {
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
        replyTo,
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

  createUnsubscribeUrl(token) {
    const apiBase = (process.env.PUBLIC_API_URL || "https://fantome.onrender.com").replace(/\/+$/, "");
    return `${apiBase}/api/newsletter/unsubscribe/${encodeURIComponent(token)}`;
  }

  async sendNewsletterWelcome({ to, unsubscribeUrl }) {
    const subject = "You’re subscribed to Fantome blog updates";
    const text = `Thanks for subscribing. We’ll email you when Fantome Technologies publishes a new blog post. You can unsubscribe at any time: ${unsubscribeUrl}`;
    const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#f4f4f5;color:#18181b;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;background:#f4f4f5"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden"><tr><td style="height:5px;background:#dc2626"></td></tr><tr><td style="padding:28px 36px;border-bottom:1px solid #e4e4e7"><img src="https://fantometechnologies.com/new-logo.png" width="150" alt="Fantome Technologies" style="display:block;width:150px;height:auto"></td></tr><tr><td style="padding:36px"><p style="margin:0 0 12px;color:#b91c1c;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">Blog updates</p><h1 style="margin:0 0 18px;font-size:28px;line-height:1.2">You’re on the list.</h1><p style="margin:0;color:#52525b;font-size:16px;line-height:1.65">Thanks for subscribing. We’ll email you when Fantome Technologies publishes a new blog post. No unrelated promotional mail.</p><p style="margin:28px 0 0;color:#52525b;font-size:14px">Fantome Technologies</p></td></tr><tr><td style="padding:18px 36px;background:#fafafa;border-top:1px solid #e4e4e7;color:#71717a;font-size:12px">You can <a href="${escapeHtml(unsubscribeUrl)}" style="color:#b91c1c">unsubscribe</a> at any time.</td></tr></table></td></tr></table></body></html>`;
    return this.sendEmail({ to, subject, html, text });
  }

  async sendBlogPostNewsletter({ to, post, unsubscribeUrl, isTest = false }) {
    const siteBase = (process.env.FRONTEND_URL || "https://fantometechnologies.com").replace(/\/+$/, "");
    const articleUrl = isTest
      ? `${siteBase}/blog`
      : `${siteBase}/blog/${encodeURIComponent(post._id.toString())}`;
    const title = escapeHtml(post.title);
    const excerpt = escapeHtml(post.excerpt || "A new article is available on the Fantome Technologies blog.");
    const category = escapeHtml(post.category || "Blog");
    const cover = post.image
      ? `<img src="${escapeHtml(post.image)}" alt="${title}" style="display:block;width:100%;height:auto;margin:24px 0;border-radius:8px">`
      : "";
    const subject = `${isTest ? "[TEST] " : ""}New on the Fantome blog: ${post.title}`;
    const text = `${isTest ? "TEST EMAIL — preview only.\n\n" : ""}${post.title}\n\n${post.excerpt || "A new article is available."}\n\nRead ${isTest ? "the blog" : "the article"}: ${articleUrl}\n\nUnsubscribe: ${unsubscribeUrl}`;
    const testLabel = isTest ? `<p style="display:inline-block;margin:0 0 18px;padding:7px 10px;border-radius:4px;background:#fef2f2;color:#b91c1c;font-size:11px;font-weight:700;letter-spacing:1px">TEST EMAIL · PREVIEW ONLY</p>` : "";
    const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#f4f4f5;color:#18181b;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;background:#f4f4f5"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden"><tr><td style="height:5px;background:#dc2626"></td></tr><tr><td style="padding:28px 36px;border-bottom:1px solid #e4e4e7"><img src="https://fantometechnologies.com/new-logo.png" width="150" alt="Fantome Technologies" style="display:block;width:150px;height:auto"></td></tr><tr><td style="padding:36px">${testLabel}<p style="margin:0 0 12px;color:#b91c1c;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">New blog post · ${category}</p><h1 style="margin:0;color:#18181b;font-size:30px;line-height:1.2">${title}</h1>${cover}<p style="margin:20px 0 24px;color:#52525b;font-size:16px;line-height:1.65">${excerpt}</p><a href="${escapeHtml(articleUrl)}" style="display:inline-block;padding:13px 20px;border-radius:6px;background:#b91c1c;color:#fff;font-size:14px;font-weight:700;text-decoration:none">${isTest ? "Visit the blog" : "Read the article"}</a><p style="margin:28px 0 0;color:#52525b;font-size:14px">Fantome Technologies</p></td></tr><tr><td style="padding:18px 36px;background:#fafafa;border-top:1px solid #e4e4e7;color:#71717a;font-size:12px">You subscribed to new blog post announcements. <a href="${escapeHtml(unsubscribeUrl)}" style="color:#b91c1c">Unsubscribe</a></td></tr></table></td></tr></table></body></html>`;
    return this.sendEmail({ to, subject, html, text });
  }

  async sendContactAcknowledgement(contact, { isTest = false } = {}) {
    const name = escapeHtml(`${contact.firstName} ${contact.lastName}`.trim());
    const subject = `${isTest ? "[TEST] " : ""}We received your message | Fantome Technologies`;
    const text = `${isTest ? "TEST EMAIL — preview only.\n\n" : ""}Hello ${contact.firstName}, we received your message about “${contact.subject}” and will review it.`;
    const testLabel = isTest ? `<p style="display:inline-block;margin:0 0 18px;padding:7px 10px;border-radius:4px;background:#fef2f2;color:#b91c1c;font-size:11px;font-weight:700;letter-spacing:1px">TEST EMAIL · PREVIEW ONLY</p>` : "";
    const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#f4f4f5;color:#18181b;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;background:#f4f4f5"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden"><tr><td style="height:5px;background:#dc2626"></td></tr><tr><td style="padding:28px 36px;border-bottom:1px solid #e4e4e7"><img src="https://fantometechnologies.com/new-logo.png" width="150" alt="Fantome Technologies" style="display:block;width:150px;height:auto"></td></tr><tr><td style="padding:36px">${testLabel}<p style="margin:0 0 12px;color:#b91c1c;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">Contact request received</p><h1 style="margin:0 0 18px;font-size:28px;line-height:1.2">Thanks for reaching out, ${name}.</h1><p style="margin:0;color:#52525b;font-size:16px;line-height:1.65">Your message has been received. Our team will review it and follow up if a response is needed.</p><p style="margin:28px 0 0;color:#52525b;font-size:14px">Fantome Technologies</p></td></tr><tr><td style="padding:18px 36px;background:#fafafa;border-top:1px solid #e4e4e7;color:#71717a;font-size:12px">This is an automatic confirmation of your contact form submission.</td></tr></table></td></tr></table></body></html>`;
    return this.sendEmail({ to: contact.email, subject, html, text });
  }

  async sendContactNotification(contact) {
    const to = process.env.EMAIL_TO;
    if (!to) throw new Error("EMAIL_TO is missing; contact message was saved but no team notification recipient is configured.");
    const name = escapeHtml(`${contact.firstName} ${contact.lastName}`.trim());
    const email = escapeHtml(contact.email);
    const subjectText = escapeHtml(contact.subject);
    const message = escapeHtml(contact.message).replace(/\r?\n/g, "<br>");
    const subject = `Contact inquiry: ${contact.subject}`;
    const text = `From: ${contact.firstName} ${contact.lastName} <${contact.email}>\nType: ${contact.inquiryType}\nSubject: ${contact.subject}\n\n${contact.message}`;
    const html = `<!doctype html><html lang="en"><meta charset="utf-8"><body style="margin:0;background:#f4f4f5;color:#18181b;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;background:#f4f4f5"><tr><td align="center"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden"><tr><td style="height:5px;background:#dc2626"></td></tr><tr><td style="padding:28px 36px;border-bottom:1px solid #e4e4e7"><img src="https://fantometechnologies.com/new-logo.png" width="150" alt="Fantome Technologies" style="display:block;width:150px;height:auto"></td></tr><tr><td style="padding:36px"><p style="margin:0 0 12px;color:#b91c1c;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">New contact inquiry · ${escapeHtml(contact.inquiryType)}</p><h1 style="margin:0 0 20px;font-size:26px">${subjectText}</h1><p style="margin:0 0 8px;color:#52525b"><strong>From:</strong> ${name} &lt;<a href="mailto:${email}" style="color:#b91c1c">${email}</a>&gt;</p><div style="margin-top:20px;padding:18px;background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;color:#3f3f46;line-height:1.65">${message}</div></td></tr></table></td></tr></table></body></html>`;
    return this.sendEmail({ to, subject, html, text, replyTo: contact.email });
  }

}


export default new EmailService();

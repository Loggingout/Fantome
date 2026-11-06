import { NewsletterDelivery } from "../models/NewsletterDelivery.js";
import { NewsletterSubscriber } from "../models/NewsletterSubscriber.js";

export async function getNewsletterAnalytics(_req, res) {
  try {
    const [totalSubscribers, blogEmailsSent, pendingBlogEmails] = await Promise.all([
      NewsletterSubscriber.countDocuments({ unsubscribedAt: null }),
      NewsletterDelivery.countDocuments({ status: "sent" }),
      NewsletterDelivery.countDocuments({ status: "pending" }),
    ]);

    return res.status(200).json({
      totalSubscribers,
      blogEmailsSent,
      pendingBlogEmails,
    });
  } catch (error) {
    console.error("getNewsletterAnalytics error:", error);
    return res.status(500).json({ message: "Unable to retrieve newsletter analytics." });
  }
}

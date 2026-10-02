import { randomBytes } from "node:crypto";
import { Blog } from "../models/Blog.js";
import { NewsletterDelivery } from "../models/NewsletterDelivery.js";
import { NewsletterState } from "../models/NewsletterState.js";
import { NewsletterSubscriber } from "../models/NewsletterSubscriber.js";
import emailService from "../services/emailService.js";

export async function subscribeToNewsletter(req, res) {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ success: false, message: "Enter a valid email address." });
  }

  try {
    let subscriber = await NewsletterSubscriber.findOne({ email });
    const isNewSubscription = !subscriber || Boolean(subscriber.unsubscribedAt);

    if (!subscriber) {
      subscriber = await NewsletterSubscriber.create({ email });
    } else if (subscriber.unsubscribedAt) {
      subscriber.subscribedAt = new Date();
      subscriber.unsubscribedAt = null;
      subscriber.unsubscribeToken = randomBytes(32).toString("hex");
      await subscriber.save();
    }

    if (isNewSubscription) {
      try {
        await emailService.sendNewsletterWelcome({
          to: email,
          unsubscribeUrl: emailService.createUnsubscribeUrl(subscriber.unsubscribeToken),
        });
      } catch (error) {
        console.error("Newsletter welcome email failed:", error.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: isNewSubscription ? "You’re subscribed to new blog announcements." : "You’re already subscribed.",
    });
  } catch (error) {
    console.error("subscribeToNewsletter error:", error);
    return res.status(500).json({ success: false, message: "Unable to save your subscription right now." });
  }
}

export async function unsubscribeFromNewsletter(req, res) {
  try {
    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { unsubscribeToken: req.params.token, unsubscribedAt: null },
      { $set: { unsubscribedAt: new Date() } },
      { new: true }
    );

    const message = subscriber
      ? "You have been unsubscribed from new blog announcements."
      : "This unsubscribe link is invalid or has already been used.";
    return res
      .status(subscriber ? 200 : 404)
      .type("html")
      .send(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Newsletter Preferences</title><body style="margin:0;background:#f4f4f5;color:#18181b;font-family:Arial,Helvetica,sans-serif"><main style="max-width:560px;margin:12vh auto;padding:40px 28px;background:#fff;border:1px solid #e4e4e7;border-radius:12px"><div style="height:4px;background:#dc2626;margin:-40px -28px 28px;border-radius:12px 12px 0 0"></div><h1 style="font-size:24px">Newsletter preferences</h1><p style="color:#52525b;line-height:1.6">${message}</p><a href="${process.env.FRONTEND_URL || "https://fantometechnologies.com"}" style="color:#b91c1c">Return to Fantome Technologies</a></main></body></html>`);
  } catch (error) {
    console.error("unsubscribeFromNewsletter error:", error);
    return res.status(500).type("text/plain").send("Unable to update newsletter preferences.");
  }
}

export async function initializeBlogNewsletter() {
  const state = await NewsletterState.findOneAndUpdate(
    { key: "blog-post-announcements" },
    { $setOnInsert: { startedAt: new Date() } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await Blog.updateMany(
    {
      published: true,
      createdAt: { $lte: state.startedAt },
      newsletterDispatchedAt: null,
    },
    { $set: { newsletterDispatchedAt: state.startedAt } }
  );
}

export async function deliverBlogNewsletters() {
  const pendingPosts = await Blog.find({
    published: true,
    newsletterDispatchedAt: null,
  }).sort({ publishedAt: 1, createdAt: 1 });
  const subscribers = await NewsletterSubscriber.find({ unsubscribedAt: null }).select("_id email unsubscribeToken");

  for (const post of pendingPosts) {
    if (subscribers.length === 0) {
      post.newsletterDispatchedAt = new Date();
      await post.save();
      continue;
    }

    for (const subscriber of subscribers) {
      try {
        const delivery = await NewsletterDelivery.findOneAndUpdate(
          { blogPost: post._id, subscriber: subscriber._id },
          { $setOnInsert: { status: "pending" } },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        if (delivery.status === "sent") continue;

        await emailService.sendBlogPostNewsletter({
          to: subscriber.email,
          post,
          unsubscribeUrl: emailService.createUnsubscribeUrl(subscriber.unsubscribeToken),
        });

        await NewsletterDelivery.updateOne(
          { _id: delivery._id },
          { $set: { status: "sent", sentAt: new Date(), lastError: "" }, $inc: { attempts: 1 } }
        );
      } catch (error) {
        console.error(`Blog newsletter delivery failed for ${subscriber.email}:`, error.message);
        await NewsletterDelivery.updateOne(
          { blogPost: post._id, subscriber: subscriber._id },
          { $set: { status: "pending", lastError: error.message }, $inc: { attempts: 1 } },
          { upsert: true }
        );
      }
    }

    const failedDeliveries = await NewsletterDelivery.countDocuments({
      blogPost: post._id,
      status: { $ne: "sent" },
    });
    if (failedDeliveries === 0) {
      post.newsletterDispatchedAt = new Date();
      await post.save();
    }
  }
}

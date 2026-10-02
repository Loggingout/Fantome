import cron from "node-cron";
import { publishDueBlogPosts } from "../controllers/blogController.js";
import { deliverBlogNewsletters } from "../controllers/newsletterController.js";

let publisherStarted = false;

export function startBlogPublisher() {
  if (publisherStarted) return;
  publisherStarted = true;

  const publishDue = async () => {
    try {
      const publishedCount = await publishDueBlogPosts();
      if (publishedCount > 0) {
        console.log(`✓ Scheduled blog posts published: ${publishedCount}`);
      }
      await deliverBlogNewsletters();
    } catch (error) {
      console.error("Scheduled blog publisher error:", error.message);
    }
  };

  void publishDue();
  cron.schedule("* * * * *", publishDue);
  console.log("✓ Scheduled blog publisher started");
}

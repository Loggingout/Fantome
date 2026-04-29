import EmailService from "../services/emailService.js";

export const requestQuote = async (req, res) => {
  try {
    const { name, email, websiteType, pages, estimatedPrice } = req.body;

    // Validate required fields
    if (!name || !email || !websiteType || !pages || !estimatedPrice) {
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("📩 Sending quote request emails...");

    // Send admin notification
    try {
      await EmailService.sendQuoteNotification({
        name,
        email,
        websiteType,
        pages,
        estimatedPrice,
      });
      console.log("✅ Admin email sent");
    } catch (err) {
      console.error("❌ Failed to send admin email:", err.message);
    }

    // Send client confirmation
    try {
      await EmailService.sendQuoteConfirmation({
        name,
        email,
        websiteType,
        estimatedPrice,
      });
      console.log("✅ Client email sent");
    } catch (err) {
      console.error("❌ Failed to send client email:", err.message);
    }

    res.status(200).json({ message: "Quote request submitted successfully" });
  } catch (error) {
    console.error("Request Quote Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

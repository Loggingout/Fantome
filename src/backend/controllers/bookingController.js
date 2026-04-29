import Booking from "../models/Booking.js";
import emailService from "../services/emailService.js";

export const createBooking = async (req, res) => {
  try {
    console.log("📩 Received booking request:", req.body);

    // Validate required fields
    const { businessName, email, productIdea, estimatedBudget } = req.body;

    if (!businessName || !productIdea || !estimatedBudget || !email) {
      return res.status(400).json({
        error:
          "Missing required fields: businessName, productIdea, and estimatedBudget are required",
      });
    }

    // Save to database
    const booking = new Booking({
      businessName,
      email,
      productIdea,
      estimatedBudget
    });

    await booking.save();
    console.log("✅ Booking saved successfully:", booking._id);

    /**
     * Send email notification
     * - Awaited to ensure delivery
     * - Wrapped in its own try/catch so it never breaks the request
     */
    try {
      await emailService.sendBookingNotification({
        name: booking.businessName,
        email: booking.email, 
        service: booking.productIdea,
        estimatedBudget: booking.estimatedBudget,
        date: booking.createdAt,
      });

      console.log("📨 Booking email sent successfully");
    } catch (emailError) {
      console.error("❌ Email notification failed:", emailError.message);
    }

    // Respond immediately after critical work is done
    res.status(201).json({
      message: "Booking submitted successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({
      error: "Failed to create booking",
      details: error.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({
      error: "Failed to fetch bookings",
      details: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("❌ Error fetching booking:", error);
    res.status(500).json({
      error: "Failed to fetch booking",
      details: error.message,
    });
  }
};

import express from 'express';
import emailService from '../services/emailService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, websiteType, pages, estimatedPrice } = req.body;

    // Validate required fields
    if (!name || !email || !websiteType || pages == null || estimatedPrice == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email to you + client via UnoSend
    await emailService.sendQuoteNotification({
      name,
      email,
      websiteType,
      pages,
      estimatedPrice
    });

    console.log('✅ New quote request:', req.body);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Request quote error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

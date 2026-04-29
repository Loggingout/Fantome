import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// LOAD .ENV FIRST - BEFORE ANY OTHER IMPORTS
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

console.log('MONGODB_URI exists?', process.env.MONGODB_URI ? 'YES ✓' : 'NO ✗');
console.log('EMAIL_USER exists?', process.env.EMAIL_USER ? 'YES ✓' : 'NO ✗');
console.log('EMAIL_PASS exists?', process.env.EMAIL_PASS ? 'YES ✓' : 'NO ✗');
console.log('EMAIL_TO exists?', process.env.EMAIL_TO ? 'YES ✓' : 'NO ✗');

// NOW import everything else AFTER env is loaded
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bookingRoutes from './routes/bookingRoutes.js';
import requestQuoteRoutes from './routes/requestQuote.js';

const app = express();

// CORS Configuration
const allowedOrigins = [
  'https://fantometechnologies.vercel.app',
  'https://www.fantometechnologies.vercel.app',
  'https://congenial-broccoli-jjrv5pxpv565c57w7-5173.app.github.dev',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://fantometechnologies.com',
  'https://fantometechnologies.com',
  'https://www.fantometechnologies.com', // make sure to include www
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('Request Origin:', origin); // helpful for debugging

  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept');
    
    if (req.method === 'OPTIONS') {
      // preflight request
      return res.sendStatus(200);
    }

    next();
  } else {
    console.log('❌ Blocked by CORS:', origin);
    return res.status(403).send('CORS blocked');
  }
});


app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin || 'no origin'}`);
  next();
});

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ ERROR: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log('✓ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/request-quote', requestQuoteRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Fantome Technologies API Server', 
    version: '1.0.0',
    endpoints: {
      bookings: '/api/bookings'
    }
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Listening on 0.0.0.0:${PORT}`);
  console.log(`✓ CORS enabled for origins:`, allowedOrigins);
});
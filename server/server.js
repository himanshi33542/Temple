import './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
import aartiRoutes from './routes/aartiRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import shrineRoutes from './routes/shrineRoutes.js';
import donationRecordRoutes from './routes/donationRecordRoutes.js';

// Default port
const PORT = process.env.PORT || 5000;

const app = express();

// Simple Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Middlewares
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Rate limiting (Disabled for development/heavy testing)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, 
//   max: 100,
// });
// app.use('/api', limiter);

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/aarti', aartiRoutes);
app.use('/api/donation', donationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/shrines', shrineRoutes);
app.use('/api/donations', donationRecordRoutes);

// Serve static assets in production
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'))
  );
} else {
  app.get('/api', (req, res) => {
    res.send('Temple API is running...');
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

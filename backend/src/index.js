import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import urlRoutes from './routes/url.routes.js';
import { redirectToUrl } from './controllers/url.controller.js';
import { createLoggerMiddleware, Log, LogLevels, LogStacks, LogPackages } from 'logging-middleware';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(createLoggerMiddleware());

// Handle redirects at root level BEFORE API routes
app.get('/:shortcode([a-zA-Z0-9-_]+)', async (req, res, next) => {
  // Skip if the path starts with /api
  if (req.path.startsWith('/api')) {
    return next();
  }
  await redirectToUrl(req, res, next);
});

// API routes
app.use('/api', urlRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  Log(LogStacks.BACKEND, LogLevels.ERROR, LogPackages.HANDLER, err.stack).catch(console.error);
  res.status(500).json({ error: 'Something broke!', details: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  Log(LogStacks.BACKEND, LogLevels.INFO, LogPackages.SERVICE, `Server is running on port ${PORT}`).catch(console.error);
  console.log(`API endpoint: http://localhost:${PORT}/api`);
  console.log(`Redirect endpoint: http://localhost:${PORT}/<shortcode>`);
}); 
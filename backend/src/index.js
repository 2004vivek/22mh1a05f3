import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import urlRoutes from './routes/url.routes.js';
import { redirectToUrl } from './controllers/url.controller.js';
import { createLoggerMiddleware, Log, LogLevels, LogStacks, LogPackages } from 'logging-middleware';


dotenv.config();


const app = express();


connectDB();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(createLoggerMiddleware());


app.get('/:shortcode([a-zA-Z0-9-_]+)', async (req, res, next) => {
 
  if (req.path.startsWith('/api')) {
    return next();
  }
  await redirectToUrl(req, res, next);
});


app.use('/api', urlRoutes);


app.use((err, req, res, next) => {
 
  res.status(500).json({ error: 'Something broke!', details: err.message });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API endpoint: http://localhost:${PORT}/api`);

}); 
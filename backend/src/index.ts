import 'dotenv/config';
import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import prisma from './lib/db';
import authRoutes from './routes/auth.routes';
import companyRoutes from './routes/company.routes';
import personRoutes from './routes/person.routes';
import activityLogRoutes from './routes/activity-log.routes';

// --- INITIALIZATION ---
const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// --- MIDDLEWARES ---
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL! 
];
app.use(cors({
  origin: (origin, callback) => {
    if (!process.env.FRONTEND_URL) {      
      return callback(new Error('CORS configuration error: FRONTEND_URL is not set.'));
    }
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin '${origin}' not allowed by CORS.`));
    }
  }
}));
app.use(morgan('dev'));
app.use(bodyParser.json());

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- APP ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/people', personRoutes);
app.use('/api/activity-logs', activityLogRoutes);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
};
app.use(errorHandler);


// --- SERVER  ---
prisma.$connect()
  .then(() => {
    console.log("✅ Database connection established.");
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running at http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Unable to connect to the database, shutting down.");
    console.error(error);
    process.exit(1);
  });
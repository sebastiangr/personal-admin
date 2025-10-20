import 'dotenv/config';
import bodyParser from 'body-parser';
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import prisma from './lib/db';
import authRoutes from './routes/auth.routes';
import companyRoutes from './routes/company.routes';
import personRoutes from './routes/person.routes';

async function main() {

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables.');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }
  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL is not defined');
  }

  const app = express();
  const allowedOrigins = [    
    'http://localhost:5173', // For development purposes
    process.env.FRONTEND_URL 
  ];
  app.use(cors({
    origin: (origin, callback) => {      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {        
        callback(new Error(`Origin'${origin}' not allowed by CORS.`));
      }
    }
  }));

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));  

  // --- ROUTES ---
  app.use('/api/auth', authRoutes);
  app.use('/api/companies', companyRoutes);
  app.use('/api/people', personRoutes);

  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  };
  app.use(errorHandler);

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3300;
  const HOST = '0.0.0.0';

  try {
    await prisma.$connect();
    console.log("✅ Conexión a la base de datos establecida.");
    
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Servidor backend corriendo y listo en http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("❌ No se pudo conectar a la base de datos. La aplicación se cerrará.");
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }  
}

main().catch((error) => {
  console.error("Error inesperado durante el arranque de la aplicación:", error);
  process.exit(1);
});
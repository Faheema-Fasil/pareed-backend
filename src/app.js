import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Enable CORS for frontend Vite client & API tools
app.use(
  cors({
    origin: true, // Allow configured origins
    credentials: true,
  })
);

// Payload size limit configuration (supports base64 image uploads from CMS)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static directory for uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// HTTP Request Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Pareed Fish Trading API Server',
    status: 'online',
    healthCheck: '/api/health',
  });
});

// API Routes
app.use('/api', routes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;

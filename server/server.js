import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, getDBStatus } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

// Connect to Database (or activate graceful local store fallback)
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Health Check & Database Status
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'online',
    appName: 'VERDE / Green Hole Luxury Fashion API',
    version: '1.0.0',
    database: dbStatus.type,
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Green Hole E-Commerce Server running on http://localhost:${PORT}`);
    console.log(`📦 Database: ${getDBStatus().type}`);
  });
}

export default app;

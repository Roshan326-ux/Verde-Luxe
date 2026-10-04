import mongoose from 'mongoose';
import dns from 'dns';

// Resolve DNS SRV issue common on Windows/ISPs
dns.setServers(['8.8.8.8', '8.8.4.4']);

let isMongoConnected = false;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    isMongoConnected = true;
    return true;
  }
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greenhole_fashion';
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    isMongoConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.log(`⚠️ MongoDB connection note: ${error.message}`);
    console.log(`ℹ️ Running with persistent local in-memory store. Set MONGO_URI in server/.env when you want to connect to MongoDB Atlas or local Compass.`);
    return false;
  }
};

export const getDBStatus = () => ({
  isMongoConnected,
  type: isMongoConnected ? 'MongoDB (Live)' : 'In-Memory Mock Store (Active Fallback)'
});

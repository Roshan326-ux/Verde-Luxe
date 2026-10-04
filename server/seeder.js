import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dns from 'dns';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import { sampleProducts } from './data/products.js';

// Resolve DNS SRV issue common on Windows/ISPs
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greenhole_fashion';
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing records
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create Admin and Customer users
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'VerdeAdmin@2026', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);

    const createdUsers = await User.insertMany([
      {
        name: 'Atelier Admin',
        email: 'admin@verdeluxe.com',
        password: adminPassword,
        role: 'admin'
      },
      {
        name: 'Store Admin',
        email: 'admin@greenhole.com',
        password: adminPassword,
        role: 'admin'
      },
      {
        name: 'Demo Customer',
        email: 'customer@greenhole.com',
        password: customerPassword,
        role: 'customer'
      }
    ]);

    const adminUser = createdUsers[0]._id;

    // Attach admin user to sample products
    const sampleProductsWithUser = sampleProducts.map(product => ({
      ...product,
      user: adminUser
    }));

    await Product.insertMany(sampleProductsWithUser);

    console.log('✅ Successfully seeded Fashion Products, Admin and Customer Users!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();

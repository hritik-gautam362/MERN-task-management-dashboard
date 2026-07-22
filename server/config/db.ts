import mongoose from 'mongoose';

export let isMongoDBConnected = false;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>')) {
    console.log('ℹ️ MONGODB_URI not set or contains placeholder. Operating in fallback mock DB / local persistence mode.');
    isMongoDBConnected = false;
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    isMongoDBConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${(error as Error).message}`);
    console.log('ℹ️ Falling back to in-memory/JSON storage engine for preview environment.');
    isMongoDBConnected = false;
  }
};

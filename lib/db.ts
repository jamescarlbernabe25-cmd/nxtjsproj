import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); 

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads 
 * in development. This prevents your database connections from growing 
 * exponentially during API route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// 1. Tell TypeScript that 'global' has a mongoose property
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn;
  }

  // inside async function dbConnect() { ...
  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      // REMOVE the two unsupported lines (useNewUrlParser and useUnifiedTopology)
    };

    cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("✅ Database connected via Standard Connection");
      return mongoose;
    });
  }

  
  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;

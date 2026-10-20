import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './env.js';

let mongod = null;
let isInMemory = false;

export async function connectDB() {
  // If explicitly requested or as fallback
  if (config.useInMemoryDb) {
    return await startInMemoryMongo();
  }

  try {
    console.log(`[DB] Attempting connection to MongoDB at ${config.mongoUri}...`);
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2500, // fast fail to fallback if no local mongo daemon
    });
    console.log(`[DB] Successfully connected to MongoDB: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[DB] Local MongoDB connection failed (${err.message}). Starting MongoMemoryServer fallback...`);
    return await startInMemoryMongo();
  }
}

async function startInMemoryMongo() {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    isInMemory = true;
    console.log(`[DB] Connected to in-memory MongoDB at ${uri}`);
    return conn;
  } catch (memErr) {
    console.error(`[DB] MongoMemoryServer could not start: ${memErr.message}`);
    console.log(`[DB] Using internal fallback memory store for high reliability.`);
    isInMemory = true;
    return null;
  }
}

export function isDbInMemory() {
  return isInMemory;
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (e) {
    console.error('[DB] Error during disconnect:', e);
  }
}

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment variables.");
}

const globalForMongo = globalThis;

let clientPromise = globalForMongo._mongoClientPromise;

if (!clientPromise) {
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 5_000,
    connectTimeoutMS: 5_000,
    socketTimeoutMS: 10_000,
  });
  clientPromise = client.connect().catch((error) => {
    globalForMongo._mongoClientPromise = undefined;
    throw error;
  });
  globalForMongo._mongoClientPromise = clientPromise;
}

export async function getDb() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || "trendystory";
  return client.db(dbName);
}

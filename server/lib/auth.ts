import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

// 1. Load the .env file immediately
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// 2. Check if it exists
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env file");
}

const client = new MongoClient(MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: { 
        enabled: true, 
    }, 
});
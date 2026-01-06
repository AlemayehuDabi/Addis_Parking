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
    basePath: "/api/auth",
    baseURL: "http://localhost:3000", 
    trustedOrigins: [
        'http://localhost:8080', 'addis-parking.vercel.app'
    ],
    advanced: {
        cookiePrefix: "better-auth",
        // If on localhost (HTTP), Secure must be false
        // If on Production (HTTPS), Secure must be true
        crossSiteCookies: true, 
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        },
        apple: {
            clientId: process.env.APPLE_CLIENT_ID as string, 
            clientSecret: process.env.APPLE_CLIENT_SECRET as string, 
        }
    }
});
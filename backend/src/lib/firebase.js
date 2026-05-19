import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(
    `Missing Firebase credentials. Please set ${missing.join(", ")} in backend/.env before starting the server.`
  );
}

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey
    })
  });
}

export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;

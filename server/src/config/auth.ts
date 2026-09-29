import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";
import dotenv from "dotenv";

dotenv.config();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: schema
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8080",
  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    ...(process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean)
      : [])
  ],
  user: {
    additionalFields: {
      role: { type: "string", required: true, defaultValue: "Kader" },
      kelurahan: { type: "string", required: false },
      rw: { type: "string", required: false },
      isPermanent: { type: "boolean", required: false, defaultValue: false }
    }
  },
  session: {
    expiresIn: 60 * 60 * 12, // Sesi kedaluwarsa setelah 12 jam tidak dibuka
    updateAge: 60 * 60 * 1 // Perbarui waktu sesi jika pengguna aktif lagi setelah 1 jam
  }
});

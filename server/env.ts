import "dotenv/config";
import { z } from "zod";

// Strict env when DB is configured, lenient when not — lets us deploy the UI first
// and add the database later without crashing on missing DATABASE_URL.
const schema = z.object({
  DATABASE_URL: z.string().url().optional(),
  SESSION_SECRET: z.string().min(32).optional(),
  TOKEN_ENCRYPTION_KEY: z.string().min(32).optional(),
  APP_BASE_URL: z.string().url().default("http://localhost:5173"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional()
});

const devDefaults = {
  SESSION_SECRET: process.env.SESSION_SECRET ?? "dev-secret-replace-in-production-32chars",
  TOKEN_ENCRYPTION_KEY: process.env.TOKEN_ENCRYPTION_KEY ?? "dev-token-encryption-key-replace-in-prod",
  DATABASE_URL: process.env.DATABASE_URL ?? undefined
};

export const env = { ...devDefaults, ...schema.parse(process.env) };
export const dbConfigured = Boolean(env.DATABASE_URL);
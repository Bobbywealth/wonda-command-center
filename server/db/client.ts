import { dbConfigured, env } from "../env.js";

// Lazy DB client — only initializes when DATABASE_URL is set. Routes can call
// `getDb()` and gracefully fall back to mock data when DB is absent.
let _db: any = null;
let _pool: any = null;

export async function getDb() {
  if (!dbConfigured) return null;
  if (_db) return _db;
  const pg = await import("pg");
  const { drizzle } = await import("drizzle-orm/node-postgres");
  _pool = new pg.default.Pool({ connectionString: env.DATABASE_URL, max: 5 });
  _db = drizzle(_pool);
  return _db;
}

export const dbReady = dbConfigured;
export const db = null; // legacy export — routes should use getDb()
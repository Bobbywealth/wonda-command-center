import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import { env } from "../env.js";

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
const db = drizzle(pool);

console.log("[wonda] running migrations…");
await migrate(db, { migrationsFolder: "./drizzle" });
console.log("[wonda] migrations complete");
await pool.end();
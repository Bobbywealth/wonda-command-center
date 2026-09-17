import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import { env } from "../env.js";
import { getDb } from "../db/client.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export type Role = "owner" | "assistant" | "finance_manager";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthedRequest extends Request {
  user?: AuthUser;
  csrfToken?: string;
}

export function signSession(userId: string): string {
  const payload = `${userId}.${Date.now()}`;
  const sig = crypto.createHmac("sha256", env.SESSION_SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySession(token: string): string | null {
  const [userId, ts, sig] = token.split(".");
  if (!userId || !ts || !sig) return null;
  const expected = crypto.createHmac("sha256", env.SESSION_SECRET).update(`${userId}.${ts}`).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return userId;
}

const MOCK_USER_MAP: Record<string, AuthUser> = {
  "mock-owner-1": { id: "mock-owner-1", email: "jerry@wolfpaqmarketing.com", name: "Jerry Duplessis", role: "owner" },
  "mock-asst-1": { id: "mock-asst-1", email: "sarah@wolfpaqmarketing.com", name: "Sarah Mitchell", role: "assistant" },
  "mock-fin-1": { id: "mock-fin-1", email: "david@wolfpaqmarketing.com", name: "David Chen", role: "finance_manager" }
};

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.wonda_session;
  if (!token) return res.status(401).json({ error: "not_authenticated" });
  const userId = verifySession(token);
  if (!userId) return res.status(401).json({ error: "invalid_session" });

  if (MOCK_USER_MAP[userId]) {
    req.user = MOCK_USER_MAP[userId];
    return next();
  }

  const db = await getDb();
  if (!db) return res.status(500).json({ error: "db_not_configured" });
  const [row] = await db.select().from(users).where(eq(users.id, userId));
  if (!row) return res.status(401).json({ error: "user_not_found" });

  req.user = { id: row.id, email: row.email, name: row.name, role: row.role };
  next();
}

export function requireRole(...allowed: Role[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "not_authenticated" });
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ error: "forbidden", required: allowed });
    }
    next();
  };
}

export function requireOwner(req: AuthedRequest, res: Response, next: NextFunction) {
  return requireRole("owner")(req, res, next);
}
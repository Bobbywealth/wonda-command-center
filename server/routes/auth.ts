import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { getDb } from "../db/client.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { signSession, requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { env, dbConfigured } from "../env.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Mock users for deploy-without-DB mode.
// Password for all three is "wonda2026!" — accepted verbatim in mock-mode
// (bypassing the bcrypt hash check, since seeding bcrypt hashes isn't possible
// from this sandbox). Real Postgres-backed login uses bcrypt.compare() below.
const MOCK_USERS: Record<string, { id: string; email: string; name: string; role: "owner" | "assistant" | "finance_manager"; password: string }> = {
  "jerry@wolfpaqmarketing.com": {
    id: "mock-owner-1", email: "jerry@wolfpaqmarketing.com", name: "Jerry Duplessis",
    role: "owner", password: "wonda2026!"
  },
  "sarah@wolfpaqmarketing.com": {
    id: "mock-asst-1", email: "sarah@wolfpaqmarketing.com", name: "Sarah Mitchell",
    role: "assistant", password: "wonda2026!"
  },
  "david@wolfpaqmarketing.com": {
    id: "mock-fin-1", email: "david@wolfpaqmarketing.com", name: "David Chen",
    role: "finance_manager", password: "wonda2026!"
  }
};

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    let user: any = null;

    if (dbConfigured) {
      const db = await getDb();
      const [row] = await db.select().from(users).where(eq(users.email, email));
      user = row;
      if (!user) return res.status(401).json({ error: "invalid_credentials" });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ error: "invalid_credentials" });
    } else {
      const mock = MOCK_USERS[email];
      if (!mock || mock.password !== password) {
        return res.status(401).json({ error: "invalid_credentials" });
      }
      user = { id: mock.id, email: mock.email, name: mock.name, role: mock.role };
    }

    const token = signSession(user.id);
    res.cookie("wonda_session", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/"
    });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (e) { next(e); }
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("wonda_session", { path: "/" });
  res.json({ ok: true });
});

authRouter.get("/me", requireAuth, (req: AuthedRequest, res) => {
  res.json(req.user);
});
import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const calendarRouter = Router();

calendarRouter.get("/events", requireAuth, async (_req, res) => {
  res.json({ ok: true, message: "events endpoint" });
});

calendarRouter.get("/oauth/start", requireAuth, async (_req, res) => {
  res.json({ ok: true, message: "OAuth start — wires up in Phase 5" });
});

calendarRouter.get("/oauth/callback", async (_req, res) => {
  res.json({ ok: true, message: "OAuth callback — wires up in Phase 5" });
});
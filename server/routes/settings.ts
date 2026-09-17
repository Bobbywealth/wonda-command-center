import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const settingsRouter = Router();

settingsRouter.get("/", requireAuth, (_req, res) => {
  res.json({ ok: true });
});
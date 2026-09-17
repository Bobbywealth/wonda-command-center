import { Router } from "express";
import { requireAuth, requireOwner, type AuthedRequest } from "../middleware/auth.js";

export const teamRouter = Router();

teamRouter.use(requireAuth);

teamRouter.get("/", (_req, res) => {
  res.json([
    { id: "1", name: "Jerry Duplessis", email: "jerry@wolfpaqmarketing.com", role: "owner", status: "online", avatarUrl: null },
    { id: "2", name: "Sarah Mitchell", email: "sarah@wolfpaqmarketing.com", role: "assistant", status: "1h ago", avatarUrl: null },
    { id: "3", name: "David Chen", email: "david@wolfpaqmarketing.com", role: "finance_manager", status: "online", avatarUrl: null }
  ]);
});

teamRouter.post("/invite", requireOwner, (_req, res) => {
  res.json({ ok: true, message: "invite sent" });
});
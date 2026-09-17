import { Router } from "express";
import { requireAuth, requireOwner, type AuthedRequest } from "../middleware/auth.js";

export const socialRouter = Router();

socialRouter.use(requireAuth);

socialRouter.get("/accounts", (_req, res) => {
  res.json([
    { id: "1", platform: "instagram", handle: "@princewonda", status: "connected", followers: 570_000 },
    { id: "2", platform: "x", handle: "@princewonda", status: "disconnected", followers: 0 },
    { id: "3", platform: "tiktok", handle: "@jerrywonda", status: "disconnected", followers: 0 },
    { id: "4", platform: "threads", handle: "@princewonda", status: "disconnected", followers: 0 },
    { id: "5", platform: "facebook", handle: "princewonda1", status: "disconnected", followers: 0 },
    { id: "6", platform: "youtube", handle: "WondaMusic", status: "disconnected", followers: 0 },
    { id: "7", platform: "linkedin", handle: "jerry-wonda-duplessis", status: "disconnected", followers: 0 }
  ]);
});

socialRouter.post("/posts", (_req, res) => {
  res.json({ ok: true, message: "draft created" });
});

socialRouter.post("/posts/:id/approve", requireOwner, (_req, res) => {
  res.json({ ok: true });
});
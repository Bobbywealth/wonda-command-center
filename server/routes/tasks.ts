import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const tasksRouter = Router();

tasksRouter.get("/my-day", requireAuth, async (_req, res) => {
  res.json({
    progress: { done: 4, total: 8 },
    items: [
      { id: "1", time: "09:30", title: "Email reply — promoter", status: "done", accent: "gold", label: "Inbox" },
      { id: "2", time: "10:00", title: "Mentee session — Marcus West", status: "active", accent: "gold", label: "Academy" },
      { id: "3", time: "11:30", title: "Review invoice for Platinum Sound session", status: "active", accent: "violet", label: "Finance" },
      { id: "4", time: "13:00", title: "Call with Yéle Haiti team", status: "overdue", accent: "rose", label: "Haiti" },
      { id: "5", time: "15:00", title: "Approve social posts for the week", status: "active", accent: "gold", label: "Social" },
      { id: "6", time: "17:00", title: "Studio check-in — Atmos buildout", status: "active", accent: "gold", label: "Platinum Sound" }
    ]
  });
});
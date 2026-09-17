import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const overviewRouter = Router();

overviewRouter.get("/", requireAuth, async (req: AuthedRequest, res) => {
  // Owner sees everything; assistant sees everything except financial KPIs; finance_manager sees financial view only
  res.json({
    greeting: "Good morning, Jerry",
    kpis: {
      studioUtilization: 78,
      activeProjects: 11,
      openTasks: 24,
      socialReach7d: 2_400_000
    },
    legacyStrip: ["3 GRAMMYS", "16+ NOMINATIONS", "300M+ RECORDS", "300+ CATALOG TITLES", "1 DIAMOND ALBUM"]
  });
});
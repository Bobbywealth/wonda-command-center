import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const projectsRouter = Router();

projectsRouter.get("/", requireAuth, async (_req, res) => {
  // Seed list — replaced by DB reads in Phase 2
  res.json([
    { id: "1", name: "Booga Basement Archive", type: "creative", status: "active", progressPct: 35 },
    { id: "2", name: "Platinum Sound Academy — Summer Cohort", type: "academy", status: "active", progressPct: 72 },
    { id: "3", name: "Haiti On The Go", type: "humanitarian", status: "active", progressPct: 58 },
    { id: "4", name: "The Other Side of Newark", type: "civic", status: "active", progressPct: 64 },
    { id: "5", name: "Music Mentorship Program", type: "civic", status: "active", progressPct: 81 },
    { id: "6", name: "Wonda Music Catalog Admin", type: "label", status: "active", progressPct: 22 },
    { id: "7", name: "Newark Symphony Hall Board", type: "civic", status: "active", progressPct: 40 },
    { id: "8", name: "Vassar Haiti Project Board", type: "humanitarian", status: "active", progressPct: 50 }
  ]);
});
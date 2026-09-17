import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const mentorshipRouter = Router();

mentorshipRouter.get("/mentees", requireAuth, async (_req, res) => {
  res.json([
    { id: "1", name: "Marcus West", school: "West Side High", discipline: "Producer", sessions: 14, lastSession: "2026-09-12",
      skills: { Production: 72, Engineering: 58, Songwriting: 41, Business: 30 } },
    { id: "2", name: "Zara Chen", school: "Arts High", discipline: "Engineer", sessions: 22, lastSession: "2026-09-15",
      skills: { Production: 48, Engineering: 84, Songwriting: 35, Business: 22 } },
    { id: "3", name: "DeAndre Brown", school: "Barringer", discipline: "Songwriter", sessions: 9, lastSession: "2026-09-08",
      skills: { Production: 38, Engineering: 24, Songwriting: 79, Business: 18 } },
    { id: "4", name: "Lila Romero", school: "East Side High", discipline: "Producer", sessions: 18, lastSession: "2026-09-14",
      skills: { Production: 65, Engineering: 51, Songwriting: 60, Business: 28 } },
    { id: "5", name: "Jalen Pierce", school: "Newark Global Studies", discipline: "Artist", sessions: 6, lastSession: "2026-09-05",
      skills: { Production: 22, Engineering: 18, Songwriting: 55, Business: 12 } },
    { id: "6", name: "Aaliyah Foster", school: "Technology High", discipline: "Engineer", sessions: 31, lastSession: "2026-09-16",
      skills: { Production: 58, Engineering: 91, Songwriting: 32, Business: 41 } }
  ]);
});
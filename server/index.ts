import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./env.js";
import { authRouter } from "./routes/auth.js";
import { projectsRouter } from "./routes/projects.js";
import { tasksRouter } from "./routes/tasks.js";
import { calendarRouter } from "./routes/calendar.js";
import { mentorshipRouter } from "./routes/mentorship.js";
import { socialRouter } from "./routes/social.js";
import { financeRouter } from "./routes/finance.js";
import { teamRouter } from "./routes/team.js";
import { overviewRouter } from "./routes/overview.js";
import { settingsRouter } from "./routes/settings.js";
import { errorHandler } from "./middleware/error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({ origin: env.APP_BASE_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../web")));

app.get("/api/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/mentorship", mentorshipRouter);
app.use("/api/social", socialRouter);
app.use("/api/finance", financeRouter);
app.use("/api/team", teamRouter);
app.use("/api/overview", overviewRouter);
app.use("/api/settings", settingsRouter);

// SPA fallback — anything not /api serves the React app
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../web/index.html"));
});

app.use(errorHandler);

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`[wonda] api listening on :${port}`);
});